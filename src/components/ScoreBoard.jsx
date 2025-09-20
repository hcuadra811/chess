import React from 'react';
import * as c from '../game-engine/constant/index.js';

const ScoreBoard = ({ score, turn }) => {
  return (
    <div className="scoreboard">
      <div className="score white">
        <i className="fas fa-chess-king"></i>
        <span className="number">{score[c.WHITE]}</span>
      </div>
      <div className="score black">
        <i className="fas fa-chess-king"></i>
        <span className="number">{score[c.BLACK]}</span>
      </div>
      <div className={`arrow arrow-${c.COLORSTR[turn]}`}>
        <i className="fas fa-chevron-up"></i>
      </div>
      <div className="arrow">

      </div>
    </div>
  );
};

export default ScoreBoard;
