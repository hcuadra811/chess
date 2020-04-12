import Chess from './Chess.js'
import * as c from './constants/index.js'

let chess = new Chess()

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

        updateScore()
        eraseHighlights()
        changeTurn()

        if(chess.board.isCheckMate()) {
            const winnerColor = chess.turn === c.WHITE ? c.BLACK:c.WHITE
            let winnerName = c.COLORSTR[winnerColor]
            //Capitalize first letter
            winnerName = winnerName.charAt(0).toUpperCase() + winnerName.slice(1)
            setTimeout(function(){ 
                alert(`Check Mate! ${winnerName} wins`)
            }, 200);
        }

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


