$(document).ready(function() {
    initArticles();
    activate($('#toggle_articles'));
});

function initArticles() {
    loadLatestArticles();
    centerArticles();

    var params = getSearchParameters();

    if (params.articleid != null) {
        loadArticle(params.articleid);
    }
    
    $(window).on('resize', function() {
        centerArticles();
    });

}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
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

function loadArticle(id) {
    $.ajax({
        url: 'php/getLatestArticles.php',
        data: {
            articleid: id
        },
        success: function (data) {
            var $article = createArticle(data[0]);
            $article.css({
                border: '1px solid var(--sec-color)'
            });
            $('#latest-articles').prepend($article);
            $('#toggle_articles').click();
            $article.click();
        },
        error: function () {
            alert("Error fetching latest articles");
        }
    });
}

function createArticleCard(article) {
    var $card = $('<div class="card m-1 p-1"></div>');
    var $cardImage = $('<img class="card-image-top mb-2" alt="Article image at top"></img>').attr('src', 'img/African_woman_slave_trade.jpg');
    var $cardTitle = $('<div class="card-title h5 mb-0 pb-0"></div>').html(article.title);
    var $cardInfo = $('<p class="card-info mb-2 text-muted"></p>').text(article.author + " | " + article.location + " | " + article.date);
    var $cardBody = $('<div class="card-text ml-3 mr-3"></div>').html(article.description);
    var $cardReadMore = $('<a class="btn btn-primary"></a>').attr('href', 'articles.php?articleid=' + article.articleid).text('Read more...');
    
    $card
        .append($cardImage)
        .append($cardTitle)
        .append($cardInfo)
        .append($cardBody)
        .append($cardReadMore);
    return $card;
}
function createArticle(data) {
    var $article = $('<article class="article shadow"></article>');
    var $header = $('<div class="article-header"></div>');

    var $title = $('<div class="article-title"></div>').text(data.title);
    var $author = $('<div class="article-author"></div>').text('by ' + data.author);
    var $info = $('<div class="article-info"></div>').text(data.location + " | " + data.date);

    $header
        .append($title)
        .append($author)
        .append($info);

    var $body = $('<div class="article-body"></div>').html(data.content);
    $article.append($header).append($body);
    return $article;
}

function activateArticle($article) {
    $('article.active').removeClass('active');
    $article.addClass('active');
}

function updateMetaTags(url, title, author, description, imageUrl) {
    var $head = $('head');

    $('meta[property="og:url"]').attr('content', url);
    $('meta[property="og:title"]').attr('content', title);
    $('meta[property="og:description"]').attr('content', description);
    $('meta[property="og:image"]').attr('content', imageUrl);
    $('meta[property="article:author"]').attr('content', author);

    console.log('og:url - ' + $('meta[property="og:url"]').attr('content'));
    console.log('og:title - ' + $('meta[property="og:title"]').attr('content'));
    console.log('og:description - ' + $('meta[property="og:description"]').attr('content'));
    console.log('og:image - ' + $('meta[property="og:image"]').attr('content'));

}
    
function centerArticles() {
    $('#articles .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#articles .title-wrapper'
    });
}

