import mongoose from 'mongoose';

const whiteboardSchema = mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        strokes: [
            {
                x0: Number,
                y0: Number,
                x1: Number,
                y1: Number,
                color: String,
                size: Number,
            }
        ],
        chat: [
            {
                user: String,
                text: String,
                time: String,
            }
        ],
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const Whiteboard = mongoose.model('Whiteboard', whiteboardSchema);

export default Whiteboard;
