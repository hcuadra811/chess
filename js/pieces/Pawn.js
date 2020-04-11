import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Pawn extends Piece {
    constructor(id,color,x,y,board) {
        super(id,color,x,y)
        this._name = 'Pawn'
        this._moves = this.initialMoves()
    }

    initialMoves() {
        if(this.color === c.WHITE) {
            return [
                [this.x,this.y+1],
                [this.x,this.y+2]
            ]
        } else {
            return [
                [this.x,this.y-1],
                [this.x,this.y-2]
            ]
        }
    }

    markup() {
        return `<i class="black fas fa-chess-pawn ${c.COLORSTR[this.color]}"></i>`
    }


}

export default Pawn