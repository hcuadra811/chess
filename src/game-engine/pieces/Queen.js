import Piece from '../Piece.js'
import * as c from '../constant/index.js'

class Queen extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'Queen'
        this.longRange = true
        this.value = 7
    }

    markup() {
        return `<i class="fas fa-chess-queen ${c.COLORSTR[this.color]}"></i>`
    }

    get movePattern() {
        return [ 
            [-1,-1],[-1,0],[-1,1],
            [0,1], [0,-1],
            [1,-1], [1,0],[1,1]
        ]
    }
}

export default Queen