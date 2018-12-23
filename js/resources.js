var AUTHORS = null;
var BOOKS = null;

$(document).ready(function () {
    activate($('#toggle_resources'));
    handleEvents();
    loadSectionImage('#resources .frontpage', 'resources.jpg');
    loadBooks();
});


function handleEvents() {
    $(window).on('resize', function() {
        debounce('#resources .frontpage', 'resources.jpg');
    });
    
    $('#books-only').on('click', function(event) {
        event.preventDefault();
        $(this).parent().find('.active').toggleClass('active');
        $(this).toggleClass('active');
        hideBooksDetails();
    });
    
    $('#books-and-details').on('click', function(event) {
        event.preventDefault();
        $(this).parent().find('.active').toggleClass('active');
        $(this).toggleClass('active');
        showBooksDetails();
    });
    
    $(document).on('_books_loaded', function(event){
        showAmazonLinksOnly();
    });
}

function showAmazonLinksOnly() {
    var $parent = $('#book-list-by-author').empty();
    
    $.each(BOOKS, function(key, book) {
        if(book.link != null) {
            var $book = $('<div class="book row"/>');
            
            var $link = $('<div class="link col-auto"/>')
                .html(book.link)
                .appendTo($book);
            
            var $details = $('<div class="details col small"/>')
                .append($('<div class="btitle"/>').html('<b>' + book.title + '</b>'))
                .append($('<div class="bauthor text-muted border-bottom"/>').html('by <b><i>' + book.author + '</i></b>'))
                .append($('<div class="bdescription"/>').text(book.description))
                .appendTo($book);
            
            $parent.append($book);
        }
    });
}

function showBooksDetails() {
    $('.details').show();
    $('.book').removeClass('d-inline-block').animate({
        'width': '100%'
    }, 500);
}

function hideBooksDetails() {
    $('.details').hide();
    $('.book').addClass('d-inline-block').animate({
        'width': '160'
    }, 500);
}

function loadBooks(){
    $.ajax({
        url: 'php/getBooks.php',
        success: function (response) {
            BOOKS = response;
            $(document).trigger('_books_loaded');
        },
        error: function (event) {
            alert('Error loading authors. Please Try again later.');
        }
    });
}

/*
function addAuthorsSection(authors) {
    var $container = $('#book-list-by-author');
    $.each(authors, function(key, author) {
        createAuthorElement(author, $container);
    });
    
}

function createAuthorElement(author, $container) {
    var $element = $('<div class="author-entry shadow small text-justify text-truncated p-2 mb-2"/>').css('background-color', getRandomColor());
    var $author = $('<h4 class="author border-bottom"/>').html('<b>' + author + '</b>').appendTo($element);
    var $cardbody = $('<div class=""/>').appendTo($element);
    var $wiki = $('<div class="wiki"/>').appendTo($cardbody);
    var $books = $('<div class="books my-3 mx-auto"/>').appendTo($cardbody);
    
    $container.append($element);
    loadWikiInfo(author, $element);
}
*/

function loadWikiInfo(author, $element) {
    
    $.ajax({
        url: 'php/getBooks.php',
        data: {author: author},
        success: function(response) {
            BOOKS = response;
            $(document).trigger('_books_loaded');
            /*$element.find('.wiki').html(extractSectionIntro(response.wikipedia));
            addAffiliateLinks(response.books, $element.find('.books'));*/
        },
        error: function() {
            alert('Error asking wikipedia for data');
        }
    })
}

/*
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
*/

// Adds a simple link to be produced by quick links amazon widget
function addAffiliateLinks(books, $parent) {
    $.each(books, function(key, book) {
        if(book.link != null) {
            var $div = $('<div class="book d-inline-block mr-1"/>').html(book.link).css({
                transform: 'scaleY(.85)'
            });
            $parent.append($div);
        }
    });
    
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
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
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



