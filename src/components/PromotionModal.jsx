import React from 'react';
import * as c from '../game-engine/constant/index';

const PromotionModal = ({ turn, onPromote, onClose }) => {
  const promotionColor = turn === c.WHITE ? c.BLACK : c.WHITE;
  const colorClass = c.COLORSTR[promotionColor];

  const pieces = ['queen', 'rook', 'bishop', 'knight'];

  const handlePieceSelect = (piece) => {
    onPromote(piece);
    if (onClose) onClose();
  };

  return (
    <>
      <div className="body-overlay active" onClick={onClose}></div>
      <div className={`modal show ${colorClass}`}>
        <div className="modal-content promotion">
          <h2>Promote pawn to:</h2>
          {pieces.map(piece => (
            <div 
              key={piece}
              className="promotion-piece" 
              onClick={() => handlePieceSelect(piece)}
            >
              <i className={`fas fa-chess-${piece} ${colorClass}`}></i>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PromotionModal;
