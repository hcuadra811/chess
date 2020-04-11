import Position from './Position.js'
import * as c from './constants/index.js'

class Piece {

    constructor(id,color,x,y) {
        this._id = id
        this._color = color
        this._position = new Position(x,y)
        this._moves = []
        this._direction = this._color === c.WHITE ? 1:-1;
        this._longRange = false
        this._moved = false
        this._value = 0
        this._captureMoves = []
    }

    addMove(move) {
        this._moves.push(move)
    }

    emptyMoves() {
        this._moves = []
    }

    move(x,y) {
        this._moved = true
        this.position.x = x
        this.position.y = y
    }

    hasCaptureMoves() {
        return this._captureMoves.length > 0
    }

    get captureMoves() {
        return this._captureMoves;
    }

    get id() {
        return this._id
    }

    get color() {
        return this._color
    }

    get position() {
        return this._position
    }

    get name() {
        return this._name
    }

    get moves() {
        return this._moves
    }

    get x() {
        return this._position.x
    }

    get y() {
        return this._position.y
    }

    get direction() {
        return this._direction;
    }

    get longRange() {
        return this._longRange
    }

    get value() {
        return this._value
    }

    set value(value) {
        this._value = value
    }

    set direction(direction) {
        this._direction = direction
    }

    set name(name) {
        this._name = name
    }

    set board(board) {
        this._board = board
    }

    set longRange(longRange) {
        this._longRange = longRange
    }

    set captureMoves(captureMoves) {
        this._captureMoves = captureMoves
    }
}

export default Piece