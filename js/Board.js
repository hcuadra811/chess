import Slot from './Slot.js'
import Piece from './Piece.js'
import Rook from './pieces/Rook.js'
import Knight from './pieces/Knight.js'
import Bishop from './pieces/Bishop.js'
import Queen from './pieces/Queen.js'
import King from './pieces/King.js'
import Pawn from './pieces/Pawn.js'
import * as c from './constants/index.js'

class Board {
    id = 1
    MAX = 8
    slots = []
    pieces = [
        Rook,
        Knight,
        Bishop,
        Queen,
        King,
        Bishop,
        Knight,
        Rook
    ]
    constructor() {
        this.initializeBoard()
    }

    initializeBoard() {   
        this.setEmptySlots()
        this.setWhitePieces()
        this.setBlackPieces()
    }

    setEmptySlots() {
        for(let y = 0; y < this.MAX; y++) {
            for(let x = 0; x < this.MAX; x++) {
                this.slots.push(new Slot(x,y))
            }
        }
    }

    getPiece(id) {
        for(let slot of this.slots) {
            const piece = slot.piece
            if(typeof piece === 'undefined') continue

            if(piece.id == id) {
                return slot.piece
            }
        }
        return false
    }

    setWhitePieces() {
        let piece = '';

        for(let y= 0; y < 2; y++) {
            for(let x = 0; x < this.MAX; x++) {
                piece = y === 0 ? this.pieces[x] : Pawn
                let slot_position = x + y * this.MAX
                let current_slot = this.slots[slot_position]
                let current_piece =  new piece(this.id,c.WHITE,x,y)
                current_slot.piece = current_piece
                this.id++
            }
        }
    }

    setBlackPieces() {
        let piece = '';

        for(let y= 6; y < this.MAX; y++) {
            for(let x = 0; x < this.MAX; x++) {
                piece = y === 6 ?  Pawn : this.pieces[x]
                let slot_position = x + y * this.MAX
                let current_slot = this.slots[slot_position]
                let current_piece =  new piece(this.id,c.BLACK,x,y)
                current_slot.piece = current_piece
                this.id++
            }
        }
    }

    move(pieceID,x,y) {
        const piece = this.getPiece(pieceID)
        const slotIndex = piece.x + piece.y * this.MAX
        const slot = this.slots[slotIndex]

        const destinationSlotIndex = x + y * this.MAX
        const destinationSlot = this.slots[destinationSlotIndex]

        destinationSlot.piece = piece
        slot.emptySlot()
    }
}

export default Board