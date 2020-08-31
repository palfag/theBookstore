
$(document).on('click','.remove-button',function () {

    var parent = this.parentNode.parentNode.parentNode;
    var row = document.getElementById(parent.id);
    row.parentNode.removeChild(row);

    var request = $.ajax({
        type: "POST",
        url: "../php/remove_to_cart.php",
        data: {remove_to_cart: parent.id},
        dataType: 'json'
    });

    request.done(function (response) {
        if(response.success === 1){
            var badgeNum = response.badge_num;
            var total = response.total;
            updateBadge(badgeNum);
            updateTotal(total);
            if(parseInt(badgeNum) === 0){
                $("#cart").addClass("hidden");
                warningCartEmpty();
            }
        }

        else
            alert(response.error);
    });

    request.fail(function (response, textStatus, error) {
        alert(response + textStatus + error);
    });


});




$(document).on('click','.remove-all-button',function () {

    var removeAllFromCart = 0;
    var body = document.querySelector('tbody');
    while (body.firstChild && body.children.length > 1) {
        // This will remove all children within tbody which in your case are <tr> elements
        body.removeChild(body.firstChild);
    }

    var request = $.ajax({
        type: "POST",
        url: "../php/remove_all_from_cart.php",
        data: {remove_all_from_cart: removeAllFromCart},
        dataType: 'json'
    });

    request.done(function (response) {
        if(response.success === 1){
            var badgeNum = response.badge_num;
            var total = response.total;
            updateBadge(badgeNum);
            updateTotal(total);
            if(parseInt(badgeNum) === 0){
                $("#cart").addClass("hidden");
                warningCartEmpty();
            }
        }

        else
            alert(response.error);
    });

    request.fail(function (response, textStatus, error) {
        alert(response + textStatus + error);
    });

});



$(document).on('click','.minus-button',function () {

    var parent = this.parentNode;
    var children = parent.children;
    var quantityDOMElem = children[1]//.innerText = "duck"; // puntatore al DOM elem della quantity
    var quantity = quantityDOMElem.textContent;
    var row = parent.parentNode.parentNode;
    var book_id = document.getElementById(row.id);

    if(parseInt(quantity) === 1){

        row.parentNode.removeChild(row);

        var request = $.ajax({
            type: "POST",
            url: "../php/remove_to_cart.php",
            data: {remove_to_cart: row.id},
            dataType: 'json'
        });

        request.done(function (response) {
            if(response.success === 1){
                var badgeNum = response.badge_num;
                var total = response.total;
                updateBadge(badgeNum);
                updateTotal(total);
                if(parseInt(badgeNum) === 0){
                    $("#cart").addClass("hidden");
                    warningCartEmpty();
                }
            }

            else
                alert(response.error);
        });

        request.fail(function (response, textStatus, error) {
            alert(response + textStatus + error);
        });
    }
    else{
        var subtotalDOMElem = row.children[3].children[0]//.innerText = "ciao"; per inserire roba dentro
        //var subtotal = subtotalDOMElem.textContent;


        var request = $.ajax({
            type: "POST",
            url: "../php/reduce_cart_quantity.php",
            data: {reduce_cart_quantity: row.id},
            dataType: 'json'
        });

        request.done(function (response) {
            if(response.success === 1){
                var badgeNum = response.badge_num;
                var total = response.total;
                subtotalDOMElem.innerText = response.subtotal;
                quantityDOMElem.innerText = parseInt(quantity) - 1;
                updateBadge(badgeNum);
                updateTotal(total);
            }

            else
                alert(response.error);
        });

        request.fail(function (response, textStatus, error) {
            alert(response + textStatus + error);
        });
    }
});


$(document).on('click','.plus-button',function () {

    var parent = this.parentNode;
    var children = parent.children;


    var quantityDOMElem = children[1] // puntatore al DOM elem della quantity
    var quantity = quantityDOMElem.textContent;
    var row = parent.parentNode.parentNode;
    var book_id = document.getElementById(row.id);



    var subtotalDOMElem = row.children[3].children[0]//.innerText = "ciao"; per inserire roba dentro


    var request = $.ajax({
        type: "POST",
        url: "../php/add_cart_quantity.php",
        data: {add_cart_quantity: row.id},
        dataType: 'json'
    });


    request.done(function (response) {
        if(response.success === 1){
            var badgeNum = response.badge_num;
            var total = response.total;
            subtotalDOMElem.innerText = response.subtotal;
            quantityDOMElem.innerText = parseInt(quantity) + 1;
            updateBadge(badgeNum);
            updateTotal(total);
        }

        else
            alert(response.error);
    });

    request.fail(function (response, textStatus, error) {
        alert(response + textStatus + error);
    });

});

$(document).on('click','#checkout-button',function () {

    var request = $.ajax({
        type: "POST",
        url: "../php/check_card.php",
        data: {check_card: 1},
        dataType: 'json'
    });


    request.done(function (response) {
        if(response.success === 1){
           pay();
        }
        else{
            var html = "<button id='add-card-btn'><a href='../php/payment.php'>first add a card</a></button>"
            $("#ajax-response").html(html);
            $("#ajax-response").addClass("failure");
        }
    });

    request.fail(function (response, textStatus, error) {
        alert(response + textStatus + error);
    });
});



function updateBadge(num) {
    $(".badge").html(num);
}

function updateTotal(val){
    $("#total").html(val);
}

function warningCartEmpty(){
    var html =  "<h1>Cart is empty</h1>" +
                "<h2>Looks like you have no items in your shopping cart</h2>" +
                "<button><a href=\"home.php\">Continue Shopping</a></button>";
    $("#warning").append(html);
}

function thanksForYourPurchase(){
    var html =  "<h1>Thanks for your shopping!</h1>" +
        "<h2>We are looking forward to hear from you soon</h2>" +
        "<button><a href=\"home.php\">Continue Shopping</a></button>";
    $("#warning").append(html);
}

function pay(){
    // tutto questo lo facciamo se l'account possiede una carta collegata
    var tbody = document.getElementById("books");
    var books = $(tbody).find("tr");
    var hashmap = {};

    for(var i = 0; i < books.length; i++){
        var id = books[i].id;
        // book[i]. quantity column - p - quantity - valore di quantity
        var quantity = books[i].children[2].children[0].children[1].textContent;
        hashmap[id] = quantity;
    }

    // ora dobbiamo fare qualcosa ??
    // 1. aggiungere gli acquisti nel db
    // far uscire la pagina thank you for your purchase!


    var request = $.ajax({
        type: "POST",
        url: "../php/add_purchase.php",
        data: {add_purchase: hashmap},
        dataType: 'json'
    });


    request.done(function (response) {
        if(response.success === 1){
            var badgeNum = response.badge_num;
            updateBadge(badgeNum);
            $("#cart").addClass("hidden");
            thanksForYourPurchase();
        }

        else
            alert(response.error);
    });

    request.fail(function (response, textStatus, error) {
        alert(response + textStatus + error);
    });
}