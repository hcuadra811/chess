import Piece from '../Piece.js'

class King extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'King'
        this._moves = []
    }
}

export default King