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
var currentSection = null;

$(document).ready(function () {
    initializeApp();
});

function initializeApp() {
    status_tast.participation.datatable = getParticipationDataTable();
    status_tast.ships.datatable = getShipsDataTable();
    status_tast.owners.datatable = getOwnersDataTable();
    status_tast.captains.datatable = getCaptainsDataTable();
    status_tast.places.datatable = getPlacesDataTable();

    initMenu();
    initHome();
    initParticipation();
    initVoyages();
    initCharts();
    initTabs();
    $('#toggle_home').click();

    //$(document).on('scroll', onScroll);

}

function onScroll(event) {
    var headerHeight = $('header').height();
    var scrollPosition = $(document).scrollTop() + screen.height / 2;
    $('#menu a').each(function () {
        var currentLink = $(this);
        var refElement = $(currentLink.attr("href"));
        var height = refElement.height();

        var top = refElement.position().top;
        var bottom = refElement.position().top + height;


        if (top <= scrollPosition && bottom > scrollPosition) {
            activate(currentLink);
        }
    });
}

function initMenu() {
    $('#toggle_home').on('click', function (event) {
        event.preventDefault();
        enter('#home');
        activate($(this));
    });
    $('#toggle_citation').on('click', function (event) {
        event.preventDefault();
        enter('#citation');
        activate($(this));
    });
    $('#toggle_map').on('click', function (event) {
        event.preventDefault();
        enter('#voyages');
        activate($(this));
    });
    $('#toggle_participation').on('click', function (event) {
        event.preventDefault();
        enter('#participation');
        activate($(this));
    });
    $('#toggle_charts').on('click', function (event) {
        event.preventDefault();
        enter('#charts');
        activate($(this));
    });
    $('#toggle_database').on('click', function (event) {
        event.preventDefault();
        enter('#database');
        activate($(this));
    });
    $('#toggle_contact').on('click', function (event) {
        event.preventDefault();
        enter('#contacts');
        activate($(this));
    });
    $('#toggle_about_us').on('click', function (event) {
        event.preventDefault();
        enter('#about-us');
        activate($(this));
    });
    $('#toggle_impressum').on('click', function (event) {
        event.preventDefault();
        enter('#impressum');
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
            if(status_tast.voyages.storymap != null) {
                status_tast.voyages.storymap.updateDisplay();
            }
            break;
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
    getCitation();
    centerHome();

    $('#citation').on('_citation_loaded', function (event, data) {
        addCitation(data);
        getAffiliateLinks('author', data.author);
    });
    $('#citation .books').on('_affiliated_loaded', function (event, data) {
        addAffiliateLinks(data);
    });
}

function centerHome() {
    centerTitle();
}

function centerTitle() {
    $('#message .title').position({
        my: 'center',
        at: 'center',
        of: '#message'
    });
}

function centerCitation() {
    $('.ccontainer').position({
        my: 'center',
        at: 'center',
        of: '#citation'
    });
}

function getCitation() {
    $.ajax({
        url: 'php/getCitation.php',
        success: function (data) {
            $('#citation').trigger('_citation_loaded', [data]);
        }
    });
}

function addCitation(data) {
    $('.quote').html('<p>\"' + data.quote + '\"</p>');
    var $authorLink = $('<a></a>')
        .attr('href', data.reference)
        .attr('title', data.refenrence)
        .attr('target', '_blank')
        .text(data.author);

    $('.author').append($authorLink);
}

function getAffiliateLinks(keyword, value) {
    $.ajax({
        url: 'php/getAffiliateLinks.php',
        data: {
            keyword: keyword,
            value: value
        },
        success: function (data) {
            $('#citation .books').trigger('_affiliated_loaded', [data]);
        },
        error: function (data) {
            alert('Error: home.js#getAffiliatedLinks()');
        }
    });
}

function addAffiliateLinks(links) {
    $.each(links, function (key, value) {
        var $figure = $('<img class="m-0 p-0 mr-2"></img>');
        $figure.attr('src', value.image);
        $figure.attr('title', value.title);
        $('.books').append($figure);
    });
    centerCitation();
}


function initVoyages() {
    configureVoyagesPlayer();
    loadVoyageIds();

    $('#voyages').on('_ids_loaded', function (event) {
        loadVoyageData(0);
    });

    $('#voyages').on('_request_voyage_data', function (event, index) {
        loadVoyageData(index);
    });

    $('#voyages').on('_voyage_loaded', function (event, data, index) {
        createStoryMap(data, status_tast.voyages.ids[index]);
        status_tast.voyages.storymap.updateDisplay();
        initData(data, index);
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
            console.log(result);
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

    window.onresize = function (event) {
        status_tast.voyages.storymap.updateDisplay(); // this isn't automatic
    }

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
        .append($('<hr/>'))
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
        .append($('<hr/>'))
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

    var $slaves = $('<div class="slaves"></div>');

    $slaves.appendTo('#details')
        .append($embarked)
        .append($disembarked)
        .append($died);
}

function createElement(id, key, value) {
    var $key = $('<div class="key col-sm-4"></div>').text(key);
    var $value = $('<div class="value col-sm-8"></div>').html(value || '--');
    var $element = $('<div class="row p-1"></div>').attr('id', id);

    $element.append($key).append($value);

    return $element;
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
            console.log(v);
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
            console.log('CurrentOwner = ' + v);
            owners.push('<a href="owner" class="filter">' + v + '</a>');
        });
        return owners.join(" | ");
    }
}

function getVoyageCaptains(data) {
    if (data) {
        var captains = [];
        $.each(data.details.captains, function (i, v) {
            console.log('CurrentCaptain = ' + v);
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
    configureParticipationPlayer();
    configureParticipationAppearence();
    getCountriesSeries(0);
    $('#world-container').on('_series_loaded', function (event) {
        initParticipationMap();

    });
    $('#countries-data').on('_series_loaded', function (event) {
        initCountriesData();
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
        setProjection: function (element) {
            var projection = d3.geo.equirectangular()
                .center([0, 0])
                .rotate([10, -40])
                .scale(200)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);

            return {
                path: path,
                projection: projection
            };
        },
        //projection: 'equirectangular', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: fills,
        data: dataset,
        geographyConfig: {
            borderColor: 'pink',
            background: 'white',
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

function radius(value) {
    return 2 + value / 25000;
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
                $('p#year').text(y);
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
        console.log(country);
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
        paging: false,
        filter: false,
        info: true,
        autoWidth: false,
        deferRender: true,
        columnDefs: [
            {
                "targets": [1, 2],
                "visible": false,
                "searchable": false
            }
            ]
    });
}

function getShipsDataTable() {
    return $('#example-ships').DataTable({
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
        paging: false,
        filter: true,
        info: true,
        scrollY: '400px',
        scrollCollapse: true,
        deferRender: true
    });
}

function getOwnersDataTable() {
    return $('#example-owners').DataTable({
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
        paging: false,
        filter: true,
        info: true,
        scrollY: '400px',
        scrollCollapse: true,
        deferRender: true
    });
}

function getCaptainsDataTable() {
    return $('#example-captains').DataTable({
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
        paging: false,
        filter: true,
        info: true,
        scrollY: '400px',
        scrollCollapse: true,
        deferRender: true
    });
}

function getPlacesDataTable() {
    return $('#example-places').DataTable({
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
        paging: false,
        filter: true,
        info: true,
        scrollY: '400px',
        scrollCollapse: true,
        deferRender: true
    });
}

function initParticipationTable() {
    var series = status_tast.participation.series;

    status_tast.participation.datatable.clear();
    status_tast.participation.datatable.rows.add(series);
    status_tast.participation.datatable.draw();
}

function initShipsTable() {
    var series = status_tast.ships.series;

    status_tast.ships.datatable.clear();
    status_tast.ships.datatable.rows.add(series);
    status_tast.ships.datatable.draw();
}

function initOwnersTable() {
    var series = status_tast.owners.series;
    status_tast.owners.datatable.clear();
    status_tast.owners.datatable.rows.add(series);
    status_tast.owners.datatable.draw();
}

function initCaptainsTable() {
    var series = status_tast.captains.series;
    status_tast.captains.datatable.clear();
    status_tast.captains.datatable.rows.add(series);
    status_tast.captains.datatable.draw();
}

function initPlacesTable() {
    var series = status_tast.places.series;
    status_tast.places.datatable.clear();
    status_tast.places.datatable.rows.add(series);
    status_tast.places.datatable.draw();
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
    $('p#year').text(status_tast.participation.year);
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
    $.ajax({
        url: 'php/allByYear.php',
        dataType: 'json',
        success: function (data) {
            initChart(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
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
                    backgroundColor: 'black',
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
    initShips();
    initOwners();
    initCaptains();
    initPlaces();
    $('#nav-tab a[href~="#ships"]').on('click', function (e) {
        e.preventDefault();
        if (!status_tast.ships.started) {
            getShips();
            status_tast.ships.started = true;
        }
        $(this).tab('show');
    });
    $('#nav-tab a[href~="#owners"]').on('click', function (e) {
        e.preventDefault();
        if (!status_tast.owners.started) {
            getOwners();
            status_tast.owners.started = true;
        }
        $(this).tab('show');
    });
    $('#nav-tab a[href~="#captains"]').on('click', function (e) {
        e.preventDefault();
        if (!status_tast.captains.started) {
            getCaptains();
            status_tast.captains.started = true;
        }
        $(this).tab('show');
    });
    $('#nav-tab a[href~="#places"]').on('click', function (e) {
        e.preventDefault();
        if (!status_tast.places.started) {
            getPlaces();
            status_tast.places.started = true;
        }
        $(this).tab('show');
    });
    $('#nav-tab a[href~="#places"]').click();
}

function initOwners() {
    $('div#owners').on('_owners_loaded', function (event, data) {
        status_tast.owners.series = data;
        initOwnersTable();
    });
}

function initCaptains() {
    $('div#captains').on('_captains_loaded', function (event, data) {
        status_tast.captains.series = data;
        initCaptainsTable();
    });
}

function initShips() {
    $('div#ships').on('_ships_loaded', function (event, data) {
        status_tast.ships.series = data;
        initShipsTable();
    });
}

function initPlaces() {
    $('div#places').on('_places_loaded', function (event, data) {
        status_tast.places.series = data;
        initPlacesTable();
    });
}

function getOwners() {
    $.ajax({
        url: 'php/getOwners.php',
        success: function (data) {
            $('div#owners').trigger('_owners_loaded', [data]);
        },
        error: function () {
            alert('Error VoyageOwners#getOwners()');
        }
    });
}

function getCaptains() {
    $.ajax({
        url: 'php/getCaptains.php',
        success: function (data) {
            $('div#captains').trigger('_captains_loaded', [data]);
        },
        error: function () {
            alert('Error VoyageCaptains#getCaptains()');
        }
    });
}

function getShips() {
    $.ajax({
        url: 'php/getShips.php',
        success: function (data) {
            $('div#ships').trigger('_ships_loaded', [data]);
        },
        error: function () {
            alert('Error VoyageShips#getShips()');
        }
    });
}

function getPlaces() {
    var url = 'php/getPlaces.php';
    $.ajax({
        url: url,
        success: function (result) {
            $('div#places').trigger('_places_loaded', [result]);
        },
        error: function () {
            alert("SHOW_PLACES_ERROR");
        }
    });
}
