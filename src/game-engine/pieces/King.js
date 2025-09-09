import Piece from '../Piece.js'
import * as c from '../constant/index.js'

class King extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'King'
    }

    markup() {
        return `<i class="fas fa-chess-king ${c.COLORSTR[this.color]}"></i>`
    }

    get movePattern() {
        return [ 
            [-1,-1],[-1,0],[-1,1],
            [0,1], [0,-1],
            [1,-1], [1,0],[1,1]
        ]
    }
}

export default King