import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
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
      padding: '20px',
      overflowY: 'auto'
    }}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          maxWidth: '600px',
          width: '100%'
        }}
      >
        <h1 style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: 'clamp(20px, 5vw, 36px)',
          marginBottom: '30px',
          textAlign: 'center',
          textShadow: '3px 3px 0px rgba(0,0,0,0.3)',
          color: '#FFD700'
        }}>
          LEADERBOARD
        </h1>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          marginBottom: '20px'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
          ) : scores.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>No scores yet. Be the first!</p>
          ) : (
            <div>
              {scores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    marginBottom: '10px',
                    background: index < 3 
                      ? 'linear-gradient(135deg, rgba(255,215,0,0.3) 0%, rgba(255,165,0,0.3) 100%)'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    borderLeft: index < 3 ? '4px solid #FFD700' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      minWidth: '30px',
                      color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'white'
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        {score.player_name}
                      </p>
                      <p style={{ fontSize: '14px', opacity: 0.8 }}>
                        Level {score.level}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>
                      {score.score}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          style={{
            padding: '15px 50px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#333',
            cursor: 'pointer',
            fontFamily: 'Fredoka',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            display: 'block',
            margin: '0 auto'
          }}
        >
          BACK TO MENU
        </motion.button>
      </motion.div>
    </div>
  );
}

