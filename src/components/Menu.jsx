import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Menu({ onStart, onShowLeaderboard, lastScore, lastLevel }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(24px, 6vw, 48px)',
          marginBottom: '10px',
          textShadow: '4px 4px 0px rgba(0,0,0,0.3)',
          color: '#FFD700'
        }}>
          BOUNCE TALES
        </h1>
        
        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          marginBottom: '40px',
          opacity: 0.9
        }}>
          Roll, Jump & Collect!
        </p>

        {lastScore > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: '15px',
              marginBottom: '30px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p style={{ fontSize: '16px', marginBottom: '5px' }}>Last Game</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Score: {lastScore} | Level: {lastLevel}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            style={{
              padding: '15px 20px',
              fontSize: '18px',
              borderRadius: '50px',
              border: 'none',
              outline: 'none',
              width: '280px',
              maxWidth: '90vw',
              textAlign: 'center',
              fontFamily: 'Fredoka',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              padding: '15px 50px',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#333',
              cursor: 'pointer',
              fontFamily: 'Fredoka',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              display: 'block',
              width: '280px',
              maxWidth: '90vw',
              margin: '0 auto'
            }}
          >
            START GAME
          </motion.button>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowLeaderboard}
          style={{
            padding: '12px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '50px',
            border: '2px solid white',
            background: 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'Fredoka',
            marginTop: '10px'
          }}
        >
          LEADERBOARD
        </motion.button>

        <div style={{
          marginTop: '40px',
          fontSize: '14px',
          opacity: 0.8,
          maxWidth: '400px'
        }}>
          <p style={{ marginBottom: '10px' }}>🎮 Controls:</p>
          <p>Desktop: Arrow Keys or A/D to move, Space/W to jump</p>
          <p>Mobile: Touch left/right to move, tap jump button</p>
        </div>
      </motion.div>
    </div>
  );
}

