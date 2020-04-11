import Position from './Position.js'
class Slot {
    constructor(x,y) {
        this._position = new Position(x,y)
        this._empty = true
    }

    set piece(piece) {
        this._piece = piece
        this._empty = false
    }

    get piece() {
        return this._piece
    }

    get x() {
        return this._position.x
    }

    get y() {
        return this._position.y
    }

    isEmpty() {
        return this._empty
    }

    emptySlot() {
        this._piece = {}
        this._empty = true
    }
}

export default Slot