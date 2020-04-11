import Chess from './Chess.js'

let chess = new Chess()

$(".cell").click(function() {
    console.log(chess.board);

    if($(this).hasClass('target-move')) {
        const x = parseInt($(this).attr('x'))
        const y = parseInt($(this).attr('y'))

        const lastPosition = $('div[piece_id='+chess.lastID+']')

        lastPosition.html('')

        chess.movePiece(x,y)

        $(this).html(
            chess.getMarkupForLastPiece()
        )

        $(this).removeClass('target-move')

        eraseHightlights()

    } else {    
        const wasExpanded = $(this).hasClass('expanded')
        const isTurn = $('svg',this).hasClass('turn') 

        $(".cell").removeClass("expanded")

        if(!wasExpanded && isTurn) {
            $(this).addClass("expanded")
            const id = $(this).attr('piece_id')
            chess.lastID = id
            highlightMoves(chess.getMovesFrom(id))
        }
    }
})

function highlightMoves(moves) {
    for(let move of moves) {
        const x = move[0]
        const y = move[1]
        const targetMove = $('div[x='+x+'][y='+y+']')
        targetMove.html(
            '<i class="fas fa-circle"></i>'
        )
        targetMove.addClass('target-move')
    }
}

function eraseHightlights() {  
    $('.target-move').html('')
    $('.target-move').removeClass('target-move')
    $(".cell").removeClass("expanded")

}


