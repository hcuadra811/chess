import Position from './Position.js'
class Slot {
    constructor(x,y) {
        this.position = new Position(x,y)
        this.empty = true
    }

    set piece(piece) {
        this._piece = piece
        this.empty = false
    }

    get piece() {
        return this._piece
    }

    isEmpty() {
        return this.empty
    }
}

export default Slot