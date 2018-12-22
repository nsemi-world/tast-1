
$(document).ready(function () {
    activate($('#toggle_resources'));
    handleEvents();
    loadSectionImage('#resources .frontpage', 'resources.jpg');
    loadAuthors();
});


function handleEvents() {
    $(window).on('resize', function() {
        debounce('#resources .frontpage', 'resources.jpg');
    });
}

function loadAuthors(){
    $.ajax({
        url: 'php/getBookAuthors.php',
        success: function (authors) {
            addAuthorsSection(authors);
        },
        error: function (event) {
            alert('Error loading authors. Please Try again later.');
        }
    });
}

function addAuthorsSection(authors) {
    var $container = $('#book-list-by-author');
    $.each(authors, function(key, author) {
        createAuthorElement(author, $container);
    });
    
}

function createAuthorElement(author, $container) {
    var $element = $('<div class="author-entry card shadow small text-justify text-truncated my-4"/>').css('background-color', getRandomColor());
    var $author = $('<div class="card-header author text-left h4"/>').html('<b>' + author['author'] + '</b>').appendTo($element);
    var $cardbody = $('<div class="card-body"/>').appendTo($element);
    var $wiki = $('<div class="wiki"/>').appendTo($cardbody);
    var $books = $('<div class="books my-3 mx-auto"/>').appendTo($cardbody);
    
    $container.append($element);
    loadWikiInfo(author, $element);
}

function loadWikiInfo(author, $element) {
    $.ajax({
        url: 'php/getBooks.php',
        data: {author: author['author']},
        success: function(response) {
            console.log(response);
            $element.find('.wiki').html(extractSectionIntro(response.wikipedia));
            addAffiliateLinks(response.books, $element.find('.books'));
        },
        error: function() {
            alert('Error asking wikipedia for data');
        }
    })
}

function extractSectionIntro(wikidata) {
    var pages = wikidata.query.pages;
    var section = null;
    var wikiBadge = '<span class="badge badge-dark"><i class="fab fa-wikipedia-w"></i></span>';
    
    $.each(pages, function(key, page) {
        if(page.extract.includes('writer')) {
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


// Adds a simple link to be produced by quick links amazon widget
function addAffiliateLinks(books, $parent) {
    $.each(books, function(key, book) {
        if(book.link != null) {
            var $div = $('<div class="book d-inline-block mr-2"/>').html(book.link);
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



