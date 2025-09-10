import React from 'react';
import { useChessGame } from '../hooks/useChessGame';
import ChessCell from './ChessCell';
import ScoreBoard from './ScoreBoard';
import PromotionModal from './PromotionModal';
import * as c from '../game-engine/constant/index';

const ChessBoard = () => {
  const { gameState, selectPiece, movePiece, promotePawn, resetGame } = useChessGame();

 const handleCellClick = (x, y, slot) => {
  const pieceId = slot.isEmpty() ? null : slot.piece.id;
  
  // Check if this is a valid move
  const isValidMove = gameState.validMoves.some(move => move[0] === x && move[1] === y);
  
  if (isValidMove) {
    // Make the move
    movePiece(x, y);
    // CRITICAL FIX: Clear selection immediately after move
    selectPiece(null);
  } else if (pieceId && slot.piece.color === gameState.turn) {
    // Select piece if it's the current player's piece
    selectPiece(pieceId);
  } else {
    // Clear selection if clicking elsewhere
    selectPiece(null);
  }
};


  const renderBoard = () => {
    const board = [];
    for (let y = 7; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        const slot = gameState.board[x + y * 8];
        const isValidMove = gameState.validMoves.some(move => move[0] === x && move[1] === y);
        const isSelected = !slot.isEmpty() && slot.piece.id === gameState.selectedPieceId;
        
        row.push(
          <ChessCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            slot={slot}
            isValidMove={isValidMove}
            isSelected={isSelected}
            currentTurn={gameState.turn}
            onClick={() => handleCellClick(x, y, slot)}
          />
        );
      }
      board.push(
        <div key={y} className="chess-row">
          {row}
        </div>
      );
    }
    return board;
  };

  return (
    <div className="chess-game">
      <div className="header">
        <h1>Chess for Hackers</h1>
        <ScoreBoard score={gameState.score} turn={gameState.turn} />
      </div>
      
      <div className="board-wrapper">
        <div className="row-labels">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div key={num} className="row-label">{num}</div>
          ))}
        </div>
        
        <div className="chess-board">
          {renderBoard()}
        </div>
      </div>
      
      <div className="column-labels">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="column-label">{letter}</div>
        ))}
      </div>

      {gameState.pawnPromoted.length > 0 && (
        <PromotionModal
          turn={gameState.turn}
          onPromote={(piece) => promotePawn(gameState.pawnPromoted, piece)}
        />
      )}
      
      {gameState.isCheckMate && (
        <div className="modal show">
          <div className="modal-content">
            <h1>Check Mate!</h1>
            <h2>{c.COLORSTR[gameState.turn === c.WHITE ? c.BLACK : c.WHITE]} wins!</h2>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      )}

      {gameState.inCheck && !gameState.isCheckMate && (
        <div className="check-notification">
          <p>{c.COLORSTR[gameState.turn]} King is in Check!</p>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
