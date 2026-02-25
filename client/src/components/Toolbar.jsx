import { Pencil, Eraser, Trash2, Undo, Redo, Download, Video, VideoOff } from 'lucide-react';

const Toolbar = ({ color, setColor, size, setSize, tool, setTool, clearBoard, undo, redo, exportImage, recording, startRecording, stopRecording }) => {
    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '20px',
            padding: '10px 20px',
            zIndex: 10,
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => setTool('pencil')}
                    title="Pencil"
                    style={{ padding: '8px', borderRadius: '8px', background: tool === 'pencil' ? 'var(--primary)' : 'transparent', color: tool === 'pencil' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => setTool('eraser')}
                    title="Eraser"
                    style={{ padding: '8px', borderRadius: '8px', background: tool === 'eraser' ? 'var(--primary)' : 'transparent', color: tool === 'eraser' ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
                >
                    <Eraser size={18} />
                </button>
            </div>

            <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>

            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Color Picker"
                style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            />

            <input
                type="range"
                min="1" max="50"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                title="Brush Size"
                style={{ width: '80px' }}
            />

            <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>

            <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={undo} title="Undo" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', color: 'black', border: 'none', cursor: 'pointer' }}>
                    <Undo size={18} />
                </button>
                <button onClick={redo} title="Redo" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', color: 'black', border: 'none', cursor: 'pointer' }}>
                    <Redo size={18} />
                </button>
            </div>

            <div style={{ height: '24px', width: '1px', background: 'var(--glass-border)' }}></div>

            <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={exportImage} title="Export as Image" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}>
                    <Download size={18} />
                </button>
                <button
                    onClick={recording ? stopRecording : startRecording}
                    title={recording ? "Stop Recording" : "Record Session"}
                    style={{ padding: '8px', borderRadius: '8px', background: 'transparent', color: recording ? '#ef4444' : 'black', border: 'none', cursor: 'pointer' }}
                >
                    {recording ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
                <button onClick={clearBoard} title="Clear Board" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
