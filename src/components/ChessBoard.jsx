import React from 'react';
import { useChessGame } from '../hooks/useChessGame';
import ChessCell from './ChessCell';
import ScoreBoard from './ScoreBoard';
import PromotionModal from './PromotionModal';
import * as c from '../game-engine/constant/index';

const ChessBoard = () => {
  const { gameState, selectPiece, movePiece, promotePawn, resetGame, chess } = useChessGame();

  const handleCellClick = (x, y, slot) => {
    const pieceId = slot.isEmpty() ? null : slot.piece.id;
    
    // Check if this is a valid move
    const isValidMove = gameState.validMoves.some(move => move[0] === x && move[1] === y);
    
    if (isValidMove) {
      // Make the move
      movePiece(x, y);
      // Clear selection immediately after move
      selectPiece(null);
    } else if (pieceId && slot.piece.color === gameState.turn) {
      // Select piece if it's the current player's piece
      selectPiece(pieceId);
    } else {
      // Clear selection if clicking elsewhere
      selectPiece(null);
    }
  };

  const handlePromote = (piece) => {
    console.log('Handle promote called with:', piece);
    promotePawn(chess.board.pawnPromoted, piece);
  };

  const renderBoard = () => {
    // Add null/undefined checks
    if (!gameState.board || gameState.board.length !== 64) {
      console.log('Board not ready, length:', gameState.board ? gameState.board.length : 'undefined');
      return <div>Loading board...</div>;
    }

    const board = [];
    for (let y = 7; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        const slot = gameState.board[x + y * 8];
        
        // Critical fix: Check if slot exists and has isEmpty method
        if (!slot || typeof slot.isEmpty !== 'function') {
          console.error(`Invalid slot at position [${x}, ${y}]:`, slot);
          continue; // Skip this slot
        }

        const isValidMove = gameState.validMoves.some(move => move[0] === x && move[1] === y);
        const isSelected = !slot.isEmpty() && slot.piece && slot.piece.id === gameState.selectedPieceId;
        
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

  // Debug logs with null checks
  console.log('gameState.board length:', gameState.board ? gameState.board.length : 'undefined');
  console.log('chess.board exists:', !!chess.board);
  console.log('chess.board.slots length:', chess.board && chess.board.slots ? chess.board.slots.length : 'undefined');

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

      {/* Pawn Promotion Modal - Add null checks */}
      {chess.board && chess.board.pawnPromoted && chess.board.pawnPromoted.length > 0 && (
        <PromotionModal
          turn={gameState.turn}
          onPromote={handlePromote}
        />
      )}
      
      {/* Checkmate Modal - Add null checks */}
      {chess.board && chess.board.isCheckMate && chess.board.isCheckMate() && (
        <div className="modal show">
          <div className="modal-content">
            <h1>Check Mate!</h1>
            <h2>{c.COLORSTR[gameState.turn === c.WHITE ? c.BLACK : c.WHITE]} wins!</h2>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      )}

      {/* Check notification - Add null checks */}
      {chess.board && chess.board.inCheck && chess.board.inCheck() && 
       chess.board.isCheckMate && !chess.board.isCheckMate() && (
        <div className="check-notification" style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'orange',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          <p>{c.COLORSTR[gameState.turn]} King is in Check!</p>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
