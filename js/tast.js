var status_tast = {
    home: {
        intervalHome: null
    },
    voyages: {
        storymap: null,
        context: "All",
        intervalVoyage: null,
        intervalSlide: null,
        ids: [],
        index: 0
    },
    participation: {
        year: 1514,
        series: [],
        animationStarted: false,
        interval: null,
        datamap: null,
        datatable: null
    },
    charts: {
        voyages: 0,
        ships: 0,
        start: 0,
        end: 0,
        emb: 0,
        desemb: 0,
        interval: null,
        year: 1562,
        voyCounter: 0,
        currentChart: 0
    },
    ships: {
        datatable: null,
        series: [],
        started: false
    },
    owners: {
        datatable: null,
        series: [],
        started: false
    },
    captains: {
        datatable: null,
        series: [],
        started: false
    },
    places: {
        datatable: null,
        series: [],
        started: false
    }
};
var started = {
    home: false,
    citation: false,
    participation: false,
    voyages: false,
    database: false,
    charts: false,
    articles: false,
    contribute: false,
    aboutUs: false
}
var currentSection = null;

$(document).ready(function () {
    initializeApp();
});

function initializeApp() {
    initMenu();
    initHome();
    initCitation();
    initParticipation();
    initVoyages();
    initTabs();
    initArticles();
    initAboutUs();
    initContribute();


    $('#toggle_home').click();
}

function initMenu() {
    $('#toggle_home').on('click', function (event) {
        event.preventDefault();
        if (!started.home) {
            initHome();
        }
        enter('#home');
        activate($(this));
    });
    $('#toggle_citation').on('click', function (event) {
        event.preventDefault();
        if (!started.citation) {
            initCitation();
        }
        enter('#citation');
        activate($(this));
    });
    $('#toggle_voyages').on('click', function (event) {
        event.preventDefault();
        if (!started.voyages) {
            initVoyages();
        }
        enter('#voyages');
        activate($(this));
    });
    $('#toggle_participation').on('click', function (event) {
        event.preventDefault();
        if (!started.participation) {
            initParticipation();
        }
        enter('#participation');
        activate($(this));
    });
    $('#toggle_charts').on('click', function (event) {
        event.preventDefault();
        if (!started.charts) {
            initCharts();
        }
        enter('#charts');
        activate($(this));
    });
    $('#toggle_database').on('click', function (event) {
        event.preventDefault();
        if (!started.database) {
            initTabs();
        }
        enter('#database');
        activate($(this));
    });
    $('#toggle_about_us').on('click', function (event) {
        event.preventDefault();
        if(!started.aboutUs) {
            initAboutUs();
        }
        enter('#about-us');
        activate($(this));
    });

    $('#toggle_articles').on('click', function (event) {
        event.preventDefault();
        if (!started.articles) {
            initArticles();
        }
        enter('#articles');
        activate($(this));
    });
    $('#toggle_contribute').on('click', function (event) {
        event.preventDefault();
        if (!started.contribute) {
            initContribute();
        }
        enter('#contribute');
        activate($(this));
    });
}

function enter(selector) {
    goTo(selector);
    switch (selector) {
        case '#home':
            centerHome();
            break;
        case '#citation':
            centerCitation();
            break;
        case '#participation':
            initParticipationMap();
            break;
        case '#voyages':
            centerVoyages();
            if (status_tast.voyages.storymap != null) {
                status_tast.voyages.storymap.updateDisplay();
            }
            break;
        case '#about-us':
            centerAboutUs();
            break;
        case '#articles':
            centerArticles();
            break;
        case '#contribute':
            centerContribute();
    }
}



function goTo(selector) {
    hideAllSectionsExcept(selector);
}

function hideAllSectionsExcept(selector) {
    if (currentSection != null) {
        $(currentSection).hide();
    }
    $('section').hide();
    $(selector).show();
    currentSection = selector;
}

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}


function initHome() {
    started.home = true;
    centerTitle('#home .frontpage');    
    $(window).on('resize', function() {
        centerTitle('#home .frontpage');
    });
}

function centerHome() {
    $('#home .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#home .title-wrapper'
    });
}

function centerCitation() {
    $('#citation .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#citation .title-wrapper'
    });
}

