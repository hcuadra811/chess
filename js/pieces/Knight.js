import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Knight extends Piece {

    constructor(id,color,x,y) {
        super(id,color,x,y)
        this.name = 'Knight'
        this.value = 3
    }

    get movePattern() {
        return [
            [1,2],[1,-2], 
            [-1,2],[-1,-2],
            [2,1],[2,-1],
            [-2,1],[-2,-1]
        ]
    }

    markup() {
        return `<i class="black fas fa-chess-knight ${c.COLORSTR[this.color]}"></i>`
    }
}

export default Knight