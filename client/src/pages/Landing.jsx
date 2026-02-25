import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MousePointer2, Users, Zap, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MousePointer2 size={24} />,
      title: 'Real-time Drawing',
      desc: 'Experience lag-free collaborative drawing with our optimized canvas engine.',
    },
    {
      icon: <Users size={24} />,
      title: 'Multi-user Collaboration',
      desc: 'Invite your team and brainstorm together in private, secure rooms.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Instant Sharing',
      desc: 'Share your board instantly with zero setup required.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      desc: 'Your sessions are encrypted and private by default.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-gradient)',
      }}
    >
      <Navbar />

      {/* HERO */}
      <section
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 100px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                lineHeight: 1.1,
                marginBottom: '25px',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              Collaborate{' '}
              <span className="title-gradient">Together</span>, <br />
              Anywhere.
            </h1>

            <p
              style={{
                fontSize: '1.25rem',
                color: '#e0e0e0',
                marginBottom: '45px',
                maxWidth: '700px',
                marginInline: 'auto',
              }}
            >
              The ultimate real-time whiteboard for teams. Draw, plan,
              and execute your best ideas with zero friction.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
                style={{
                  padding: '16px 45px',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                }}
              >
                Start Drawing
              </button>

              <button
                style={{
                  padding: '16px 45px',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  border: '2px solid #ffffff',
                  background: 'transparent',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: '0.3s',
                }}
              >
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          padding: '90px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            marginInline: 'auto',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '30px',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '35px',
                borderRadius: '20px',
                background: '#ffffff',
                boxShadow:
                  '0 20px 50px rgba(0,0,0,0.15)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--primary))',
                  width: '55px',
                  height: '55px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#ffffff',
                }}
              >
                {f.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '12px',
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          marginTop: 'auto',
          color: '#e0e0e0',
        }}
      >
        © 2026 CollaborateX. Built for creators by{' '}
        <span
          className="title-gradient"
          style={{ fontWeight: 'bold' }}
        >
          Ladi Nishant
        </span>
      </footer>
    </div>
  );
};

export default Landing;