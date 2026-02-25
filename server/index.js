import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import Whiteboard from './models/whiteboardModel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Serve Static Frontend for Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    // Basic Route for Development
    app.get('/', (req, res) => {
        res.send('CollaborateX API is running...');
    });
}

// Socket.io Event Handling
const rooms = new Map(); // roomId -> Set of users {id, name}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', async (data) => {
        const { roomId, user } = data;
        socket.join(roomId);
        socket.roomId = roomId;
        socket.user = user;

        console.log(`User ${user.name} (${socket.id}) joined room ${roomId}`);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, { users: new Set(), host: socket.id });
        }
        const roomData = rooms.get(roomId);
        roomData.users.add({ id: socket.id, name: user.name });

        io.to(roomId).emit('user_list', {
            users: Array.from(roomData.users),
            hostId: roomData.host
        });

        try {
            let board = await Whiteboard.findOne({ roomId });
            if (board) {
                socket.emit('load_board', board.strokes);
                socket.emit('load_chat', board.chat);
            } else {
                await Whiteboard.create({ roomId, strokes: [], chat: [] });
            }
        } catch (err) {
            console.error('Error loading board:', err);
        }
    });

    socket.on('drawing', async (data) => {
        socket.to(data.roomId).emit('drawing', data);
        try {
            await Whiteboard.updateOne(
                { roomId: data.roomId },
                { $push: { strokes: { x0: data.x0, y0: data.y0, x1: data.x1, y1: data.y1, color: data.color, size: data.size } } }
            );
        } catch (err) {
            console.error('Error saving stroke:', err);
        }
    });

    socket.on('chat_message', async (data) => {
        socket.to(data.roomId).emit('chat_message', data);
        try {
            await Whiteboard.updateOne(
                { roomId: data.roomId },
                { $push: { chat: { user: data.user, text: data.text, time: data.time } } }
            );
        } catch (err) {
            console.error('Error saving chat:', err);
        }
    });

    socket.on('file_share', (data) => {
        socket.to(data.roomId).emit('file_share', data);
    });

    // WebRTC Signaling
    socket.on('webRTC_offer', (data) => {
        socket.to(data.target).emit('webRTC_offer', {
            offer: data.offer,
            sender: socket.id
        });
    });

    socket.on('webRTC_answer', (data) => {
        socket.to(data.target).emit('webRTC_answer', {
            answer: data.answer,
            sender: socket.id
        });
    });

    socket.on('webRTC_candidate', (data) => {
        socket.to(data.target).emit('webRTC_candidate', {
            candidate: data.candidate,
            sender: socket.id
        });
    });

    socket.on('clear_board', async (data) => {
        const roomData = rooms.get(data.roomId);
        if (roomData && roomData.host === socket.id) {
            socket.to(data.roomId).emit('clear_board');
            try {
                await Whiteboard.updateOne({ roomId: data.roomId }, { $set: { strokes: [] } });
            } catch (err) {
                console.error('Error clearing board:', err);
            }
        } else {
            socket.emit('error_message', { message: 'Only the host can clear the board.' });
        }
    });

    socket.on('request_user_list_for_sharing', (data) => {
        const roomData = rooms.get(data.roomId);
        if (roomData) {
            socket.emit('user_list_for_sharing', Array.from(roomData.users));
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.roomId && rooms.has(socket.roomId)) {
            const roomData = rooms.get(socket.roomId);

            // Remove user from the set
            let userToRemove = null;
            roomData.users.forEach(u => {
                if (u.id === socket.id) userToRemove = u;
            });

            if (userToRemove) {
                roomData.users.delete(userToRemove);
                console.log(`User ${userToRemove.name} removed from room ${socket.roomId}`);
            }

            // If room empty, delete it. If host disconnected, assign new host or delete.
            if (roomData.users.size === 0) {
                rooms.delete(socket.roomId);
            } else {
                if (roomData.host === socket.id) {
                    const nextUser = roomData.users.values().next().value;
                    roomData.host = nextUser.id;
                }

                // Update all remaining users
                io.to(socket.roomId).emit('user_list', {
                    users: Array.from(roomData.users),
                    hostId: roomData.host
                });
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
