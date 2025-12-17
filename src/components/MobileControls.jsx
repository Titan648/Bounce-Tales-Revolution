import { motion } from 'framer-motion';

export default function MobileControls({ onControl }) {
  const buttonStyle = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      right: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      zIndex: 15,
      pointerEvents: 'none'
    }}>
      {/* Left/Right Controls */}
      <div style={{
        display: 'flex',
        gap: '15px',
        pointerEvents: 'auto'
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => onControl('left-start')}
          onTouchEnd={() => onControl('left-end')}
          style={buttonStyle}
        >
          ◀
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onTouchStart={() => onControl('right-start')}
          onTouchEnd={() => onControl('right-end')}
          style={buttonStyle}
        >
          ▶
        </motion.button>
      </div>

      {/* Jump Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onTouchStart={() => onControl('jump')}
        style={{
          ...buttonStyle,
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          fontSize: '28px',
          pointerEvents: 'auto'
        }}
      >
        ⬆
      </motion.button>
    </div>
  );
}

