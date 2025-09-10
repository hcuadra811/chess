import React, { useState, useEffect } from 'react';
import { useChessGame } from '../hooks/useChessGame';
import ChessCell from './ChessCell';
import ScoreBoard from './ScoreBoard';
import PromotionModal from './PromotionModal';
import * as c from '../game-engine/constant/index';

const ChessBoard = () => {
  const { gameState, selectPiece, movePiece, promotePawn, resetGame, chess } = useChessGame();
  const [showCheckNotification, setShowCheckNotification] = useState(false);

  useEffect(() => {
    const isInCheck = chess.board && chess.board.inCheck && chess.board.inCheck() && 
                     chess.board.isCheckMate && !chess.board.isCheckMate();
    
    if (isInCheck) {
      setShowCheckNotification(true);
      
      const timer = setTimeout(() => {
        setShowCheckNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowCheckNotification(false);
    }
  }, [gameState.inCheck, gameState.isCheckMate, chess.board]);

  const handleCellClick = (x, y, slot) => {
    const pieceId = slot.isEmpty() ? null : slot.piece.id;
    
    
    const isValidMove = gameState.validMoves.some(move => move[0] === x && move[1] === y);
    
    if (isValidMove) {
     
      movePiece(x, y);
     
      selectPiece(null);
    } else if (pieceId && slot.piece.color === gameState.turn) {
      
      selectPiece(pieceId);
    } else {
      
      selectPiece(null);
    }
  };

  const handlePromote = (piece) => {
    console.log('Handle promote called with:', piece);
    promotePawn(chess.board.pawnPromoted, piece);
  };

  const renderBoard = () => {
    
    if (!gameState.board || gameState.board.length !== 64) {
      console.log('Board not ready, length:', gameState.board ? gameState.board.length : 'undefined');
      return <div>Loading board...</div>;
    }

    const board = [];
    for (let y = 7; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        const slot = gameState.board[x + y * 8];
        
        
        if (!slot || typeof slot.isEmpty !== 'function') {
          console.error(`Invalid slot at position [${x}, ${y}]:`, slot);
          continue; 
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

      {chess.board && chess.board.pawnPromoted && chess.board.pawnPromoted.length > 0 && (
        <PromotionModal
          turn={gameState.turn}
          onPromote={handlePromote}
        />
      )}
      
     
      {chess.board && chess.board.isCheckMate && chess.board.isCheckMate() && (
        <div className="modal show">
          <div className="modal-content">
            <h1>Check Mate!</h1>
            <h2>{c.COLORSTR[gameState.turn === c.WHITE ? c.BLACK : c.WHITE]} wins!</h2>
            <button onClick={resetGame}>New Game</button>
          </div>
        </div>
      )}

      {showCheckNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 0, 0, 0.9)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000,
          border: '2px solid white',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <p style={{ margin: 0 }}>
            {c.COLORSTR[gameState.turn].toUpperCase()} King is in Check!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
