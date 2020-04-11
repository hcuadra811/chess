import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Queen extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'Queen'
        this.longRange = true
        this.value = 7
    }

    get movePattern() {
        return [ 
            [-1,-1],[-1,0],[-1,1],
            [0,1], [0,-1],
            [1,-1], [1,0],[1,1]
        ]
    }

    markup() {
        return `<i class="black fas fa-chess-queen ${c.COLORSTR[this.color]}"></i>`
    }
}

export default Queen