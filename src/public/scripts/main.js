$(function() {
    $(".container").hide()
    $(".container-glass").hide()
    $(".form-div").hide()
    $(".list-div").hide()
    $(".header").click(function(e){
        $(".container").slideToggle(1000)
        $(".container-glass").slideToggle(1000)
        $(".form-div").slideToggle(1000)
        $(".list-div").slideToggle(1000)
    });
});