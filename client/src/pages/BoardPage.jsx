import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Whiteboard from '../components/Whiteboard';
import Collaboration from '../components/Collaboration';
import { ChevronLeft } from 'lucide-react';
import io from 'socket.io-client';

const BoardPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('/');
    setSocket(newSocket);

    newSocket.emit('join_room', { roomId, user });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-gradient)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 30px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
          marginBottom: '15px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--primary)',
            }}
          >
            <ChevronLeft size={26} />
          </button>

          <div>
            <h2
              className="title-gradient"
              style={{ fontSize: '1.2rem' }}
            >
              Board: {roomId}
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              Collaborating as {user?.name}
            </p>
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.9rem' }}
        >
          Copy Room ID
        </button>
      </header>

      {/* Main Layout */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          gap: '15px',
          overflow: 'hidden',
        }}
      >
        {/* Whiteboard Area */}
        <div
          style={{
            flex: 3,
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <Whiteboard roomId={roomId} socket={socket} user={user} />
        </div>

        {/* Collaboration Panel */}
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <Collaboration socket={socket} roomId={roomId} user={user} />
        </div>
      </main>
    </div>
  );
};

export default BoardPage;