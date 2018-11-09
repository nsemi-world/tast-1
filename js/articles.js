var button = null;

$(document).ready(function () {
    initArticles();
    activate($('#toggle_articles'));
    createNewArticleButton();

    $(document).on('_login_successfull', function (event, response) {
        console.log('_LOGIN_SUCCESS');
        onLogin(response);
    });

    $(document).on('_logout_successfull', function (event, response) {
        console.log('_LOGOUT_SUCCESS');
        onLogout(response);
    });


});

function onLogin(response) {
    $('#toggle_login i').toggleClass('loggedin').attr('title', 'Logout');
    createNewArticleButton();
}

function createNewArticleButton(){
    $button = $('<button id="createArticle" class="btn shadow"><i class="fas fa-plus"></i></button>');
    $button.css({
        position: 'fixed',
        right: '1.5em',
        bottom: '1.5em',
        background: 'yellow',
        borderRadius: '50%'
    }).on('click', function () {
        $button.attr('disabled', true);
        var $formPreview = createArticleCardForm();
        $('#latest-articles .articles').append($formPreview);
        $('input, textarea').css({width: '100%'});
        $("#input-image").change(function(){
            readURL(this);
        });
        $('#create').on('click', function(event){
            event.preventDefault();
            saveArticle();
        });
        
        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    $('<p/>').text(file.name).appendTo(document.body);
                });
            }
        });
    });
    
    $('#latest-articles .articles').append($button);    
}

function saveArticle() {
    var image = $('#new-image').attr('src');
    var parts = $('#input-image').val().split("\\");
    var imageName = parts[parts.length-1];
    var title = $('#ftitle').val();
    var author = $('#fauthor').val();
    var location = $('#flocation').val();
    var date = new Date();
    var content = $('#fcontent').val();
    
    console.log('Image: ' + imageName);
    console.log('Title: ' + title);
    console.log('Author: ' + author);
    console.log('Location: ' + location);
    console.log('Date: ' + date);
    console.log('Content: ' + content);
    
    $.ajax({
        url: 'php/createArticle.php',
        type: 'POST',
        data: {article: {image: image, imageName: imageName, title: title, author: author, location: location, date: date, content: content}},
        success: function(data) {
            alert(data);
        },
        error: function() {
            alert('Error Ajax call to create article');
        }
    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#new-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function onLogout(response) {
    $('#toggle_login i').toggleClass('loggedin').attr('title', 'Login');
    $button.remove();
}

function initArticles() {
    loadLatestArticles();
    centerArticles();

    $(window).on('resize', function () {
        centerArticles();
    });

    var metaImage = $('meta[property="og:image"]');
    var src = metaImage.attr('content');

    if (src) {
        //alert(src);
        $('#articles .frontpage').css({
            backgroundImage: 'url(' + src + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        });
    }
}

function loadLatestArticles() {
    $('#latest-articles .articles').empty();
    $.ajax({
        url: 'php/getLatestArticles.php',
        success: function (data) {
            $.each(data, function (key, value) {
                var $article = createArticleCard(value);
                $('#latest-articles .articles').append($article);
            });
        },
        error: function () {
            alert("Error fetching latest articles");
        }
    });
}

function createArticleCard(article) {
    var $card = $('<div class="card shadow p-0 m-0 mb-3"></div>');
    var $cardImage = $('<img class="card-image" alt="Article image">').attr('src', article.imageUrl || article.image);
    var $cardTitle = $('<div class="card-title h5"></div>').html(article.title);
    var $cardInfo = $('<div class="card-info mb-2 text-muted"></div>').text(article.author + " | " + article.location + " | " + article.date);
    var $cardText = $('<div class="card-text"></div>').html(article.description);
    var $cardReadMore = $('<a class="btn btn-secondary"></a>').attr('href', 'articles.php?articleid=' + article.articleid).text('Read more...');
    var $cardReadMore = $('<a class="btn btn-secondary"></a>').attr('href', 'articles.php?articleid=' + article.articleid).text('Read more...');

    var $cardBody = $('<div class="card-body">').append($cardTitle).append($cardInfo).append($cardText).append($cardReadMore);

    $card
        .append($cardImage)
        .append($cardBody);

    return $card;
}

function createArticleCardForm() {
    var $card = $('<div class="card shadow p-0 m-0"></div>');
    var $cardImage = $('<div class="card-image"><input id="input-image" type="file"><img id="new-image" src="#" alt="New article image"></div>').css({
        backgroundColor: '#ddd',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    });
    var $cardTitle = $('<div class="card-title h5"></div>').html('<input type="text" id="ftitle" placeholder="Title">');
    var $cardInfo = $('<div class="card-info mb-2 text-muted"></div>');
    var $inputAuthor = $('<input id="fauthor" type="text" placeholder="Author name">');
    var $inputLocation = $('<input id="flocation" type="text" placeholder="City, Country">');
    
    $cardInfo.append($inputAuthor).append($inputLocation);
    
    var $cardText = $('<div class="card-text"></div>');
    var $inputContent = $('<textarea id="fcontent" placeholder="Content">');
    $cardText.append($inputContent);
    
    var $cardReadMore = $('<input id="create" class="btn btn-success" type="submit" value="Create">');

    var $cardBody = $('<div class="card-body">').append($cardTitle).append($cardInfo).append($cardText).append($cardReadMore);
    $card.append($cardImage).append($cardBody);

    
    return $card;
}

function activateArticle($article) {
    $('article.active').removeClass('active');
    $article.addClass('active');
}

function centerArticles() {
    $('.title-wrapper').position({
        my: 'center',
        at: 'center',
        of: '.frontpage'
    });
    $('.title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '.title-wrapper'
    });
}
