$(document).ready(function(){

    var Dividend
    var Divisor

    $(".Start_Divide").click(function(){
        Dividend = $("#dividend").val()
        Divisor = $("#divisor").val()
        Dividend_Binary = parseInt(Dividend,10).toString(2)
        Divisor_Binary = parseInt(Divisor,10).toString(2)
        console.log (Dividend_Binary)
    })
})