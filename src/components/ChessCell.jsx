import React from 'react';
import ChessPiece from './ChessPiece';
//import * as c from '../game-engine/constant/index';

const ChessCell = ({ x, y, slot, isValidMove, isSelected, currentTurn, onClick }) => {
  const isDarkSquare = (x + y) % 2 === 1;
  
  const cellClasses = [
    'chess-cell',
    isDarkSquare ? 'dark' : '',
    isSelected ? 'selected' : '',
    isValidMove ? 'valid-move' : ''
  ].filter(Boolean).join(' ');

  const isPieceTurn = !slot.isEmpty() && slot.piece.color === currentTurn;

  return (
    <div className={cellClasses} onClick={onClick}>
      {!slot.isEmpty() && (
        <ChessPiece piece={slot.piece} isTurn={isPieceTurn} />
      )}
      {isValidMove && <div className="move-indicator" />}
    </div>
  );
};

export default ChessCell;
