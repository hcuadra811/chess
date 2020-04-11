import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class King extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'King'
    }

    get movePattern() {
        return [ 
            [-1,-1],[-1,0],[-1,1],
            [0,1], [0,-1],
            [1,-1], [1,0],[1,1]
        ]
    }

    markup() {
        return `<i class="black fas fa-chess-king ${c.COLORSTR[this.color]}"></i>`
    }


}

export default King