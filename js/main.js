import Chess from './Chess.js'

let chess = new Chess()

console.log(chess)


$(".cell").click(function() {
    const wasExpanded = $(this).hasClass('expanded')
    $(".cell").removeClass("expanded")
    if(!wasExpanded) {
      $(this).addClass("expanded")
    }
})

