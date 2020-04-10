import Piece from '../Piece.js'

class Bishop extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Bishop'
    }
}

export default Bishop