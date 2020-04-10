import Board from './Board.js'
import * as c from './constants/index.js'

class Chess {

  constructor() {
    this._board = new Board()
    this._score = [0,0]
    this._turn = c.WHITE
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


}

export default Chess

