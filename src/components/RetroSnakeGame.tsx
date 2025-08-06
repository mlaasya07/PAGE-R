// components/RetroSnakeGame.tsx
import React from 'react';

const RetroSnakeGame: React.FC = () => {
  return (
    <div className="w-full h-[80vh] border border-amber-400">
      <iframe
        src="/retro-snake/index.html"
        title="Retro Snake Game"
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default RetroSnakeGame;
