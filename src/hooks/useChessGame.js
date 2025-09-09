import { useState, useCallback } from 'react';
import Chess from '../game-engine/Chess.js';

export const useChessGame = () => {
  const [chess] = useState(() => new Chess());
  const [gameState, setGameState] = useState({
    board: chess.board.slots,
    turn: chess.turn,
    score: chess.score,
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
      board: [...chess.board.slots], // This uses YOUR Board class
      turn: chess.turn,
      score: [...chess.score],
      inCheck: chess.board.inCheck(), // YOUR check detection
      isCheckMate: chess.board.isCheckMate(), // YOUR checkmate logic
      selectedPieceId: chess.lastID,
      validMoves: chess.lastID ? chess.getMovesFrom(chess.lastID) : [], // YOUR move calculation
      pawnPromoted: [...chess.board.pawnPromoted],
      additionalMove: [...chess.board.additionalMove],
      lastMoveStr: chess.lastMoveStr()
    });
  }, [chess]);

  // Use YOUR original chess methods
  const selectPiece = useCallback((pieceId) => {
    chess.lastID = pieceId;
    updateGameState();
  }, [chess, updateGameState]);

  const movePiece = useCallback((x, y) => {
    chess.movePiece(x, y); // YOUR original movePiece logic
    updateGameState();
  }, [chess, updateGameState]);

  const promotePawn = useCallback((pawnPosition, selectedPiece) => {
    chess.promote(pawnPosition, selectedPiece); // YOUR promotion logic
    updateGameState();
  }, [chess, updateGameState]);

  return {
    gameState,
    selectPiece,
    movePiece,
    promotePawn,
    chess
  };
};
