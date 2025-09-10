import React from 'react';
import * as c from '../game-engine/constant/index.js';

const ChessPiece = ({ piece, isTurn = false }) => {
  if (!piece) return null;

  const getPieceIcon = (piece) => {
    const iconMap = {
      'King': 'fas fa-chess-king',
      'Queen': 'fas fa-chess-queen', 
      'Rook': 'fas fa-chess-rook',
      'Bishop': 'fas fa-chess-bishop',
      'Knight': 'fas fa-chess-knight',
      'Pawn': 'fas fa-chess-pawn'
    };
    
    const colorClass = piece.color === c.WHITE ? 'white' : 'black';
    const turnClass = isTurn ? 'turn' : '';
    
    return `${iconMap[piece.name]} ${colorClass} ${turnClass}`.trim();
  };

  return <i className={getPieceIcon(piece)} />;
};

export default ChessPiece;
