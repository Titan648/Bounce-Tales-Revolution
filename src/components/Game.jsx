import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameEngine from '../game/GameEngine';
import MobileControls from './MobileControls';

export default function Game({ playerName, onGameOver }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onScoreUpdate: setScore,
      onLevelUpdate: setLevel,
      onLivesUpdate: setLives,
      onGameOver: () => {
        setGameOver(true);
      }
    });

    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  const handlePause = () => {
    if (engineRef.current) {
      if (paused) {
        engineRef.current.resume();
      } else {
        engineRef.current.pause();
      }
      setPaused(!paused);
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.restart();
      setGameOver(false);
      setPaused(false);
    }
  };

  const handleQuit = () => {
    onGameOver(score, level);
  };

  const handleMobileControl = (action) => {
    if (engineRef.current) {
      engineRef.current.handleMobileInput(action);
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
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      position: 'relative'
    }}>
      {/* HUD */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 20px',
          borderRadius: '10px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          backdropFilter: 'blur(5px)'
        }}>
          Score: {score}
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 20px',
          borderRadius: '10px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          backdropFilter: 'blur(5px)'
        }}>
          Level: {level}
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '10px 20px',
          borderRadius: '10px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          gap: '5px'
        }}>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>❤️</span>
          ))}
        </div>

        <button
          onClick={handlePause}
          style={{
            background: 'rgba(0,0,0,0.6)',
            padding: '10px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
        >
          {paused ? '▶️ Resume' : '⏸️ Pause'}
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          imageRendering: 'crisp-edges'
        }}
      />

      {/* Mobile Controls */}
      {isMobile && !paused && !gameOver && (
        <MobileControls onControl={handleMobileControl} />
      )}

      {/* Pause Menu */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              gap: '20px'
            }}
          >
            <h2 style={{
              color: 'white',
              fontSize: '36px',
              fontFamily: "'Press Start 2P', cursive",
              marginBottom: '20px'
            }}>
              PAUSED
            </h2>
            
            <button
              onClick={handlePause}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#333',
                cursor: 'pointer',
                fontFamily: 'Fredoka'
              }}
            >
              Resume
            </button>

            <button
              onClick={handleRestart}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                border: '2px solid white',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Fredoka'
              }}
            >
              Restart
            </button>

            <button
              onClick={handleQuit}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                border: '2px solid white',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Fredoka'
              }}
            >
              Quit to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Menu */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              gap: '20px'
            }}
          >
            <h2 style={{
              color: '#FF6B6B',
              fontSize: 'clamp(24px, 6vw, 48px)',
              fontFamily: "'Press Start 2P', cursive",
              marginBottom: '20px',
              textAlign: 'center',
              padding: '0 20px'
            }}>
              GAME OVER
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px 40px',
              borderRadius: '15px',
              textAlign: 'center',
              color: 'white'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>Final Score</p>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#FFD700' }}>{score}</p>
              <p style={{ fontSize: '16px', marginTop: '10px' }}>Level {level}</p>
            </div>
            
            <button
              onClick={handleRestart}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#333',
                cursor: 'pointer',
                fontFamily: 'Fredoka'
              }}
            >
              Play Again
            </button>

            <button
              onClick={handleQuit}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '50px',
                border: '2px solid white',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontFamily: 'Fredoka'
              }}
            >
              Back to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

