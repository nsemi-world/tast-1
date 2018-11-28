var status_tast = {
    participation: {
        year: 1514,
        series: [],
        animationStarted: false,
        interval: null,
        datamap: null,
        datatable: null
    }
};

var started = {
    participation: false
};


$(document).ready(function () {
    initParticipation();
    activate($('#toggle_participation'));
});

/*function centerParticipation() {
    $('#participation .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#participation .title-wrapper'
    });
}*/

function initParticipation() {

    loadSectionImage('#participation .frontpage', 'participation.jpg');
    loadTimelinesData();

    $(document).on('_data_loaded', function(event, data) {
        updateTotalVoyages(data);
        updateFirstVoyageDate(data);
        updateLastVoyageDate(data);
        updateCountriesList(data);
        updateTimelines(data);
    });
    
    $('#world-container').on('_series_loaded', function (event) {
        initParticipationMap();

    });
    $('#countries-data').on('_series_loaded', function (event) {
        initCountriesData();
    });

    $(window).on('resize', function () {
        debounce('#participation .frontpage', 'participation.jpg');
    });

    started.participation = true;
    status_tast.participation.datatable = getParticipationDataTable();
    configureParticipationPlayer();
    configureParticipationAppearence();
    getCountriesSeries(0);
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
        setProjection: function(element, options) {
            var projection, path;
            projection = d3.geo.mercator()
                .center([0, 30])
                .scale(element.offsetWidth/4)
                .translate([element.offsetWidth/2, element.offsetHeight/2]);
            path = d3.geo.path().projection(projection);
            return {path: path, projection: projection};
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


function getFirstTimeline() {
    return $('#first-voyage-timeline');
}

function getLastTimeline() {
    return $('#last-voyage-timeline');
}

function loadTimelinesData() {
    $.ajax({
        url: 'php/participation.json',
        success: function(data) {
            console.log(data);
            $(document).trigger('_data_loaded', [data]);
        },
        error: function() {
            alert('Error while fetching timelines data. Sorry for the inconvenience. An issue is being created. Please come back later.');
        }
    });
}

function updateTotalVoyages(data) {
    $('#TOTAL_VOYAGES').text(data.total_voyages);
}

function updateFirstVoyageDate(data) {
    $('#FIRST_VOYAGE_DATE').text(data.first_voyage_date);
}

function updateLastVoyageDate(data) {
    $('#LAST_VOYAGE_DATE').text(data.last_voyage_date);
}

function updateCountriesList(data) {
    $('#LIST_OF_COUNTRIES').html(countriesToHtmlList(data.countries));
}

function getCountriesNames(data) {
    $.each(data.countries, function(){
        
    });
}

function updateTimelines(data) {
    //$('#participation-timeline').accordion();
    updateFirstTimeline(data.countries);
    updateLastTimeline(data.countries);
}

function updateFirstTimeline(countriesData) {
    var sorted = countriesData.sort(compareFirst);
    
    var $timeline = $('#FIRST_VOYAGE_TIMELINE');
    
    var $line = $('<div class="position-relative rounded"></div>')
        .css({
            height:'4px', 
            width:'100%', 
            background:'white'
        });
    
    $timeline.append($line);
    
    $.each(sorted, function(key, value){
        addNodeToLine($line, value.first_voyage, value.label, value.iso2);
    });
}

function updateLastTimeline(countriesData) {
    var sorted = countriesData.sort(compareFirst);
    
    var $timeline = $('#LAST_VOYAGE_TIMELINE');
    
    var $line = $('<div class="position-relative rounded"></div>')
        .css({
            height:'4px', 
            width:'100%', 
            background:'white'
        });
    
    $timeline.append($line);
    
    $.each(sorted, function(key, value){
        addNodeToLine($line, value.last_voyage, value.label, value.iso2);
    });
}

function compareFirst(a,b) {
  if (a.first_voyage< b.first_voyage)
    return -1;
  if (a.first_voyage > b.first_voyage)
    return 1;
  return 0;
}

function compareLast(a,b) {
  if (a.last_voyage< b.last_voyage)
    return -1;
  if (a.last_voyage > b.last_voyage)
    return 1;
  return 0;
}

function countriesToHtmlList(countries) {
    var ul = '<div class="card-columns">';
    $.each(countries, function(){
        var country = $(this);
        var li = '<div class="text-truncate">' + country[0].label + '</div>';
        ul += li;
    });
    
    ul += '</div>';
    return ul;
}



function addNodeToLine($line, date, name, iso2) {
    var min = 1510;
    var max = 1870;
    var node = $('<span class="circle"></span>')
        .addClass('flag flag-' + iso2.toLowerCase())
        .attr('title', date + ': ' + name)
        .css({
            position: 'absolute',
            left: '' + getLeftForDate($line.width(), min, max, date) + 'px',
            top: '-=15px',
            zIndex: '1000'
        })
        .toggle({effect: 'scale', percent: 50});

    $line.append(node);
}

function getLeftForDate(maxWidth, min, max, date) {
    return (maxWidth * ((date-min)/(max-min)))-16;    
}