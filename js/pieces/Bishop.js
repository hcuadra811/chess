import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Bishop extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'Bishop'
        this.longRange = true
        this.value = 3
    }

    markup() {
        return `<i class="fas fa-chess-bishop ${c.COLORSTR[this.color]}"></i>`
    }

    get movePattern() {
        return [ 
            [-1,-1],[-1,1],
            [1,-1], [1,1]
        ]
    }
}

export default Bishop