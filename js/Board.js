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

    _pieces = [
        {},{}
    ]
    
    constructor() {
        this.initializeBoard()
        this._inCheck = false
        this._isCheckMate = false
        this._isStaleMate = false
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
                const newPiece = new piece(this.id,color,x,y)
                current_slot.piece = newPiece
                const newPieceKey = newPiece.name === 'King' ? newPiece.name : newPiece.name+newPiece.id
                this._pieces[color][newPieceKey] = newPiece 
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
        this._inCheck = this.isCheck(slot.piece)
        slot.empty()
        
        this.calculateMoves()

        if(this.inCheck()) {
            this._isCheckMate = !this.calculateMovesInCheck(destinationSlot.piece)
        } 

        return capturedPiece
    }

    calculateMovesInCheck(threat) {
        const opponentKing = this.getPiece(c.KINGIDS[this.opponentColor(threat)])
        let opponentHasMoves = false
        
        // Get attacking path to see if there is one piece that can get in the way
        let attackingPath = this.getAttackingPath(opponentKing,threat)

        // Capturing the threat is a legal move
        attackingPath.push([threat.x,threat.y])
           
        for(let slot of this.slots) {
            if(!slot.isEmpty() && slot.piece.color !== threat.color) {
                if(slot.piece.name !== 'King') {
                    slot.piece.moves = this.movesIn(slot.piece.moves,attackingPath)
                } 
                
                opponentHasMoves = slot.piece.moves.length > 0 || opponentHasMoves
            }
        }
        
        return opponentHasMoves
    }

    movesIn(pieceMoves,acceptableMoves) {
        let result = []
        for(let move of pieceMoves) {
            if(this.containsPosition(acceptableMoves,move[0],move[1])){
                result.push(move)
            }
        }
        return result;
    }

    movesNotInOpponentPath(king) {

        for(let slot of this.slots) {
            if( !slot.isEmpty() &&  slot.piece.color !== king.color) {
                let unnaceptableMoves = slot.piece.hasCaptureMoves() ? 
                    slot.piece.captureMoves : slot.piece.moves

                unnaceptableMoves = unnaceptableMoves.concat(slot.piece.blockers)

                king.moves = this.movesNotIn(king.moves,unnaceptableMoves)
            }
        }
    }

    movesNotIn(pieceMoves,unacceptableMoves) {
        let result = []
        for(let move of pieceMoves) {
            if(!this.containsPosition(unacceptableMoves,move[0],move[1])){
                result.push(move)
            }
        }
        return result

    }

    getAttackingPath(king,threat) {
        // You cannot block the path of a Pawn or a Knight
        if(threat.name === "Pawn" || threat.name === 'Knight') {
            return []
        }

        const dirX = this.compare(threat.x,king.x)
        const dirY = this.compare(threat.y,king.y)

        let x = king.x + dirX
        let y = king.y + dirY
        let attackingPath = []

        while(x !== threat.x || y !== threat.y) {
            attackingPath.push([x,y])
            x += dirX
            y += dirY
        }
        
        return attackingPath
    }

    compare(num1,num2) {
        if(num1 === num2) return 0
        return num1 > num2 ? 1 : -1;
    }

    isCheck(piece) {
        this.calculateMovesForPiece(piece)
        const opponentKing = this.getPiece(c.KINGIDS[this.opponentColor(piece)])

        return this.containsPosition(piece.moves,opponentKing.x,opponentKing.y)
    }

    containsPosition(moves,x,y) {
        for(let move of moves) {
            if(move[0] === x && move[1] === y) 
                return true
        }
        return false
    }

    inCheck() {
        return this._inCheck
    }

    opponentColor(piece) {
        return piece.color === c.WHITE ? c.BLACK : c.WHITE;
    }


    calculateMoves() {
        for(let slot of this.slots) {
            if(!slot.isEmpty()) {
                this.calculateMovesForPiece(slot.piece)
            }
        }
    }
    calculateMovesForPiece(piece) {    
        piece.emptyMoves()
        piece.emptyBlockers()
        if(piece.longRange) {
            this.calculateLongRangeMoves(piece)
        } else {
            this.calculateShortRangeMoves(piece)
        }
        // This is solely for pawns which capture differently than they move to empty slots
        if(piece.hasCaptureMoves()) {
            this.calculateCaptureMoves(piece)
        }
    }

    calculateCaptureMoves(piece) {
        for(let movePattern of piece.captureMoves) {
            const dX = piece.x + movePattern[0]
            const dY = piece.y + movePattern[1]
            if(this.inRange(dX) && this.inRange(dY)) { 
                if(this.isOwnPiece(piece,dX,dY) || this.isEmptySlot(dX,dY)) {
                    piece.addBlocker([dX,dY])
                } else if(this.isOpponentPiece(piece,dX,dY)) {
                    piece.addMove([dX,dY])
                }
            }
        }
    }

    calculateShortRangeMoves(piece) {
        for(let movePattern of piece.movePattern) {
            const dX = piece.x + movePattern[0]
            const dY = piece.y + movePattern[1]
            if(this.inRange(dX) && this.inRange(dY)) {  
                // This is specifically for pawns which have special capture moves 
                if(this.isOpponentPiece(piece,dX,dY) && piece.hasCaptureMoves()) continue   

                if(this.isOwnPiece(piece,dX,dY)) {
                    piece.addBlocker([dX,dY])
                } else if(this.isLegalMove(piece,dX,dY)) {
                    piece.addMove([dX,dY])
                }
            }
        }
        
        if(piece.name === 'King') {
            this.movesNotInOpponentPath(piece)
        }
    }

    calculateLongRangeMoves(piece) {
        for(let movePattern of piece.movePattern) { 
            const advanceX = movePattern[0]
            const advanceY = movePattern[1]     
            let dX = piece.x + advanceX
            let dY = piece.y + advanceY

            while(this.inRange(dX) && this.inRange(dY)) {
                
                if(this.isOwnPiece(piece,dX,dY)) {
                    piece.addBlocker([dX,dY])
                    break
                }
                
                if(this.isLegalMove(piece,dX,dY)) {
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

    isLegalMove(piece,dX,dY) {
        return true
    }

    inRange(value) {
        return value >= 0 && value < this.MAX
    }

    isCheckMate() {
        return this._isCheckMate
    }

    isEmptySlot(dX,dY) {
        return this.slots[dX + dY * this.MAX].isEmpty()
    }
}

export default Board