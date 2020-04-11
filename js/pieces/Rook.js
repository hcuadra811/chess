import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Rook extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = "Rook"
        this.longRange = true
        this.value = 5
    }

    get movePattern() {
        return [ 
            [-1,0],[0,1],[0,-1],[1,0]
        ]
    }
}

export default Rook;