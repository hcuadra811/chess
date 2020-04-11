import Slot from './Slot.js'
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
        this.setInitialPieces(c.WHITE,c.WHITE_INITIAL_ROW,c.WHITE_END_ROW,c.WHITE_PAWN_ROW)
        this.setInitialPieces(c.BLACK,c.BLACK_INITIAL_ROW,c.BLACK_END_ROW,c.BLACK_PAWN_ROW)
        this.calculateMoves()
    }

    setEmptySlots() {
        for(let y = 0; y < this.MAX; y++) {
            for(let x = 0; x < this.MAX; x++) {
                this.slots.push(new Slot(x,y))
            }
        }
    }

    getPieceSlot(pieceId) {
        for(let slot of this.slots) {
            if(slot.isEmpty()) continue

            if(slot.piece.id == pieceId) {
                return slot
            }
        }
        return false
    }

    getPiece(pieceId) {
        return this.getPieceSlot(pieceId).piece
    }

    setInitialPieces(color,startY,endY,pawnRow) {
        let piece = '';

        for(let y= startY; y <= endY; y++) {
            for(let x = 0; x < this.MAX; x++) {
                piece = y === pawnRow ?  Pawn : this.pieces[x]
                const current_slot = this.slots[x + y * this.MAX]
                current_slot.piece =  new piece(this.id,color,x,y)
                this.id++
            }
        }
    }

    move(pieceId,x,y) {
        const slot = this.getPieceSlot(pieceId)
        const destinationSlot = this.slots[x + y * this.MAX]
        let capturedPiece = 0
        if(!destinationSlot.isEmpty()) {
            capturedPiece = destinationSlot.piece.value
        }
        destinationSlot.piece = slot.piece
        slot.piece.move(x,y)
        slot.empty()
        this.calculateMoves()

        return capturedPiece
    }

    calculateMoves() {
        for(let slot of this.slots) {
            if(!slot.isEmpty()) {
                slot.piece.emptyMoves()
                this.calculateMovesFor(slot.piece)
            }
        }
    }

    calculateMovesFor(piece) {    
        if(piece.longRange) {
            this.calculateLongRangeMoves(piece)
        } else {
            for(let movePattern of piece.movePattern) {
                const dX = piece.x + movePattern[0]
                const dY = piece.y + movePattern[1]
                if(this.inRange(dX) && this.inRange(dY)) {                   
                    if(this.isOwnPiece(piece,dX,dY)) continue
                    if(this.legalMove(piece,dX,dY)) {
                        piece.addMove([dX,dY])
                    }
                }
            }
        }
    }

    calculateLongRangeMoves(piece) {
        for(let movePattern of piece.movePattern) { 
            const advanceX = movePattern[0]
            const advanceY = movePattern[1]     
            let dX = piece.x + advanceX
            let dY = piece.y + advanceY

            while(this.inRange(dX) && this.inRange(dY)) {
                
                if(this.isOwnPiece(piece,dX,dY)) break
                
                if(this.legalMove(piece,dX,dY)) {
                    piece.addMove([dX,dY])
                    
                    if(this.isOpponentPiece(piece,dX,dY)) {
                        break
                    }
                }
                dX += advanceX
                dY += advanceY
            }
        }
    }
    

    isOpponentPiece(piece,dX,dY) {
        const slot = this.slots[dX + dY * this.MAX] 
        
        return slot.isEmpty() ? false : slot.piece.color !== piece.color
    }

    isOwnPiece(piece,dX,dY) {
        const slot = this.slots[dX + dY * this.MAX] 
        
        return slot.isEmpty() ? false : slot.piece.color === piece.color
    }

    legalMove(piece,dX,dY) {
        return true
    }

    inRange(value) {
        return value >= 0 && value < this.MAX
    }
}

export default Board