import Piece from '../Piece.js'

class Pawn extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Pawn'
        this._initialPosition = true
    }
}

export default Pawn