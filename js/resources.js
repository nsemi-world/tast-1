var AUTHORS = null;
var BOOKS = null;

var CURRENT_AUTHOR = 0;
var CURRENT_BOOK = 0;

var FRAME_AUTHORS = 0;
var FRAME_BOOKS = 0;

$(document).ready(function () {
    activate($('#toggle_resources'));
    handleEvents();
    loadSectionImage('#resources .frontpage', 'resources.jpg');
    loadAuthors();
    loadBooks();
});


function handleEvents() {
    $(window).on('resize', function () {
        debounce('#resources .frontpage', 'resources.jpg');
    });

    $('#toggle-authors, #toggle-books, #image-only, #image-and-details, #by-title, #by-author, #by-price, #order-asc, #order-desc, #as-table, #as-list, #as-grid').on('click', function (event) {
        event.preventDefault();
        $(this).parent().find('.active').toggleClass('active');
        $(this).toggleClass('active');
    });
    
    $('#toggle-authors').on('click', function(event){
        event.preventDefault();
        $('#books-commands, #book-list').hide();
        $('#authors-commands, #author-list').show();
    });
    $('#toggle-books').on('click', function(event){
        event.preventDefault();
        $('#authors-commands, #author-list').hide();
        $('#books-commands, #book-list').show();
    });
    
    $('#by-title, #by-author, #order-asc, #order-desc').on('click', function(event){
       event.preventDefault();
        if($('#toggle-books').hasClass('active')) {
            reorderBooks();
        }
        if($('#toggle-authors').hasClass('active')) {
            reorderAuthors();
        }
    });

    $('#as-table, #as-list, #as-grid').on('click', function(event){
       event.preventDefault();
        if($('#toggle-books').hasClass('active')) {
            showBooks();
        }
        else if($('#toggle-authors').hasClass('active')) {
            showAuthors();
        }
    });

    $(document).on('_books_loaded', function (event) {
        showBooks();
    });
    
    $(document).on('_authors_loaded', function (event) {
        showAuthors();
    });
}

function showBooks() {
    if(CURRENT_BOOK != 0) {
        cancelAnimationFrame(FRAME_BOOKS);
        CURRENT_BOOK = 0;
    }
    var $parent = $('#book-list').empty();
    showBooksAux();
}

function showBooksAux() {
    if(CURRENT_BOOK < BOOKS.length) {
        FRAME_BOOKS = requestAnimationFrame(showBook);
    } 
    else {
        cancelAnimationFrame(FRAME_BOOKS);
        CURRENT_BOOK = 0;
    }
    
}
function showBook(timestamp) {
    if($('#as-list').hasClass('active')) {
        showBookForList();
    }
    if($('#as-grid').hasClass('active')){
        showBookForGrid();
    }
    CURRENT_BOOK = CURRENT_BOOK + 1;
    showBooksAux();
}

function showBookForList() {
    var $parent = $('#book-list');
    var book = BOOKS[CURRENT_BOOK];
    
    if (book && book.link != null) {
        var $book = $('<div class="book row"/>').attr('data-author', book.author);

        var $link = $('<div class="link col-auto"/>')
            .html(book.link)
            .appendTo($book);

        var $details = $('<div class="details col small"/>')
            .append($('<div class="btitle"/>').html('<b>' + book.title + '</b>'))
            .append($('<div class="bauthor text-muted border-bottom"/>').html('by <b><i>' + book.author + '</i></b>'))
            .append(
                $('<div class="bdescription"/>')
                .text(book.description)
                .prepend($('<i class="fab fa-amazon"/>').text(' ')))
            .appendTo($book);

        $parent.append($book);
    }
}
function showBookForGrid() {
    var $parent = $('#book-list');
    var book = BOOKS[CURRENT_BOOK];
    if (book && book.link != null) {
        var $book = $('<div class="book d-inline-block"/>').attr('data-author', book.author);
        var $link = $('<div class="link col-auto"/>')
            .html(book.link)
            .appendTo($book);
        $book.appendTo($parent);
    }
}

function showAuthors() {
    if(CURRENT_AUTHOR != 0) {
        cancelAnimationFrame(FRAME_AUTHORS);
        CURRENT_AUTHOR = 0;
    }
    var $parent = $('#author-list').empty();
    showAuthorsAux();
}
function showAuthorsAux() {
    if(CURRENT_AUTHOR < AUTHORS.length) {
        FRAME_AUTHORS = requestAnimationFrame(showAuthor);
    } else {
        cancelAnimationFrame(FRAME_AUTHORS);
        CURRENT_AUTHOR = 0;
    }
    
}
function showAuthor(timestamp) {
    if($('#as-list').hasClass('active')) {
        showAuthorForList();
    }
    if($('#as-grid').hasClass('active')) {
        showAuthorForGrid();
    }
    CURRENT_AUTHOR = CURRENT_AUTHOR + 1;
    showAuthorsAux();
}

