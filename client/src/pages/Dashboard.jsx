import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, LogIn, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 9);
    navigate(`/board/${roomId}`);
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      navigate(`/board/${roomInput}`);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '30px',
        background: 'var(--bg-gradient)',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 35px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
          marginBottom: '50px',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h1
            className="title-gradient"
            style={{ fontSize: '2.2rem', marginBottom: '4px' }}
          >
            CollaborateX
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
            }}
          >
            Welcome, {user?.name}
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: '0.3s',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Main Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '70px 60px',
            width: '100%',
            maxWidth: '850px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>

          <h2
            style={{
              fontSize: '2.5rem',
              marginBottom: '15px',
              fontWeight: '700',
            }}
          >
            Start Collaborating
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              marginBottom: '45px',
              fontSize: '1.1rem',
            }}
          >
            Create a private board or join an existing session to draw and
            chat in real-time.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '25px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Create Button */}
            <button
              onClick={createRoom}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 36px',
                fontSize: '1.1rem',
              }}
            >
              <Plus size={22} />
              Create Board
            </button>

            {/* Join Section */}
            <div
              style={{
                display: 'flex',
                borderRadius: '50px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
              }}
            >
              <input
                type="text"
                placeholder="Enter Room ID"
                className="input-field"
                style={{
                  marginBottom: 0,
                  border: 'none',
                  borderRadius: 0,
                  width: '240px',
                }}
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
              />

              <button
                onClick={joinRoom}
                className="btn-primary"
                style={{
                  borderRadius: 0,
                  padding: '0 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <LogIn size={20} />
                Join
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;