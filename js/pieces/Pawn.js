import Piece from '../Piece.js'
import * as c from '../constants/index.js'

class Pawn extends Piece {
    constructor(id,color,x,y,board) {
        super(id,color,x,y)
        this.name = 'Pawn'
        this.value = 1
        this.captureMoves = [ [1,1*this.direction], [-1,1*this.direction] ]
    }

    markup() {
        return `<i class="fas fa-chess-pawn ${c.COLORSTR[this.color]}"></i>`
    }

    get movePattern() {
        let pattern = [[0, 1 * this.direction]]
        if(!this._moved) {
            pattern.push([0,2 * this.direction])
        }
        return pattern
    }


}

export default Pawn