function showAuthorForList() {
    var author = AUTHORS[CURRENT_AUTHOR];
    var $parent = $('#author-list');
    if (author.name != null) {
        var $author = $('<div class="author small  text-justify w-100 p-2 mb-2"/>')
            .appendTo($parent)
            .css({
                backgroundColor: getRandomColor()
            });

        var $name = $('<a class="name text-dark" href="#"/>')
            .html('<b>'+author.name+'</b>')
            .appendTo($author)
            .on('click', function(e){
                e.preventDefault();
                clickBooks();
                goToAuthorBooks(author.name);
            });

        var $wiki = $('<div class="wiki col-auto"/>')
            .html(extractSectionIntro(author.wikipedia))
            .appendTo($author);
    }
}
function showAuthorForGrid() {
    var author = AUTHORS[CURRENT_AUTHOR];
    var $parent = $('#author-list').addClass('row');
    if (author.name != null) {
        var $author = $('<div class="author d-inline-block small text-justify col-auto mb-1" style="max-width: 50%; min-width: 25%;"/>')
            .appendTo($parent)
            .css({
                backgroundColor: getRandomColor()
            });
        var $name = $('<a class="name text-dark" href="#"/>')
            .html('<b>'+author.name+'</b>')
            .appendTo($author)
            .on('click', function(e){
                e.preventDefault();
                clickBooks();
                goToAuthorBooks(author.name);
            });

        var $wiki = $('<div class="wiki"/>')
            .html(extractSectionIntro(author.wikipedia))
            .appendTo($author);
    }
}

function clickBooks() {
    $('#toggle-books').click();
    //$('#by-author').click();
}

function goToAuthorBooks(name) {
    setTimeout(function(){
        var books = $('.book');

        $.each(books, function(key, ba){
            var $b = $(ba);
            var data = $b.attr('data-author');
            if(!data.includes(name)) {
                console.log('Exclude = ' + data);
                $b.hide();
            }
        });
    }, 1500);
    
}


/**
 * Reaction to detail show hide depend  
 */
function showDetails() {
    $('.details').show();
    $('.book').animate({
        'width': '100%'
    }, 500);
}

function hideDetails() {
    $('.details').hide();
    $('.book').animate({
        'width': '160'
    }, 500);
}

function loadBooks() {
    $.ajax({
        url: 'php/getBooks.php',
        success: function (response) {
            BOOKS = response;
            $(document).trigger('_books_loaded');
        },
        error: function (event) {
            alert('Error loading books. Please Try again later.');
        }
    });
}

function loadAuthors() {
    $.ajax({
        url: 'php/getBookAuthors.php',
        success: function (response) {
            AUTHORS = response;
            $(document).trigger('_authors_loaded');
        },
        error: function (event) {
            alert('Error loading authors. Please Try again later.');
        }
    });
}

function loadWikiInfo(author, $element) {

    $.ajax({
        url: 'php/getBooks.php',
        data: {
            author: author
        },
        success: function (response) {
            BOOKS = response;
            $(document).trigger('_books_loaded');
            /*$element.find('.wiki').html(extractSectionIntro(response.wikipedia));
            addAffiliateLinks(response.books, $element.find('.books'));*/
        },
        error: function () {
            alert('Error asking wikipedia for data');
        }
    })
}

// Adds a simple link to be produced by quick links amazon widget
function addAffiliateLinks(books, $parent) {
    $.each(books, function (key, book) {
        if (book.link != null) {
            var $div = $('<div class="book d-inline-block"/>').html(book.link).css({
                transform: 'scaleY(.85)'
            });
            $parent.append($div);
        }
    });

}


function reorderBooks() {
    var order = $('#order-group .active').attr('id');
    var criteria = $('#criteria-group .active').attr('id');
    
    BOOKS = BOOKS.sort(function(a,b){
        var value = (criteria == 'by-title')
            ? a.title.localeCompare(b.title)
            : a.author.localeCompare(b.author);
        return (order=='order-asc') ? value : -value;
    });
    showBooks();
}

function reorderAuthors() {
    var order = $('#order-group .active').attr('id');

    AUTHORS = AUTHORS.sort(function(a,b){
        var value = a.name.localeCompare(b.name);
        return (order=='order-asc') ? value : -value;
    });
    showAuthors();
}

function addAuthorsSection() {
    var $container = $('#author-list');
    $.each(AUTHORS, function(key, author) {
        createAuthorElement(author);
    });
    
    

}

function createAuthorElement(author) {
    var $author = $('<div class="author shadow small text-justify"/>')
        .css('background-color', getRandomColor());
    
    var $name = $('<h4 class="author border-bottom"/>')
        .html('<b>' + author.name + '</b>')
        .appendTo($author);
    
    var $wiki = $('<div class="wiki"/>')
        .text(extractSectionIntro(author.wikipedia))
        .appendTo($author);
    
    $container.append($element);
}


function extractSectionIntro(wikidata) {
    var pages = wikidata.query.pages;
    var section = null;
    var wikiBadge = '<span class="badge badge-dark"><i class="fab fa-wikipedia-w"></i></span> ';
    
    $.each(pages, function(key, page) {
        if(page.extract && page.extract.includes('writer')) {
            section = '<span class="extract">' + page.extract + '</span>';
        }
    });
    
    if(section != null) {
        return wikiBadge + section;    
    }
    else {
        return wikiBadge + '<span class="extract">No wikipedia summary found.</span>';
    }
}



// By David Walsh on April 4, 2011  - https://davidwalsh.name/convert-xml-json
// Changes XML to JSON
function xmlToJson(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
