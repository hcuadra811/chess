import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Knight extends Piece {
    constructor(id,color,x,y) {
        super(id,color,x,y)
        this._name = 'Knight'
        this._moves = this.initialMoves()
    }

    initialMoves() {
        if(this.color === c.WHITE) {
            return [
                [this.x+1,this.y+2],
                [this.x-1,this.y+2]
            ]
        } else {
            return [
                [this.x+1,this.y-2],
                [this.x-1,this.y-2]
            ]
        }
    }

    markup() {
        return `<i class="black fas fa-chess-knight ${c.COLORSTR[this.color]}"></i>`
    }
}

export default Knight