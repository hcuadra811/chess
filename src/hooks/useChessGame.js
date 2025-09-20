import { useState, useCallback, useEffect } from 'react';
import Chess from '../game-engine/Chess.js';

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());
  const [gameState, setGameState] = useState({
    board: [],
    turn: 0,
    score: [0, 0],
    inCheck: false,
    isCheckMate: false,
    selectedPieceId: null,
    validMoves: [],
    pawnPromoted: [],
    additionalMove: [],
    lastMoveStr: ''
  });

  const updateGameState = useCallback(() => {
    setGameState({
      board: [...chess.board.slots],
      turn: chess.turn,
      score: [...chess.score],
      inCheck: chess.board.inCheck(),
      isCheckMate: chess.board.isCheckMate(),
      selectedPieceId: chess.lastID,
      validMoves: chess.lastID ? chess.getMovesFrom(chess.lastID) : [],
      pawnPromoted: [...chess.board.pawnPromoted],
      additionalMove: [...chess.board.additionalMove],
      lastMoveStr: chess.lastMoveStr()
    });
  }, [chess]);

 
  useEffect(() => {
    updateGameState();
  }, [updateGameState]);

  const selectPiece = useCallback((pieceId) => {
    if (pieceId) {
      const moves = chess.getMovesFrom(pieceId);
      console.log('Valid moves for piece:', moves);
    }
    chess.lastID = pieceId;
    updateGameState();
  }, [chess, updateGameState]);

  const movePiece = useCallback((x, y) => {
    console.log('Moving piece to:', x, y);
    chess.movePiece(x, y);
    console.log('After move - Pawn promoted:', chess.board.pawnPromoted);
    console.log('After move - In check:', chess.board.inCheck());
    console.log('After move - Checkmate:', chess.board.isCheckMate());
    updateGameState();
  }, [chess, updateGameState]);

  const promotePawn = useCallback((pawnPosition, selectedPiece) => {

    chess.promote(pawnPosition, selectedPiece);
    updateGameState();
  }, [chess, updateGameState]);

  const resetGame = useCallback(() => {
    Object.assign(chess, new Chess());
    updateGameState();
  }, [chess, updateGameState]);

  return {
    gameState,
    selectPiece,
    movePiece,
    promotePawn,
    resetGame,
    chess
  };  
};
