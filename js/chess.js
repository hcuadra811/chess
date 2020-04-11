import Board from './Board.js'
import * as c from './constants/index.js'

class Chess {

  constructor() {
    this._board = new Board()
    this._score = [0,0]
    this._turn = c.WHITE
    this._lastID = 0
  }

  getMovesFrom(piece_id) {
    const piece = this._board.getPiece(piece_id)

    return piece.moves
  }

  getMarkupForLastPiece() {
    const piece = this._board.getPiece(this._lastID)

    return piece.markup()
  }

  movePiece(x,y) {
    this._board.move(this._lastID,x,y)
    this._turn = this._turn === c.WHITE ? c.BLACK:c.WHITE
  }

  get turnName() {
    return c.COLORSTR[this._turn]
  }

  get score() {
    return this._score
  }

  get board() {
    return this._board
  }

  get turn() {
    return this._turn
  }

  get lastID() {
    return this._lastID
  }

  set lastID(id) {
    this._lastID = id
  }


}

export default Chess

