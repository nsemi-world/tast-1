var $button = null;

$(document).ready(function () {
    init();
    $(document).on('_facebook_login', function (event, response) {
        console.log('_LOGIN_SUCCESS');
        onLogin(response);
    });

    $(document).on('_facebook_logout', function (event, response) {
        console.log('_LOGOUT_SUCCESS');
        onLogout(response);
    });
});

function init() {
    initArticles();
    activate($('#toggle_articles'));
    createNewArticleButton();
}

function onLogin(response) {
    createNewArticleButton();
    $button.attr('disabled', false);
}

function onLogout(response) {
    $button.attr('disabled', true);
}


function createNewArticleButton(){
    $button = $('<button id="createArticle" class="btn shadow" disabled><i class="fas fa-plus"></i></button>');
    $button.css({
        position: 'fixed',
        right: '1.5em',
        bottom: '1.5em',
        background: 'yellow',
        borderRadius: '50%'
    }).on('click', function () {
        $button.attr('disabled', true);
        
        var $card = createArticleCardForm();
        $('#latest-articles .articles').prepend($card);
        $('input, textarea').css({width: '100%'});
        $('#fcontent').richText();
        $("#input-image").change(function(){
            readURL(this);
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
    var aabstract = $('#fabstract').val();
    var content = $('#fcontent').val();
    
    console.log('Image: ' + imageName);
    console.log('Title: ' + title);
    console.log('Author: ' + author);
    console.log('Location: ' + location);
    console.log('Date: ' + date);
    console.log('Abstract: ' + aabstract);
    console.log('Content: ' + content);
    
    $.ajax({
        url: 'php/createArticle.php',
        type: 'POST',
        data: {article: {image: image, imageName: imageName, title: title, author: author, location: location, date: date, abstract: aabstract, content: content}},
        success: function(data) {
            init();
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


function initArticles() {
    //$('#latest-articles .articles').empty();
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

    var $cardBody = $('<div class="card-body">').append($cardTitle).append($cardInfo).append($cardText).append($cardReadMore);

    $card
        .append($cardImage)
        .append($cardBody);

    return $card;
}

function createArticleCardForm() {
    var $card = $('<form action="javascript:saveArticle(this)" class="form card shadow p-0 m-0"></form>');
    var $cardImage = 
        $('<div class="card-image"><input id="input-image" type="file" required><img id="new-image" src="#" alt="New article image"></div>').css({
        backgroundColor: '#ddd',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    });
    var $cardTitle = $('<div class="card-title h5"></div>').html('<input type="text" id="ftitle" placeholder="Title" required>');
    var $cardInfo = $('<div class="card-info mb-2 text-muted"></div>');
    var $inputAuthor = $('<input id="fauthor" type="text" placeholder="Author name" required>');
    var $inputLocation = $('<input id="flocation" type="text" placeholder="City, Country" required>');
    
    $cardInfo.append($inputAuthor).append($inputLocation);
    
    var $cardText = $('<div class="card-text"></div>');
    var $inputAbstract = $('<textarea id="fabstract" placeholder="Abstract" required>');
    var $inputContent = $('<textarea id="fcontent" placeholder="Content" required>');
    
    $cardText.append($inputAbstract).append($inputContent);
    
    var $cardFooter = $('<div class="card-footer"></div>');
    var $cardSave = $('<input id="create" class="btn btn-success" type="submit" value="Create">');
    
    var $cardCancel = $('<input id="cancel" class="btn btn-secondary" type="cancel" value="Cancel">').on('click', function(event) {
        event.preventDefault();
        $card.remove();
        $button.attr('disabled', false);
    });
    $cardFooter.append($cardSave).append($cardCancel);

    var $cardBody = $('<div class="card-body">')
        .append($cardTitle)
        .append($cardInfo)
        .append($cardText)

    $card.append($cardImage).append($cardBody).append($cardFooter);

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
