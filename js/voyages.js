
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

function centerVoyages() {
    $('#voyages .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#voyages .title-wrapper'
    });
}

