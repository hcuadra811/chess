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
    
    _pieces = [{},{}]
    
    _cancelMovesFor = []
    
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
                const newPieceKey = newPiece.name === 'King' ? newPiece.name : newPiece.name + newPiece.id
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
        slot.empty()
        this._inCheck = this.isCheck(destinationSlot.piece)
        this._cancelMovesFor = []
        
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
        
        const opponentPieces = this._pieces[this.opponentColor(threat)]
        for(let pieceKey in opponentPieces) {
            const piece = opponentPieces[pieceKey]
            if(piece.name !== 'King') {
                piece.moves = this.movesIn(piece.moves,attackingPath)
            }       
            opponentHasMoves = piece.moves.length > 0 || opponentHasMoves
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
        const opponentPieces = this._pieces[this.opponentColor(king)]

        for(let pieceKey in opponentPieces) {
            const piece = opponentPieces[pieceKey]
            let unnaceptableMoves = piece.hasCaptureMoves() ? piece.captureMoves : piece.moves
            unnaceptableMoves = unnaceptableMoves.concat(piece.blockers)
            king.moves = this.movesNotIn(king.moves,unnaceptableMoves)
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

    getAttackingPath(piece,threat) {
        // You cannot block the path of a Pawn or a Knight
        if(threat.name === "Pawn" || threat.name === 'Knight') {
            return []
        }

        const dirX = this.compare(threat.x,piece.x)
        const dirY = this.compare(threat.y,piece.y)

        let x = piece.x + dirX
        let y = piece.y + dirY
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
        this.calculateMovesFor(c.WHITE)
        this.calculateMovesFor(c.BLACK)
        this.cancelIllegalMoves()
    }

    cancelIllegalMoves() {
        for(let cancelInfo of this._cancelMovesFor) {
            const piecePosition = cancelInfo[0]
            const attackingPath = cancelInfo[1]
            const dX = piecePosition[0]
            const dY = piecePosition[1]

            const slot = this.slots[dX + dY * 8]

            slot.piece.moves = this.movesIn(slot.piece.moves,attackingPath)

        }
    }

    calculateMovesFor(color) {
        const pieces = this._pieces[color]
        for(let pieceKey in pieces) {
            const piece = pieces[pieceKey]
            this.calculateMovesForPiece(piece)
        }
    }

    calculateMovesForPiece(piece) {    
        piece.emptyMoves()
        piece.emptyBlockers()
        piece.resetObstacles()

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
        for(let movePattern of piece.capturePattern) {
            const dX = piece.x + movePattern[0]
            const dY = piece.y + movePattern[1]
            if(this.inRange(dX) && this.inRange(dY)) { 
                if(this.isOwnPiece(piece,dX,dY) || this.isEmptySlot(dX,dY)) {
                    piece.addBlocker([dX,dY])
                } else if(this.isOpponentPiece(piece,dX,dY)) {
                    piece.addMove([dX,dY])
                    piece.addCaptureMove([dX,dY])
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
                if(this.isOpponentPiece(piece,dX,dY) && piece.hasCaptureMoves()) break   

                if(this.isOwnPiece(piece,dX,dY) && !piece.hasCaptureMoves()) {
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
            let onlyBlockers = false
            piece.resetObstacles()

            while(this.inRange(dX) && this.inRange(dY)) {
                if(onlyBlockers) {
                    piece.addBlocker([dX,dY])

                    // There is only one obstacle between this piece and the opponent king
                    // Therefore, the obstacle can't move from there
                    if(this.isOpponentKing(piece,dX,dY) && piece.obstacles === 1) {
                        const victim = this.slots[piece.lastTarget[0] + piece.lastTarget[1] * 8].piece
                        this._cancelMovesFor.push([piece.lastTarget,this.getAttackingPath(victim,piece)])
                    }
                    
                    if(this.isOpponentPiece(piece,dX,dY)) piece.addObstacle()

                    
                } else {             
                    if(this.isOwnPiece(piece,dX,dY)) {
                        piece.addBlocker([dX,dY])
                        break
                    }
                    
                    if(this.isLegalMove(piece,dX,dY)) {
                        piece.addMove([dX,dY])
                        
                        if(this.isOpponentPiece(piece,dX,dY)) {
                            piece.lastTarget = [dX,dY]
                            piece.addObstacle()
                            onlyBlockers = true
                        }
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

    isOpponentKing(piece,dX,dY) {       
        const slot = this.slots[dX + dY * this.MAX] 
        
        return slot.isEmpty() ? false : slot.piece.color !== piece.color && slot.piece.name === 'King'

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