$(document).ready(function () {

    // Listener for comment form
    $("#comment-form").submit(function (event) {
        event.preventDefault();

        var comment = $("#comment-text").val(); // poi sanificare l'input
        var urlParams = new URLSearchParams(window.location.search);
        var item = urlParams.get('id_book');

        var request = $.ajax({
            type: "POST",
            url: "../php/comment.php",
            data: {add_comment: item, comment: comment},
            dataType: 'json'
        });

        request.done(function (response) {
            if (response.success === 1) {
                // IN CASO DI SUCCESSO
                var comment = response.comment;

                var html =  "<div class=comment "+comment.user+" id="+comment.id+">" +
                                "<button class='delete-comment-btn'><img src='../images/icons/bin.png'></button>"+
                                "<a href='profile.php?user="+comment.user+"'>"+
                                    "<img src="+comment.image+">"+
                                "</a>"+
                                "<p class='user'>" +
                                    "<a href='profile.php?user="+comment.user+"'>"+
                                        "<span id='user-link'> "+comment.name+" "+comment.surname+"</span>"+
                                    "</a>"+
                                "</p>"+
                                "<p>"+ comment.comment + "</p>"+
                                "<p><span id=timestamp>just now</span></p>"+
                            "</div>";

                $(".my-comment").prepend(html);
                $("#comment-text").val(''); // clear text area
            } else{
                // IN CASO DI FALLIMENTO
                var error =  "<h1>"+ response.error +"</h1>";
                $(".my-comment").prepend(error);
            }
        });

        request.fail(function (response, textStatus, error) {
            alert(response + textStatus + error);
        });
    });

});



$(document).on('click','.delete-comment-btn',function () {

    var parent = this.parentNode; // div class = "comment" && id = id del commento che si vuole eliminare
    var row = document.getElementById(parent.id);


    var request = $.ajax({
        type: "POST",
        url: "../php/delete_comment.php",
        data: {delete_comment: parent.id},
        dataType: 'json'
    });

    request.done(function (response) {
        if(response.success === 1){
                row.parentNode.removeChild(row); // elimina il commento dall'html
            }

        else{
            $("#ajax-password-response").html(response.error);
        }

    });

    request.fail(function (response, textStatus, error) {
    });

});