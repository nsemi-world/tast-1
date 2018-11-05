
$(document).ready(function () {
    initResources();
    activate($('#toggle_resources'));
});


function initResources() {
    getBooks();
    centerResources();    
    $(window).on('resize', function() {
        centerResources();
    });
}

function getBooks() {
    $.ajax({
        url: 'php/getAffiliatedBooks.php',
        success: function (data) {
            addAffiliateLinks(data);
        },
        error: function (event) {
            alert('Error loading books. Please Try again later.');
        }
    });
}

function addAffiliateLinks(links) {
    var $articles = $('#resources .articles');
    
    $.each(links, function (author, data) {
        var $article = null;
        if(data.citation[0]) {
            $article = createAuthorArticle(author, data.citation[0].quote, data.books);
        }
        else {
            $article = createAuthorArticle(author, '', data.books);
        }
        $article.appendTo($articles);
    });
}

function createAuthorArticle(author, citation, books) {
    var $article = $('<article class="article  shadow"></article>');
    var $header = $('<div class="article-header"></div>');
    var $author = $('<div class="article-author"></div>').text(author);
    var $books = $('<div class="article-body books"></div>');

    $.each(books, function (key, book) {
        
        var $media = $('<div class="media book"></div>');
        var $mediaFigure = $('<img class="shadow"></img>').attr('src', book.image).attr('title', book.title);
        var $mediaBody = $('<div class="media-body"></div>');
        var $mediaTitle = $('<div class="book-title"></div>').text(book.title);

        $media.append($mediaFigure).append($mediaBody.append($mediaTitle));           
        $books.append($media);
        
    });

    if(citation != null) {
       var $title = $('<div class="article-title"></div>').text(citation);
       $header.append($title);
    }
    $header.append($author);
    
    $article
        .append($header)
        .append($books);
    
    console.log($article);
    return $article;
}


function centerResources() {
    $('#resources .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#resources .title-wrapper'
    });
}

