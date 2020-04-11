import Piece from '../Piece.js'

class Bishop extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Bishop'
        this._moves = []
    }
}

export default Bishop