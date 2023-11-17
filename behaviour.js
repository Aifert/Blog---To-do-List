// $(".delete").hover(
//     function() {
//         // Mouse over (hover) event
//         $(this).css("color", "red");
//     },
//     function() {
//         // Mouse out event
//         $(this).css("color", ""); // Reset to default color (empty string)
//     }
// );



$(document).ready(function() {
    $(".d_button").hover(
        function() {
            $(this).addClass("delete");
        },
        function() {
            $(this).removeClass("delete");
        }
    );
});
