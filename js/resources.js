
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
    var $element = $('<div class="small text-justify text-truncated"/>');
    var $author = $('<div class="author text-left"/>').html('<b>' + author['author'] + '</b>');
    var $wiki = $('<div class="wiki"/>');
    
    $element.append($author).append($wiki);
    $container.append($element);
    
    loadWikiInfo(author, $element);
}

function loadWikiInfo(author, $element) {
    $.ajax({
        url: 'php/askWikipedia.php',
        data: {search: author['author']},
        success: function(wikidata) {
            console.log(wikidata);
            $element.find('.wiki').text(extractSectionIntro(wikidata));
        },
        error: function() {
            alert('Error asking wikipedia for data');
        }
    })
}

function extractSectionIntro(wikidata) {
    var pages = wikidata.query.pages;
    var section = null;
    $.each(pages, function(key, page) {
        if(page.extract.includes('slavery')) {
            section = page.extract;
        }
    });
    
    if(section != null) {
        return section;    
    }
    else {
        return 'No wikipedia summary found.'
    }
    
    
}

function loadBooksByAuthor() {
    $.ajax({
        url: 'php/getBooks.php',
        data: {orderBy: 'author'},
        success: function (books) {
            addAffiliateLinks(books);
        },
        error: function (event) {
            alert('Error loading books. Please Try again later.');
        }
    });
}

// Adds a simple link to be produced by quick links amazon widget
function addAffiliateLinks(books) {
    $.each(books, function(key, book) {
        var $link = $('<a/>').attr('type', 'amzn').attr('search', book.title).attr('category', 'books').text(book.title);
        var div = $('<div/>').append($link);
        $('#book-list-by-author').append(div);
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



