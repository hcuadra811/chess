import React, { useState } from 'react';
import * as c from '../game-engine/constant/index';

const PromotionModal = ({ turn, onPromote }) => {
  console.log('PromotionModal rendering, turn:', turn);
  
  const promotionColor = turn === c.WHITE ? c.BLACK : c.WHITE;
  const colorClass = c.COLORSTR[promotionColor];

  const pieces = ['queen', 'rook', 'bishop', 'knight'];

  const [isVisible, setIsVisible] = useState(true);

  const handlePieceSelect = (piece) => {
    console.log('Piece selected for promotion:', piece);
    onPromote(piece);

    setIsVisible(false);
  };

    if (!isVisible) return null;

  return (
    <>
    <div 
        className="body-overlay z-index"
        onClick={() => setIsVisible(false)}
      ></div>
      <div className={`modal show ${colorClass}`}>
        <div className="modal-content promotion">
          <h2>Promote pawn to:</h2>
          {pieces.map(piece => (
            <div 
              key={piece}
              className="promotion-piece"
              onClick={() => handlePieceSelect(piece)}
            >
              <i 
                className={`fas fa-chess-${piece} turn`} 
                piece={piece}
              ></i>
            </div>
          ))}
        </div>
      </div>
      <div className="body-overlay z-index"></div>
    </>
  );
};

export default PromotionModal;
