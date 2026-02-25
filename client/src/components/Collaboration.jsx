import React, { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import ScreenShare from './ScreenShare';

const Collaboration = ({ socket, roomId, user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [hostId, setHostId] = useState(null);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null); // Ref for the hidden file input

    useEffect(() => {
        if (!socket) return;

        socket.on('chat_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // Handle incoming file share messages
        socket.on('file_share', (data) => {
            setMessages((prev) => [...prev, { ...data, isFile: true }]);
        });

        socket.on('load_chat', (chatHistory) => {
            setMessages(chatHistory);
        });

        socket.on('user_list', (data) => {
            setOnlineUsers(data.users);
            setHostId(data.hostId);
        });

        return () => {
            socket.off('chat_message');
            socket.off('load_chat');
            socket.off('user_list');
        };
    }, [socket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && socket) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = {
                    roomId,
                    user: user.name,
                    fileName: file.name,
                    fileType: file.type,
                    data: reader.result, // DataURL
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                socket.emit('file_share', fileData);
                setMessages((prev) => [...prev, { ...fileData, isFile: true }]);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msgData = {
                roomId,
                user: user.name,
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit('chat_message', msgData);
            setMessages((prev) => [...prev, msgData]);
            setMessage('');
        }
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                    <Users size={18} color="var(--primary)" /> Collaboration
                </h3>
                <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>
                    {onlineUsers.length || 1} online
                </span>
            </div>

            <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {onlineUsers.map((u) => (
                    <div key={u.id} title={u.name} style={{
                        width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold', border: '2px solid white', boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                    }}>
                        {u.name.charAt(0).toUpperCase()}
                    </div>
                ))}
            </div>

            <div style={{ padding: '0 15px 15px 15px' }}>
                <ScreenShare socket={socket} roomId={roomId} user={user} isHost={hostId === socket?.id} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.user === user.name ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px' }}>
                            {msg.user} • {msg.time}
                        </div>
                        <div style={{
                            background: msg.user === user.name ? 'var(--primary)' : 'white',
                            color: msg.user === user.name ? 'white' : 'var(--text-dark)',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.9rem'
                        }}>
                            {msg.isFile ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {msg.fileType.startsWith('image/') ? (
                                        <img src={msg.data} alt={msg.fileName} style={{ maxWidth: '100%', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ fontSize: '1.2rem' }}>📄</div>
                                    )}
                                    <a
                                        href={msg.data}
                                        download={msg.fileName}
                                        style={{ color: msg.user === user.name ? 'white' : 'var(--primary)', textDecoration: 'underline', fontSize: '0.8rem' }}
                                    >
                                        Download {msg.fileName}
                                    </a>
                                </div>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: '15px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    📎
                </label>
                <input
                    className="input-field"
                    style={{ marginBottom: 0, flex: 1 }}
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn-primary" style={{ padding: '10px' }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default Collaboration;
