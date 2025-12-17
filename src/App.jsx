import { useState, useEffect } from 'react';
import Game from './components/Game';
import Menu from './components/Menu';
import Leaderboard from './components/Leaderboard';
import { supabase } from './lib/supabase';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);

  const handleGameOver = async (score, level) => {
    setFinalScore(score);
    setFinalLevel(level);
    
    if (playerName && score > 0) {
      try {
        await supabase.from('leaderboard').insert({
          player_name: playerName,
          score: score,
          level: level
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    
    setScreen('menu');
  };

  const startGame = (name) => {
    setPlayerName(name);
    setScreen('game');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'menu' && (
        <Menu 
          onStart={startGame}
          onShowLeaderboard={() => setScreen('leaderboard')}
          lastScore={finalScore}
          lastLevel={finalLevel}
        />
      )}
      {screen === 'game' && (
        <Game 
          playerName={playerName}
          onGameOver={handleGameOver}
        />
      )}
      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}

