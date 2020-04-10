import Piece from '../Piece.js'

class Rook extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = "Rook"
    }
}

export default Rook;