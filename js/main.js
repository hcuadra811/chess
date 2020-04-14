import Chess from './Chess.js'
import * as c from './constants/index.js'

let chess = new Chess()
let pawnPromoted = []

$(".cell").click(function() {
    console.log(chess.board)
    if($(this).hasClass('target-move')) {
        const x = parseInt($(this).attr('x'))
        const y = parseInt($(this).attr('y'))

        const lastPosition = $('div[piece_id='+chess.lastID+']')

        lastPosition.html('')
        lastPosition.attr('piece_id','0')

        chess.movePiece(x,y)

        $(this).html(
            chess.getMarkupForLastPiece()
        )

        $(this).removeClass('target-move')
        $(this).attr('piece_id',chess.lastID)
        
        additionalMove()
        promotePawn()
        updateScore()
        eraseHighlights()
        changeTurn()
        verifyCheckMate()

    } else {    
        const wasExpanded = $(this).hasClass('expanded')
        const isTurn = $('svg',this).hasClass('turn') 

        $(".cell").removeClass("expanded")
        eraseHighlights()

        if(!wasExpanded && isTurn) {
            $(this).addClass("expanded")
            const id = $(this).attr('piece_id')
            chess.lastID = id
            highlightMoves(chess.getMovesFrom(id))
        }
    }
})

$('.promotion-piece').click(function(){
    const selectedPiece = $('svg',this).attr('piece')
    const x = pawnPromoted[0]
    const y = pawnPromoted[1]
    
    const promotionColor = chess.turn === c.WHITE ? c.BLACK:c.WHITE
    const colorClass = c.COLORSTR[promotionColor]

    chess.promote(pawnPromoted,selectedPiece)
    $('div[x='+x+'][y='+y+']').html(`<i class="${colorClass} fas fa-chess-${selectedPiece}"></i>`)
    $('.modal').removeClass('show')
    $('.body-overlay').removeClass('active')
})

function promotePawn() {
    pawnPromoted = chess.board.pawnPromoted
    
    const promotionColor = chess.turn === c.WHITE ? c.BLACK:c.WHITE
    const colorClass = c.COLORSTR[promotionColor]

    if(pawnPromoted.length > 0) {
        $('.modal').removeClass('white')
        $('.modal').addClass(colorClass)
        $('.modal svg').addClass(colorClass)
        $('.modal').addClass('show')
        $('.body-overlay').addClass('active')
    }
}

function additionalMove() {
    const additionalMove = chess.board.additionalMove
        
    if(additionalMove.length > 0) {
        const slotX = additionalMove[0][0]
        const slotY = additionalMove[0][1]
        const dSlotX = additionalMove[1][0]
        const dSlotY = additionalMove[1][1]

        const slotDiv = $('div[x='+slotX+'][y='+slotY+']')
        const pieceId = parseInt(slotDiv.attr('piece_id'))

        slotDiv.html('')
        slotDiv.attr('piece_id',0)

        const dSlotDiv =  $('div[x='+dSlotX+'][y='+dSlotY+']')
        dSlotDiv.attr('piece_id',pieceId)
        dSlotDiv.html(chess.getMarkupFor(pieceId))
    }
}

function verifyCheckMate() {
    if(chess.board.isCheckMate()) {
        const winnerColor = chess.turn === c.WHITE ? c.BLACK:c.WHITE
        let winnerName = c.COLORSTR[winnerColor]
        //Capitalize first letter
        winnerName = winnerName.charAt(0).toUpperCase() + winnerName.slice(1)
        setTimeout(function(){ 
            $('.modal-content').html(`<h1>Check Mate!</h1> <h2>${winnerName} wins!</h2>`)
            $('.modal').addClass('show')
            $('.body-overlay').addClass('active')
        }, 200);
    }
}

function updateScore() {
    const score = chess.score
    $('.score.white .number').html(score[0])
    $('.score.black .number').html(score[1])
    
}

function changeTurn() {
    const turn = chess.turnName
    $('.turn').removeClass('turn')
    $('svg.'+turn).addClass('turn')
    $('.arrow').html('')
    $('.arrow-'+turn).html(
        '<i class="fas fa-chevron-up"></i>'
    )
}

function highlightMoves(moves) {
    for(let move of moves) {
        const x = move[0]
        const y = move[1]
        const targetMove = $('div[x='+x+'][y='+y+']')
        targetMove.append(
            '<i class="fas fa-circle"></i>'
        )
        targetMove.addClass('target-move')
    }
}

function eraseHighlights() {  
    $('.fa-circle').remove()
    $('.target-move').removeClass('target-move')
    $(".cell").removeClass("expanded")

}


