import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 30px',
            zIndex: 1000,
            borderRadius: '20px'
        }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                <div style={{
                    background: 'var(--primary)',
                    width: '35px',
                    height: '35px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Layout size={20} />
                </div>
                <h2 className="title-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>CollaborateX</h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '500' }}>Dashboard</Link>
                        <button
                            onClick={logout}
                            className="btn-primary"
                            style={{ background: '#ef4444', padding: '8px 20px', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/auth" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '500' }}>Features</Link>
                        <button
                            onClick={() => navigate('/auth')}
                            className="btn-primary"
                            style={{ padding: '8px 25px', fontSize: '0.9rem' }}
                        >
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
