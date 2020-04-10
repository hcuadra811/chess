import Piece from '../Piece.js'

class Knight extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Knight'
    }
}

export default Knight