function centerVoyages() {
    $('#voyages .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#voyages .title-wrapper'
    });
}

function centerParticipation() {
    $('#participation .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#participation .title-wrapper'
    });
}

function centerDatabase() {
    $('#database .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#database .title-wrapper'
    });
}

function centerCharts() {
    $('#charts .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#charts .title-wrapper'
    });
}

function centerAboutUs() {
    $('#about-us .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#about-us .title-wrapper'
    });
}

function centerArticles() {
    $('#articles .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#articles .title-wrapper'
    });
}

function centerContribute() {
    $('#contribute .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#contribute .title-wrapper'
    });
}

function initCitation() {
    getCitation();
    started.citation = true;
    centerTitle('#citation .frontpage');    
    $(window).on('resize', function() {
        centerTitle('#citation .frontpage');
    });
}

function getCitation() {
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
    var $articles = $('#citation .articles');
    
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


function initVoyages() {
    configureVoyagesPlayer();
    loadVoyageIds();
    started.voyages = true;
    centerTitle('#voyages .frontpage');
    $(window).on('resize', function() {
        centerTitle('#voyages .frontpage');
        if(status_tast.voyages.storymap != null) {
            status_tast.voyages.storymap.updateDisplay(); // this isn't automatic
        }
    });

    $('#voyages').on('_ids_loaded', function (event) {
        loadVoyageData(0);
    });

    $('#voyages').on('_request_voyage_data', function (event, index) {
        loadVoyageData(index);
    });

    $('#voyages').on('_voyage_loaded', function (event, data, index) {
        createStoryMap(data, status_tast.voyages.ids[index]);
        initData(data, index);
        status_tast.voyages.storymap.updateDisplay();
        updateVPlayer(index);
    });

    $('#voyages').on('click', 'a.filter', function (event) {
        event.preventDefault();
        var filter = $(this).attr('href');
        var value = getFilterValue($(this));
        loadFilteredVoyageIds(filter, value);
        status_tast.voyages.context = filter + ' is ' + value;
    });

}

function configureVoyagesPlayer() {
    $('#vprev, #vpause').hide();
    $('#vnext').on('click', function (event) {
        event.preventDefault();
        status_tast.voyages.index++;
        var ids = status_tast.voyages.ids;
        var index = status_tast.voyages.index;
        $('#voyages').trigger('_request_voyage_data', [index]);
    });
    $('#vprev').on('click', function (event) {
        event.preventDefault();
        status_tast.voyages.index--;
        var ids = status_tast.voyages.ids;
        var index = status_tast.voyages.index;
        $('#voyages').trigger('_request_voyage_data', [index]);
    });
    $('#vplay').on('click', function (event) {
        event.preventDefault();
        $('#vplay').hide();
        $('#vpause').show();
        animateSlides();
    });
    $('#vpause').on('click', function (event) {
        event.preventDefault();
        $('#vplay').show();
        $('#vpause').hide();
        stopSlides();
    });
}

function loadVoyageIds() {
    var url = 'php/getVoyageIds.php';
    $.ajax({
        url: url,
        data: {
            include_summary: true
        },
        success: function (result) {
            if (result.ids) {
                status_tast.voyages.ids = result.ids;
                status_tast.voyages.index = 0;
                $('#voyages').trigger('_ids_loaded', [result.ids]);
            }
        },
        error: function () {}
    });
}

function loadFilteredVoyageIds(filter, filter_value) {
    var url = 'php/getFilteredVoyageIds.php';
    $.ajax({
        url: url,
        data: {
            filter: filter,
            value: filter_value,
            include_summary: true
        },
        success: function (result) {
            if (result.ids.length > 0) {
                status_tast.voyages.ids = result.ids;
                status_tast.voyages.index = 0;
                $('#voyages').trigger('_ids_loaded', [result.ids]);
            } else {
                alert('Voyages not found!')
            }
        },
        error: function () {

        }
    });
}

function loadVoyageData(index) {
    var url = 'php/getVoyageItineraryById.php';
    $.ajax({
        url: url,
        data: {
            voyageid: status_tast.voyages.ids[index]
        },
        dataType: 'json',
        success: function (result) {
            $('#voyages').trigger('_voyage_loaded', [result, index]);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error: " + textStatus);
        }
    });
}

function createStoryMap(data, id) {
    // storymap_data can be an URL or a Javascript object
    var slides = this.createSlides(data, id);
    var storymap_data = {
        storymap: {
            map_type: "osm:standard",
            slides: slides,
            font_css: "stock:amatic-andika"
        }
    };
    // certain settings must be passed within a separate options object
    var storymap_options = {};

    $('#storymap').empty();
    status_tast.voyages.storymap = new VCO.StoryMap(
        'storymap', storymap_data, storymap_options);

    $(document).trigger('_map_loaded');
}

function createSlides(voyage_data, id) {
    var slides = [];

    var overview = this.createOverview(voyage_data, id);
    slides.push(overview);

    $.each(voyage_data.itinerary, function (key, value) {
        var headline =
            '<div class="h6 headline">' +
            '<div class="key">' + value.stage + '</div></hr>' +
            '<div class="value">' + value.place + '</div>' +
            '<div class="value">' + value.date + '</div>' +
            '</div>';
        var text = '<div class="storymap-text">';
        text += '</div>';


        if (value.place != null) {
            var slide = {
                "date": value.date,
                "text": {
                    "headline": headline,
                    "text": text
                },
                "location": {
                    "name": value.place,
                    "lat": value.geo.latitude,
                    "lon": value.geo.longitude,
                    "line": true
                },
                "options": {
                    "background": 'url(img/Slavery.jpg)',
                }
            }
            slides.push(slide);
        }
    });

    return slides;
}

function createOverview(voyage_data, id) {
    var period =
        '[' +
        getFirstDate(voyage_data) +
        ', ' +
        getLastDate(voyage_data) +
        ']';

    var headline =
        '<div class="h3 headline clearfix">' +
        '<p class="key">Voyage ' +
        '<span>' + id + '</span></p>' +
        '</div>';

    var text =
        '<div class="itinerary value clearfix">' +
        getVoyagePlaces(voyage_data) +
        '</div>';

    return {
        "type": "overview",
        "date": getFirstDate(voyage_data),
        "text": {
            "headline": headline,
            "text": text,
            "location": {
                zoom: 4
            }
        }
    };
}

function initData(data, index) {
    $('#details').empty();
    initInfo(data, index);
    initOutcome(data);
    initSlaveNumbers(data);
}

function initInfo(data, index) {
    var $voyage_context = createElement(
        'info-context',
        "Filter: ",
        status_tast.voyages.context);

    var $voyage_order = createElement(
        'info-index',
        "Index: ",
        (index + 1) + " out of " + status_tast.voyages.ids.length);

    var $voyageid = createElement(
        'info-voyageid',
        "Voyage Id: ",
        data.details.voyageid
    );

    var period = getTimeInterval(data);

    var $period = createElement(
        'info-dates',
        'Dates: ',
        period
    );

    var $places = createElement(
        'info-itinerary',
        'Itinerary: ',
        getVoyagePlaces(data)
    );

    var $shipname = createElement(
        'info-ship',
        'Ship: ',
        '<a class="filter" href="shipname">' + data.details.shipname + '</a>'
    );

    var $flag = createElement(
        'info-country',
        'Country: ',
        '<a class="filter" href="country">' + data.details.flag + '</a>'
    );

    var $owners = createElement(
        'info-owners',
        'Owners: ',
        getVoyageOwners(data)
    );

    var $captains = createElement(
        'info-captains',
        'Captains: ',
        getVoyageCaptains(data)
    );

    var $info = $('<div class="info"></div>');
    $info.appendTo('#details')
        .append($voyage_context)
        .append($voyage_order)
        .append($voyageid)
        .append($period)
        .append($places)
        .append($('<hr/>'))
        .append($shipname)
        .append($flag)
        .append($owners)
        .append($captains);
}

function initOutcome(data) {

    var $fate_voyage = createElement(
        'outcome-voyage',
        'Voyage Outcome: ',
        '<a href="fate" class="filter">' + data.details.fate + '</a>'
    );

    var $fate_slaves = createElement(
        'outcome-slaves',
        'For slaves: ',
        '<a href="fate" class="filter">' + data.details.fate2 + '</a>'
    );

    var $fate_if_captured = createElement(
        'outcome-captured',
        'Vessel captured: ',
        '<a href="fate" class="filter">' + data.details.fate3 + '</a>'
    );

    var $fate_owners = createElement(
        'outcome-owner',
        'For owner: ',
        '<a href="fate" class="filter">' + data.details.fate4 + '</a>'
    );

    var $outcome = $('<div class="outcome"></div>');

    $outcome.appendTo('#details')
        .append($fate_if_captured)
        .append($fate_voyage)
        .append($fate_slaves)
        .append($fate_owners)
        .append($('<hr/>'));
}

function initSlaveNumbers(data) {
    var $embarked = createElement(
        'slaves-embarked',
        'Embarked: ',
        getNumber('embarked', data.details.slaves.embarked)
    );

    var $disembarked = createElement(
        'slaves-disembarked',
        'Disembarked: ',
        getNumber('disembarked', data.details.slaves.disembarked)
    );

    var $died = createElement(
        'slaves-died',
        'Died: ',
        getNumber('died', data.details.slaves.died)
    );

    var $resistance = createElement('resistance', 'Resistance', data.details.resistance);

    if (data.details.resistance != null) {
        addResistanceIcon();
    }

    var $slaves = $('<div class="slaves"></div>');

    $slaves.appendTo('#details')
        .append($embarked)
        .append($disembarked)
        .append($died)
        .append($resistance);
}

function createElement(id, key, value) {
    var $key = $('<div class="key col-sm-4"></div>').text(key);
    var $value = $('<div class="value col-sm-8"></div>').html(value || '--');
    var $element = $('<div class="row p-1"></div>').attr('id', id);

    $element.append($key).append($value);

    return $element;
}

function addResistanceIcon() {
    var $icon = $('<i class="fas fa-registered resistance"></i>');
    $icon
        .prependTo('#details')
        .css({
            position: 'absolute',
            zIndex: 30,
            top: '1.25em',
            left: '1em',
        });
}

function getPercentage(value, total) {
    return (100 * value / total).toFixed(2);
}

function getTimeInterval(data) {
    var before = '<a id="before"  class="filter" href="date" title="Before ' + getFirstDate(data) + '"><i class="fas fa-angle-left"></i></a> ';
    var between = '<a id="between" class="filter" href="date"> [' + getFirstDate(data) + ', ' + getLastDate(data) + ']</a> '
    var after = '<a id="after" class="filter" href="date" title="After ' + getLastDate(data) +
        '"><i class="fas fa-angle-right"></i></a>';

    return before + between + after;
}

function getFirstDate(data) {
    if (data) {
        var itinerary = data.itinerary;
        return itinerary.departure.date;
    }
}

function getNumber(filter, value) {
    var leftLink = '<a class="filter" href="' + filter + '" title="<' + value + '"><i class="fas fa-angle-left"></i></a>';
    var rightLink = '<a class="filter" href="' + filter + '" title=">' + value + '"><i class="fas fa-angle-right"></i></a>'
    return leftLink + ' ' + value + ' ' + rightLink;
}

function getLastDate(data) {
    if (data) {
        var itinerary = data.itinerary;
        return itinerary['end'].date ||
            itinerary['landing3'].date ||
            itinerary['landing2'].date ||
            itinerary['landing1'].date ||
            itinerary['ooa'].date ||
            itinerary['purchase3'].date ||
            itinerary['purchase2'].date ||
            itinerary['purchase1'].date ||
            itinerary['departure'].date;
    }
}

function getVoyagePlaces(data) {
    if (data) {
        var places = [];
        $.each(data.itinerary, function (i, v) {
            if (v.place != null) {
                var new_value = v.place
                    .replace(", port unspecified", "")
                    .replace("., port unspecified", "")
                    .replace(". port unspecified", "")
                    .replace(", unspecified", "");
                places.push('<a href="place" class="filter">' + new_value + '</a>');
            }
        });
        return places.join(" | ");
    }
}

function getVoyageOwners(data) {
    if (data) {
        var owners = [];
        $.each(data.details.owners, function (i, v) {
            owners.push('<a href="owner" class="filter">' + v + '</a>');
        });
        return owners.join(" | ");
    }
}

function getVoyageCaptains(data) {
    if (data) {
        var captains = [];
        $.each(data.details.captains, function (i, v) {
            captains.push('<a href="captain" class="filter">' + v + '</a>');
        });
        return captains.join(" | ");
    }
}

function onMapHover() {
    $('#storymap').hover(
        function () {
            expandStoryMap();
        },
        function () {
            contractStoryMap();
        }
    );
}

function getFilterValue(element) {
    if (element.attr('href') == 'date') {
        var title = element.attr('title');
        title = title.replace('Before ', '<');
        title = title.replace('After ', '>');
        return title;
    } else if (element.attr('href') == 'embarked' || element.attr('href') == 'disembarked' || element.attr('href') == 'died') {
        var title = element.attr('title');
        return title;
    } else {
        return element.text();
    }
}

function updateVPlayer(index) {
    var nVoyages = status_tast.voyages.ids.length;
    if (index == 0) {
        $('#vprev').hide();
        $('#vnext').show();
    } else if (index >= (nVoyages - 1)) {
        $('#vnext').hide();
        $('#vprev').show();
    } else {
        $('#vprev').show();
        $('#vnext').show();
    }
}

function animateSlides() {
    status_tast.voyages.intervalSlide =
        setInterval(clickNextSlide, 5000);
}

function stopSlides() {
    clearInterval(status_tast.voyages.intervalSlide);
}

function clickNextSlide() {
    var style = $('.vco-slidenav-next').attr('style');
    var index = status_tast.voyages.index;
    var last = status_tast.voyages.ids.length - 1;

    if (!style.includes('display: none')) {
        $('.vco-slidenav-next').click();
    } else if (index < last) {
        $('#vnext').click();
    } else {
        $('#vpause').click();
    }
}



function initParticipation() {
    status_tast.participation.datatable = getParticipationDataTable();

    configureParticipationPlayer();
    configureParticipationAppearence();
    getCountriesSeries(0);
    centerTitle('#participation .frontpage');
    $(window).on('resize', function() {
        centerTitle('#participation .frontpage');
    });

    started.participation = true;

    $('#world-container').on('_series_loaded', function (event) {
        initParticipationMap();

    });
    $('#countries-data').on('_series_loaded', function (event) {
        initCountriesData();
    });

    $(window).on('resize', function () {
        centerTitle('#participation .frontpage');
    });
}

function centerTitle(parentSelector) {
    $(parentSelector + ' .title').position({
        my: 'center',
        at: 'center',
        of: parentSelector
    });
}

function configureParticipationPlayer() {
    $('#ppause').hide();
    $('#pplay').on('click', function (event) {
        event.preventDefault();
        if (!status_tast.participation.animationStarted) {
            cleanSeries();
            status_tast.participation.animationStarted = true;
        }
        animateParticipation();
        $('#pplay, #ppause, #prefresh').toggle();
    });
    $('#ppause').on('click', function (event) {
        event.preventDefault();
        stopParticipationAnimation();
        $('#pplay, #prefresh, #ppause').toggle();
    });
    $('#prefresh').on('click', function () {
        stopParticipationAnimation();
        cleanSeries();
        status_tast.participation.animationStarted = false;
        initParticipationMap();
    });
}

function configureParticipationAppearence() {
    //$('#countries-data').css({overflowY: 'scroll'}, 1000);
}

function initParticipationMap() {
    $('#world-map').empty();
    var series = status_tast.participation.series;
    var dataset = {};

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = series.map(function (obj) {
        return obj[3];
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
        .domain([0, maxValue])
        .range(["#999", "black"]); // blue color

    // fill dataset in appropriate format
    series.forEach(function (item) { //
        // item example value ["USA", 70]
        var iso = item[2],
            value = item[3];
        dataset[iso] = {
            numberOfThings: value,
            fillColor: paletteScale(value)
        };
    });

    var fills = getFills();
    var template = function (geo, data) {
        // don't show tooltip if country don't present in dataset
        if (!data || data.numberOfThings == 0) {
            return;
        }
        // tooltip content
        return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings.toLocaleString('en'), '</strong>',
                    '</div>'].join('');
    };

    // render map
    datamap = new Datamap({
        element: document.getElementById('world-map'),
        projection: 'equirectangular',
        projectConfig: {
            center: [0, 0],
        },
        responsive: true,
        fills: fills,
        data: dataset,
        geographyConfig: {
            borderColor: 'pink',
            background: 'black',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: template
        }
    });

    datamap.bubbles(
        getBubbles(), {
            popupTemplate: function (geo, data) {
                return '<div class="hoverinfo">Country:' + data.country + '<hr>Embarked: ' + data.embarked + '</br>Disembarked: ' + data.disembarked + '</br>Died: ' + data.died + '';
            }
        });

    datamap.graticule();

}

function getFills() {
    return {
        GBR: 'blue',
        PRT: 'green',
        FRA: 'red',
        ESP: 'yellow',
        NLD: 'pink',
        DNK: 'white',
        USA: 'cadetblue',
        BRA: 'yellowgreen',
        defaultFill: 'rgba(0,0,0,.1)'
    }
}

function getBubbles() {
    var series = status_tast.participation.series;
    var bubbles = [];
    var i = 0;

    $.each(series, function (key, value) {
        bubbles[i++] = {
            centered: value[2],
            country: value[0],
            fillKey: value[2],
            radius: radius(value[3]),
            embarked: value[3],
            disembarked: value[4],
            died: value[5],
            borderColor: 'gray'
        }
    });
    return bubbles;
}

/*
    A = PI * r^2
    r = SQRT(A/PI)
*/
function radius(value) {
    var scale = 10;
    return Math.sqrt(value / Math.PI) / scale;
}

function getCountriesSeriesMax() {
    var series = status_tast.participation.series;
    var max = 0;
    for (var i = 0; i < series.length; i++) {
        if (series[i][3] > max) {
            max = series[i][3];
        }
    }
    return max;
}

function height(value) {
    var series = status_tast.participation.series;
    var max = series[0][3];
    var maxHeight = 500;

    return value * maxHeight / max;
}

function getCountriesSeries(y) {
    var url = 'php/getCountriesSeries.php';

    $.ajax({
        url: url,
        data: {
            year: y
        },
        success: function (data) {

            if (y == 0) {
                status_tast.participation.series = data;
            } else {
                $.each(data, function (key, value) {
                    var i = indexOfInSeries(data[key][0]);
                    if (i >= 0) {
                        status_tast.participation.series[i][0] = data[key][0];
                        status_tast.participation.series[i][1] = data[key][1];
                        status_tast.participation.series[i][2] = data[key][2];
                        status_tast.participation.series[i][3] += parseInt(data[key][3]);
                        status_tast.participation.series[i][4] += parseInt(data[key][4]);
                        status_tast.participation.series[i][5] += parseInt(data[key][5]);
                    }
                });
                $('span#year').text(y);
            }
            $('#world-container, #countries-data').trigger('_series_loaded');
        },
        error: function () {
            alert("Error");
        }
    });
}

function indexOfInSeries(country) {
    var series = status_tast.participation.series;
    for (var i = 0; i < series.length; i++) {
        if (series[i][0] == country) {
            return i;
        }
    }
    return undefined;
}

function initCountriesData() {
    initParticipationTable();
}

function getParticipationDataTable() {
    return $('#example-participation').DataTable({
        columns: [
            {
                title: 'Country'
            },
            {
                title: 'Id'
            },
            {
                title: 'Code'
            },
            {
                title: 'Embarked'
            },
            {
                title: 'Disembarked'
            },
            {
                title: 'Died'
            }],
        columnDefs: [
            {
                "targets": [1, 2],
                "visible": false,
                "searchable": false
            }
        ],
        stateSave: true,
        paging: false,
        filter: false,
        info: false
    }).page.len(50);
}

function getShipsDataTable() {
    return $('#example-ships').DataTable({
        ajax: 'php/getShips.php',
        columns: [
            {
                title: 'Shipname'
            },
            {
                title: 'Voyages'
            },
            {
                title: 'Owner'
            },
            {
                title: 'Rig'
            },
            {
                title: 'Embarked'
            },
            {
                title: 'Disembarked'
            },
            {
                title: 'Died'
            }],
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true,
        autoWidth: false
    }).page.len(50);
}

function getOwnersDataTable() {
    return $('#example-owners').DataTable({
        ajax: 'php/getOwners.php',
        columns: [
            {
                title: 'Name'
            },
            {
                title: 'Ships'
            },
            {
                title: 'Voyages'
            },
            {
                title: 'Crew'
            },
            {
                title: 'Embarked'
            },
            {
                title: 'Disembarked'
            },
            {
                title: 'Died'
            }],
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true,
    }).page.len(50);
}

function getCaptainsDataTable() {
    return $('#example-captains').DataTable({
        ajax: 'php/getCaptains.php',
        columns: [
            {
                title: 'Name'
            },
            {
                title: 'Ships'
            },
            {
                title: 'Voyages'
            },
            {
                title: 'Crew'
            },
            {
                title: 'Embarked'
            },
            {
                title: 'Disembarked'
            },
            {
                title: 'Died'
            }],
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true
    }).page.len(50);
}

function getPlacesDataTable() {
    return $('#example-places').DataTable({
        ajax: 'php/getPlaces.php',
        columns: [
            {
                title: 'Place'
            },
            {
                title: 'Region'
            },
            {
                title: 'Voyages'
            },
            {
                title: 'Embarked'
            },
            {
                title: 'Disembarked'
            },
            {
                title: 'Died'
            }],
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true
    }).page.len(50);
}

function initParticipationTable() {
    var series = status_tast.participation.series;

    status_tast.participation.datatable.clear();
    status_tast.participation.datatable.rows.add(series);
    status_tast.participation.datatable.draw();
}


function animateParticipation() {
    status_tast.participation.interval = setInterval(function () {
        var year = status_tast.participation.year;
        if (year > 1866) {
            stopParticipationAnimation();
            $('#pplay, #ppause, #prefresh').toggle();
        } else {
            getCountriesSeries(year);
            status_tast.participation.year++;
        }
    }, 2000);
}

function stopParticipationAnimation() {
    clearInterval(status_tast.participation.interval);
}

function cleanSeries() {
    index = 0;

    status_tast.participation.year = 1514;
    for (var i = 0; i < status_tast.participation.series.length; i++) {
        status_tast.participation.series[i][3] = 0;
        status_tast.participation.series[i][4] = 0;
        status_tast.participation.series[i][5] = 0;
    }
    initCountriesData();
    $('span#year').text(status_tast.participation.year);
}

function expandStoryMap() {
    $('#storymap').animate({
        width: '95%',
        zIndex: '20'
    });
}

function contractStoryMap() {
    $('#storymap').animate({
        width: '70%',
        zIndex: '10'
    });
}



function initCharts() {
    centerTitle('#charts .frontpage');
    
    $(window).on('resize', function() {
        centerTitle('#charts .frontpage');
    });
    
    $.ajax({
        url: 'php/allByYear.php',
        dataType: 'json',
        success: function (data) {
            initChart(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus);
        }
    });
}

function initChart(json) {
    var datasets = {
        labels: [],
        voyages: [],
        ships: [],
        embarked: [],
        disembarked: [],
        died: []
    };

    $.each(json, function (key, value) {
        datasets.labels[key] = value.year;
        datasets.voyages[key] = value.voyages;
        datasets.ships[key] = value.ships;
        datasets.embarked[key] = value.embarked;
        datasets.disembarked[key] = value.disembarked;
        datasets.died[key] = value.died;
    });

    createChart(datasets);
}

function createChart(datasets) {
    var ctxVoyages = document.getElementById('cvoyages').getContext("2d");
    var ctxShips = document.getElementById('cships').getContext("2d");
    var ctxSlaves = document.getElementById('cslaves').getContext("2d");
    var ctxSlavesDied = document.getElementById('cdied').getContext("2d");

    var chartVoyages = new Chart(ctxVoyages, {
        type: 'bar',
        data: {
            labels: datasets.labels,
            datasets: [
                {
                    label: 'Voyages per Year',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: .5,
                    data: datasets.voyages
                }
            ]
        },
        options: {}
    });
    var chartShips = new Chart(ctxShips, {
        type: 'bar',
        data: {
            labels: datasets.labels,
            datasets: [
                {
                    label: 'Ships per Year',
                    backgroundColor: 'rgb(99, 255, 132)',
                    borderColor: 'rgb(99, 255, 132)',
                    borderWidth: .5,
                    data: datasets.ships
                },
            ]
        },
        options: {}
    });
    var chartSlaves = new Chart(ctxSlaves, {
        type: 'bar',
        data: {
            labels: datasets.labels,
            datasets: [
                {
                    label: 'Embarked per Year',
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    borderWidth: .5,
                    data: datasets.embarked
                },
                {
                    label: 'Disembarked per Year',
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: .5,
                    data: datasets.disembarked
                }
            ]
        },
        options: {}
    });
    var chartSlavesDied = new Chart(ctxSlavesDied, {
        type: 'bar',
        data: {
            labels: datasets.labels,
            datasets: [
                {
                    label: 'Yearly Deaths during Middle Passage',
                    backgroundColor: 'yellow',
                    borderColor: 'black',
                    borderWidth: .5,
                    data: datasets.died
                }
            ]
        },
        options: {}
    });
}

function runYearlySimulation() {
    cleanupStatus();
    interval = setInterval(updateYearly, 100);
}

function cleanupStatus() {
    $('#voyages p.counter').text(0);
    $('#ships p.counter').text(0);
    $('#period p.counter').text('1562 ~ 1562');
    $('#emb p.counter').text(0);
    $('#desemb p.counter').text(0);
}

function updateYearly() {
    if (year <= 1864) {
        updateDataForYear();
    } else {
        clearInterval(interval);
    }
}

function updateDataForYear() {
    $.ajax({
        url: "assets/php/upToYear.php",
        type: "POST",
        dataType: "json",
        data: {
            year: year
        },
        success: function (data) {
            updateStatus(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });

    year++;
}

function updateStatus(data) {
    updateCounter($('#voyages p.counter'), data.voyages);
    updateCounter($('#ships p.counter'), data.ships);
    updateCounter($('#period p.counter'), '1562 ~ ' + data.year);
    updateCounter($('#emb p.counter'), data.emb);
    updateCounter($('#desemb p.counter'), data.desemb);
}

function updateCounter($element, value) {
    $element.text(value);
}

function initStats() {
    var period = $('#period').text();
    var dates = period.split(' ~ ');
    var start = parseInt(dates[0]);
    var end = parseInt(dates[1]);

    var totalYears = end - start + 1;

    addAverage($('#voyages'), totalYears, 'Voyages/Year');
    addAverage($('#ships'), totalYears, 'Ships/Year');
    addAverage($('#emb'), totalYears, 'Embarked/Year');
    addAverage($('#desemb'), totalYears, 'Embarked/Year');

    //$averages.appendTo($summary);
}

function addAverage($element, years, label) {
    var total = parseInt($element.text());
    var vAvg = Math.ceil(total / years);
    $element.append($('<p class="counter"></p>').text(vAvg).css({
        color: "pink",
        paddingTop: "1em"
    }));
    $element.append($('<p class="counter-label"></p>').text(label));
}



function initTabs() {
    $('#nav-tab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust();
    });

    getPlacesDataTable();
    getShipsDataTable();
    getOwnersDataTable();
    getCaptainsDataTable();
    started.database = true;
    centerTitle('#database .frontpage');    
    $(window).on('resize', function() {
        centerTitle('#database .frontpage');
    });
}


function initArticles() {
    loadLatestArticles();
    started.articles = true;
    centerTitle('#articles .frontpage');

    var params = getSearchParameters();

    if (params.articleid != null) {
        loadArticle(params.articleid);
    }
    
    $(window).on('resize', function() {
        centerTitle('#articles .frontpage');
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
    $('#latest-articles').empty();
    $.ajax({
        url: 'php/getLatestArticles.php',
        success: function (data) {
            $.each(data, function (key, value) {
                var $article = createArticle(data[0]);
                $('#latest-articles').append($article);
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
    
    
function initAboutUs() {
    
}

function initContribute() {

}
