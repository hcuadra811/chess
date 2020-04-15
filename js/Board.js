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

    promotionPieces = {      
        'rook':Rook,
        'knight':Knight,
        'bishop':Bishop,
        'queen':Queen,
    }
    
    _pieces = [{},{}]
    
    _cancelMovesFor = []
    _additionalMove = []
    _pawnPromoted = []
    lastPieceMoved = 0
    _lastMoveStr = ''
    _kingCantVisit = []
    
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
        this._additionalMove = []
        this._pawnPromoted = []
        this._kingCantVisit = []

        this._lastMoveStr = this.logLastMove(slot,destinationSlot)

        let capturedPiece = 0
        if(!destinationSlot.isEmpty()) {
            capturedPiece = destinationSlot.piece.value
            delete this._pieces[destinationSlot.piece.color][destinationSlot.piece.name+destinationSlot.piece.id]
        }
        destinationSlot.piece = slot.piece
        this.lastPieceMoved = slot.piece
        slot.piece.move(x,y)      
        slot.empty()
        this._inCheck = this.isCheck(destinationSlot.piece)
        this._cancelMovesFor = []    

        if(this.isCastle(slot,destinationSlot)) {
            this.applyCastle(destinationSlot.piece)
        }

        if(this.checkPawnPromoted(destinationSlot.piece)) {
            this._pawnPromoted = [destinationSlot.x,destinationSlot.y]
        }
        
        this.calculateMoves()

        return capturedPiece
    }

    checkPawnPromoted(piece) {
        let pawnPromoted = false
        if(piece.name === 'Pawn') {
            pawnPromoted = piece.color === c.WHITE ? piece.y === c.BLACK_FIRST_ROW : piece.y === c.WHITE_FIRST_ROW 
        }
        return pawnPromoted
    }

    isCastle(slot,destinationSlot) {
        return  destinationSlot.piece.name === 'King' && Math.abs(slot.x - destinationSlot.x) > 1
    }
    
    applyCastle(king) {
        let slot 
        let destinationSlot

        if(king.x > c.KING_INITIAL_X) {
            const rightRookPosition = king.x + c.KING_ROOK_DISTANCE_RIGHT + king.y * 8
            slot = this.slots[rightRookPosition]
            destinationSlot = this.slots[king.x - 1 + king.y * 8]
            destinationSlot.piece = slot.piece
            slot.piece.move(king.x - 1, king.y)
            slot.empty()
        } else {
            const leftRookPosition = king.x + c.KING_ROOK_DISTANCE_LEFT + king.y * 8
            slot = this.slots[leftRookPosition]
            destinationSlot = this.slots[king.x + 1 + king.y * 8]
            destinationSlot.piece = slot.piece
            slot.piece.move(king.x + 1, king.y)
            slot.empty()

        }

        this._additionalMove = [[slot.x,slot.y],[destinationSlot.x,destinationSlot.y]]
    }

    calculateMovesInCheck(threat) {
        const opponentKing = this._pieces[this.opponentColor(threat)]['King']
        let opponentHasMoves = false
        
        // Get attacking path to see if there is one piece that can get in the way
        let attackingPath = this.getAttackingPath(opponentKing,threat)
        
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
            let unnaceptableMoves = piece.hasCaptureMoves() ? piece.captureMoves.concat(piece.captureBlockers) : piece.moves
            king.moves = this.movesNotIn(king.moves,unnaceptableMoves)
        }

        king.moves = this.movesNotIn(king.moves,this._kingCantVisit)
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
            return [[threat.x,threat.y]]
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

        attackingPath.push([threat.x,threat.y])
        
        return attackingPath
    }

    compare(num1,num2) {
        if(num1 === num2) return 0
        return num1 > num2 ? 1 : -1;
    }

    isCheck(piece) {
        this.calculateMovesForPiece(piece)
        const opponentKing = this._pieces[this.opponentColor(piece)]['King']

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
        //Recalculate moves for white king 
        this.calculateMovesForPiece(this._pieces[c.WHITE]['King'])
        // Cancel moves that leave the king unprotected
        this.cancelIllegalMoves()

        if(this.inCheck()) {
            this._isCheckMate = !this.calculateMovesInCheck(this.lastPieceMoved)
        } 
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
        piece.emptyCaptureMoves()
        piece.emptyCaptureBlockers()

        for(let movePattern of piece.capturePattern) {
            const dX = piece.x + movePattern[0]
            const dY = piece.y + movePattern[1]
            if(this.inRange(dX) && this.inRange(dY)) { 
                if(this.isOwnPiece(piece,dX,dY) || this.isEmptySlot(dX,dY)) {
                    piece.addCaptureBlocker([dX,dY])
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
                if( this.isOpponentPiece(piece,dX,dY) && piece.hasCaptureMoves() ||
                    this.isOwnPiece(piece,dX,dY) && piece.hasCaptureMoves()
                ) break   

                if(this.isOwnPiece(piece,dX,dY) && !piece.hasCaptureMoves()) {
                    piece.addBlocker([dX,dY])
                } else if(!this.isOwnPiece(piece,dX,dY)) {
                    piece.addMove([dX,dY])
                }
            }
        }
    }

    calculateCastle(king) {
        if(!king.moved) {           
            if(this.slotsAreEmpty(king,2) && this.pieceHasntMoved(king,3)) {
                king.moves.push([king.x+2,king.y])
            }    

            if(this.slotsAreEmpty(king,-3) && this.pieceHasntMoved(king,-4)) {
                king.moves.push([king.x-2,king.y])
            }
             
        }
    }

    slotsAreEmpty(piece,distance) {
        const factor = distance > 0 ? 1 : -1
        let dX = piece.x + factor
        let slotsAreEmpty = true

        while(dX !== piece.x + distance + factor) {
            const slot = this.slots[dX + piece.y * 8]
            slotsAreEmpty = slotsAreEmpty && slot.isEmpty()
            dX += factor
        }

        return slotsAreEmpty
    }

    pieceHasntMoved(piece,distance) {
        let pieceHasntMoved = false
        const slot = this.slots[piece.x + distance + piece.y * 8]

        if(!slot.isEmpty()) {
            pieceHasntMoved = !slot.piece.moved
        }
        return pieceHasntMoved
    }

    calculateLongRangeMoves(piece) {
        for(let movePattern of piece.movePattern) { 
            const advanceX = movePattern[0]
            const advanceY = movePattern[1]     
            let dX = piece.x + advanceX
            let dY = piece.y + advanceY          
            let onlyBlockers = false
            let illegalKingMoves = false
            piece.resetObstacles()

            while(this.inRange(dX) && this.inRange(dY)) {
                if(onlyBlockers) {
                    piece.addBlocker([dX,dY])
                    if(illegalKingMoves) {
                        this._kingCantVisit.push([dX,dY])
                    }
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
                        this._kingCantVisit.push([dX,dY])
                        break
                    }
                    
                    if(this.isLegalMove(piece,dX,dY)) {
                        piece.addMove([dX,dY])
                        
                        if(this.isOpponentPiece(piece,dX,dY)) {
                            piece.lastTarget = [dX,dY]
                            piece.addObstacle()
                            onlyBlockers = true
                            illegalKingMoves = this.isOpponentKing(piece,dX,dY)
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

    promote(pawnPosition, selectedPiece) {
        const x = pawnPosition[0]
        const y = pawnPosition[1]
        const slot = this.slots[x + y * 8]
        const piece = slot.piece
        const pieceClass = this.promotionPieces[selectedPiece]
        slot.empty()
        
        slot.piece = new pieceClass(piece.id,piece.color,x,y)
        slot.piece.moved = true
        delete this._pieces[piece.color]['Pawn'+piece.id]
        this._pieces[piece.color][slot.piece.name+piece.id] = slot.piece
        this.lastPieceMoved = slot.piece
        this._inCheck = this.isCheck(slot.piece)
        this.calculateMoves()
    }

    get additionalMove() {
        return this._additionalMove
    }

    get pawnPromoted() {
        return this._pawnPromoted
    }

    get lastMoveStr() {
        return this._lastMoveStr
    }

    logLastMove(slot,destinationSlot) {
        const lastMove =  `${c.COLORSTR[slot.piece.color]} ${slot.piece.name} moved from ${slot.positionName} to ${destinationSlot.positionName} <br>`
        return lastMove
    }
}

export default Board