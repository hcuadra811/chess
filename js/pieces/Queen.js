import Piece from '../Piece.js'

class Queen extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Queen'
    }
}

export default Queen