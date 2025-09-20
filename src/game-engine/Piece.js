import Position from './Position.js'
import * as c from './constant/index.js'

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
        this._capturePattern = []
        this._blockers = []
        this._obstacles = 0
        this._lastTarget = 0
        this._captureBlockers = []
    }

    addObstacle() {
        this._obstacles++;
    }

    addMove(move) {
        this._moves.push(move)
    }

    addBlocker(move) {
        this._blockers.push(move)
    }

    addCaptureBlocker(move) {
        this._captureBlockers.push(move)
    }

    emptyBlockers() {
        this._blockers = []
    }

    emptyCaptureBlockers() {
        this._captureBlockers = []
    }

    emptyMoves() {
        this._moves = []
    }

    move(x,y) {
        this._moved = true
        this.position.setPosition(x,y)
    }

    hasCaptureMoves() {
        return this._capturePattern.length > 0
    }

    resetObstacles() {
        this._obstacles = 0
    }

    get lastTarget() {
        return this._lastTarget;
    }

    get obstacles() {
        return this._obstacles
    }

    get blockers() {
        return this._blockers
    }
    
    get captureBlockers() {
        return this._captureBlockers
    }

    get capturePattern() {
        return this._capturePattern
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

    get moved() {
        return this._moved
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

    set lastTarget(lastTarget) {
        this._lastTarget = lastTarget
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

    set moves(moves) {
        this._moves = moves
    }

    set moved(moved) {
        this._moved = moved
    }

    set board(board) {
        this._board = board
    }

    set longRange(longRange) {
        this._longRange = longRange
    }

    set capturePattern(capturePattern) {
        this._capturePattern = capturePattern
    }
}

export default Piece