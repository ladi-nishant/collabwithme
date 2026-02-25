import React, { useRef, useEffect, useState } from 'react';
import Toolbar from './Toolbar';

const Whiteboard = ({ roomId, socket, user }) => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#000000');
    const [size, setSize] = useState(5);
    const [tool, setTool] = useState('pencil');
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        socket.on('drawing', (data) => {
            const { x0, y0, x1, y1, color, size } = data;
            drawLine(x0, y0, x1, y1, color, size, false);
        });

        socket.on('load_board', (strokes) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            strokes.forEach(s => drawLine(s.x0, s.y0, s.x1, s.y1, s.color, s.size, false));
        });

        socket.on('clear_board', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        return () => {
            socket.off('drawing');
            socket.off('load_board');
            socket.off('clear_board');
        };
    }, [socket]);

    const drawLine = (x0, y0, x1, y1, color, size, emit = true) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();

        if (emit && socket) {
            socket.emit('drawing', { roomId, x0, y0, x1, y1, color, size });
        }
    };

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const onMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        canvasRef.current.lastX = x;
        canvasRef.current.lastY = y;
    };

    const onMouseMove = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const drawColor = tool === 'eraser' ? '#ffffff' : color;
        drawLine(canvasRef.current.lastX, canvasRef.current.lastY, x, y, drawColor, size);

        // Add to history for local undo
        setHistory(prev => [...prev, { x0: canvasRef.current.lastX, y0: canvasRef.current.lastY, x1: x, y1: y, color: drawColor, size }]);
        setRedoStack([]); // Clear redo stack on new action

        canvasRef.current.lastX = x;
        canvasRef.current.lastY = y;
    };

    const onMouseUp = () => {
        setIsDrawing(false);
    };

    const undo = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const removedAction = newHistory.pop();
        setRedoStack(prev => [...prev, removedAction]);
        setHistory(newHistory);
        redraw(newHistory);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const newRedoStack = [...redoStack];
        const action = newRedoStack.pop();
        setRedoStack(newRedoStack);
        setHistory(prev => [...prev, action]);
        drawLine(action.x0, action.y0, action.x1, action.y1, action.color, action.size);
    };

    const redraw = (historyToDraw) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        historyToDraw.forEach(s => drawLine(s.x0, s.y0, s.x1, s.y1, s.color, s.size, false));
        // Optional: emit full board state to sync others, but usually undo is local/controlled by host
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
        setRedoStack([]);
        if (socket) socket.emit('clear_board', { roomId });
    };

    const exportImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `whiteboard-${roomId}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = () => {
        const canvas = canvasRef.current;
        const stream = canvas.captureStream(30); // 30 FPS
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `recording-${roomId}.webm`;
            link.click();
            URL.revokeObjectURL(url);
        };

        recorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="whiteboard-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <Toolbar
                color={color} setColor={setColor}
                size={size} setSize={setSize}
                tool={tool} setTool={setTool}
                clearBoard={clearBoard}
                undo={undo} redo={redo}
                exportImage={exportImage}
                recording={recording}
                startRecording={startRecording}
                stopRecording={stopRecording}
            />
            <canvas
                ref={canvasRef}
                width={1920}
                height={1080}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseOut={onMouseUp}
                className="glass-panel"
                style={{ cursor: tool === 'pencil' ? 'crosshair' : 'default', background: 'white', width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default Whiteboard;
