$(document).ready(function() {
    initArticles();
    activate($('#toggle_articles'));
    createNewArticleButton();
});

function createNewArticleButton() {
    var $button = $('<button id="createArticle" class="btn shadow"><i class="fas fa-plus"></i></button>');
    $button.css({
        position: 'fixed',
        right: '1.5em',
        bottom: '1.5em',
        background: 'yellow',
        borderRadius: '50%'
        
    });
    
    $('#latest-articles').append($button);
    $button.on('click', function() {
        checkLoginState();
        if(!isLoggedIn()) {
            login();
        }
        else {
            alert("Logged IN");
        }
    });
}

function initArticles() {
    loadLatestArticles();
    centerArticles();
    
    $(window).on('resize', function() {
        centerArticles();
    });
    
    var metaImage = $('meta[property="og:image"]');
    var src = metaImage.attr('content');
    
    if(src) {
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
    var $card = $('<div class="card shadow p-0 m-0"></div>');
    var $cardImage = $('<div class="card-image"></div>').css({
            backgroundImage: 'url(' + article.imageUrl + ')',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
    });
    var $cardTitle = $('<div class="card-title h5"></div>').html(article.title);
    var $cardInfo = $('<p class="card-info mb-2 text-muted"></p>').text(article.author + " | " + article.location + " | " + article.date);
    var $cardText = $('<div class="card-text"></div>').html(article.description);
    var $cardReadMore = $('<a class="btn btn-secondary"></a>').attr('href', 'articles.php?articleid=' + article.articleid).text('Read more...');
    var $cardReadMore = $('<a class="btn btn-secondary"></a>').attr('href', 'articles.php?articleid=' + article.articleid).text('Read more...');

    var $cardBody = $('<div class="card-body">').append($cardTitle).append($cardInfo).append($cardText).append($cardReadMore);
    
    $card
        .append($cardImage)
        .append($cardBody);
    
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

