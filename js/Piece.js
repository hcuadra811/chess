import Position from './Position.js'

class Piece {

    constructor(id,color,x,y) {
        this._id = id
        this._color = color
        this._position = new Position(x,y)
        this._moves = []
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
}

export default Piece