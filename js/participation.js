var participationViewer = null;
var participationData = null;

$(document).ready(function () {
    activate($('#toggle_participation'));

    onParticipation();

    loadSectionImage('#participation .frontpage', 'participation.jpg');
    loadParticipationData();
});

function getFirstTimeline() {
    return $('#first-voyage-timeline');
}

function getLastTimeline() {
    return $('#last-voyage-timeline');
}

function getIntroduction() {
    return $('#introduction');
}

function onParticipation() {
    $(document).on('_data_loaded', function (event, pdata) {
        var data = pdata['all'];
        updateTotalVoyages(data);
        updateFirstVoyageDate(data);
        updateLastVoyageDate(data);
        updateParticipationPeriod(data);
        updateChallenge(data);
        updateNumbersTable(data);
        createPlayer();
        createParticipationDashboard(pdata, 1866);
    });

    $(window).on('resize', function () {
        debounce('#participation .frontpage', 'participation.jpg');
        resizeAll();
    });
    
    $('#earliest').on('click', function(event){
        event.preventDefault();
        $('#start-timeline').toggleClass('d-none');
    });
    $('#latest').on('click', function(event){
        event.preventDefault();
        $('#end-timeline').toggleClass('d-none');
    });
}

function resizeAll() {}

function loadParticipationData() {
    $.ajax({
        url: 'php/participation.json',
        success: function (data) {
            participationData = data;
            $(document).trigger('_data_loaded', [data]);
        },
        error: function () {
            alert('Error while fetching timelines data. Sorry for the inconvenience. An issue is being created. Please come back later.');
        }
    });
}

function getCountriesSeries(y) {
    updatePlayerYear(y);
    updateParticipationDashboard(participationData['period'][y - 1514]);
}

function getCountriesSeriesFromServer(y) {
    var url = 'php/getParticipationData.php';

    $.ajax({
        url: url,
        data: {
            year: y
        },
        success: function (data) {
            $(document).trigger('_series_loaded', [data[1]]);
        },
        error: function () {
            alert("Error");
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


function updateChallenge(data) {
    updateTimeline(data.countries, 0);
    updateTimeline(data.countries, 1);
}

function updateTimeline(data, timelineId) {
    if (timelineId == 0) {
        var sorted = data.sort(compareFirst);

        $.each(sorted, function (key, value) {
            addLineToDroppables($('#start-droppables .lines'), value.fdate, value.name, value.iso2, key);
        });

        var shuffled = shuffle(data);
        $.each(shuffled, function (key, value) {
            addNodeToDraggables($('#start-draggables'), value.fdate, value.name, value.iso2);
        });
    } else {
        var sorted = data.sort(compareLast);
        $.each(data, function (key, value) {
            addLineToDroppables($('#end-droppables .lines'), value.ldate, value.name, value.iso2, key);
        });
        var shuffled = shuffle(data);
        $.each(shuffled, function (key, value) {
            addNodeToDraggables($('#end-draggables'), value.fdate, value.name, value.iso2);
        });
    }

}

function getPhase(fdate) {
    if (fdate <= 1550) {
        return '#iberian-timeline';
    } else if (fdate <= 1600) {
        return '#west-timeline';
    } else if (fdate <= 1700) {
        return '#european-timeline';
    } else {
        return '#atlantic-timeline';
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function compareFirst(a, b) {
    if (a.fdate < b.fdate)
        return -1;
    if (a.fdate > b.fdate)
        return 1;
    return 0;
}

function compareLast(a, b) {
    if (a.ldate < b.ldate)
        return -1;
    if (a.ldate > b.ldate)
        return 1;
    return 0;
}

function countriesToHtmlList(countries) {
    var ul = '<div class="card-columns">';
    $.each(countries, function () {
        var country = $(this);
        var li = '<div class="text-truncate">' + country[0].name + '</div>';
        ul += li;
    });

    ul += '</div>';
    return ul;
}

/*
 */
function addNodeToDraggables($draggables, date, name, iso2) {
    var min = 1510;
    var max = 1870;

    var $flag = $('<div><div>')
        .addClass('flag flag-' + iso2.toLowerCase())
        .css({
            height: '32px'
        });


    var $name = $('<div></div>')
        .text(name)
        .addClass('media-body text-truncate')
        .css({
            height: '32px'
        });

    var $node = $('<div></div>')
        .addClass('draggable media mr-2')
        .attr('title', name)
        .data('country', name)
        .append($flag)
        .append($name)
        .css({
            height: '32px',
            zIndex: '1000'
        });

    $draggables.append($node);


    $flag.position({
        my: 'left center',
        at: 'left center',
        of: $node
    });
    $name.position({
        my: 'left center',
        at: 'right+2 center',
        of: $flag
    });



    $node.draggable({
        revert: 'invalid'
    });


}

function addLineToDroppables($droppables, date, name, iso2, i) {
    var min = 1514;
    var max = 1866;

    var timelineId = $droppables.parent().attr('id');

    var $date = $('<span class="date"></span>')
        .text(date)
        .addClass('pr-1');

    var $timeline = $('<span class="line"></span>')
        .addClass('rounded border-right border-danger shadow');

    var $line = $('<div></div>')
        .addClass('droppable border-bottom border-secondary mt-2 w-100')
        .attr('title', date)
        .data('country', name)
        .append($date)
        .append($timeline)
        .css({
            height: '32px',
            position: 'relative'
        });


    $droppables.addClass('position-relative').append($line);
    var dateWidth = getRelativePositionForDate($line.innerWidth(), min, max, date) + '%';

    $timeline.css({
        position: 'absolute',
        height: '24px',
        top: '0',
        left: '32px',
        width: dateWidth
    });

    $line.droppable({
        accepts: timelineId + ' .draggable',
        tolerance: "pointer",
        classes: {
            "ui-droppable-active": "border border-secondary",
            "ui-droppable-hover": "border border-primary"
        },
        drop: function (event, ui) {
            var $draggable = ui.draggable;
            var $droppable = $(this);

            if ($draggable.data('country') == $droppable.data('country')) {
                $draggable.draggable("option", "revert", false);
                $draggable.draggable("disable");
                $draggable.position({
                    my: 'left',
                    at: 'left+64',
                    of: $droppable.find('.line')
                }).addClass('text-light');

                $droppable.addClass('done');
                $droppable.droppable("disable");
                $droppable.find('.line').animate({
                        backgroundColor: getColorForDate($droppable.attr('title'), timelineId),
                }, 1000);
                $droppable.find('.date').addClass('text-light');
                
                
                $(document).on('resize', function () {
                    $draggable.position({
                        my: 'left',
                        at: 'left+64',
                        of: $droppable.find('span.date')
                    });
                });

                if ($droppables.find('.done').length == 17) {
                    alert('Done');
                }
                
            } else {
                $draggable.draggable("option", "revert", true);
            }
        }
    });
}

function getRelativePositionForDate(maxWidth, min, max, date) {
    var result = 100 * (date - min) / (max - min);
    return result;
}

function getColorForDate(date) {
    return 'rgba(255, 0, 0,' + (1 - (date - 1514) / (1866 - 1514)) + ')';
}


function updateParticipationPeriod(data) {
    $('#participation-period-table').DataTable({
        data: data.countries.map(function (obj) {
            return [obj.name, obj.fdate, obj.ldate, (parseInt(obj.ldate) - parseInt(obj.fdate) + 1)];
        }),
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'asc']],
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        responsive: false,
        fixedColumns: true

    });
}


function updateNumbersTable(data) {
    $('#numbers-table').DataTable({
        data: data.countries.map(function (obj) {
            return [obj.name, obj.nvoyages, obj.nships, obj.embarked, obj.disembarked, obj.died];
        }),
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'desc']],
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        responsive: false,
        fixedColumns: true

    });
}

function createParticipationDashboard(data, year) {
    createMaps(data, year);
    createCharts(data, year);
}
function updateParticipationDashboard(data, year) {
    updateMaps(data, year);
    updateCharts(data, year);
}

function createMaps(data, year) {
    durationMap = createMap('#duration-map', data['period'][year-1514].countries, 'Duration');
    voyagesMap = createMap('#voyages-map', data['period'][year-1514].countries, '#Voyages');
    shipsMap = createMap('#ships-map', data['period'][year-1514].countries, '#Ships');
    embarkedMap = createMap('#embarked-map', data['period'][year-1514].countries, '#Embarked');
    disembarkedMap = createMap('#disembarked-map', data['period'][year-1514].countries, '#Disembarked');
    diedMap = createMap('#died-map', data['period'][year-1514].countries, '#Died');
}

function updateMaps(data, year) {
    durationMap= updateMap('#duration-map', data.countries, 'Duration');
    voyagesMap = updateMap('#voyages-map', data.countries, '#Voyages');
    shipsMap = updateMap('#ships-map', data.countries, '#Ships');
    embarkedMap = updateMap('#embarked-map', data.countries, '#Embarked');
    disembarkedMap = updateMap('#disembarked-map', data.countries, '#Disembarked');
    diedMap = updateMap('#died-map', data.countries, '#Died');
}

function createCharts(data, year) {
    durationChart = createChart('#duration-chart', data['period'][year-1514].countries, 'Duration');
    voyagesChart = createChart('#voyages-chart', data['period'][year-1514].countries, '#Voyages');
    shipsChart = createChart('#ships-chart', data['period'][year-1514].countries, '#Ships');
    embarkedChart = createChart('#embarked-chart', data['period'][year-1514].countries, '#Embarked');
    disembarkedChart = createChart('#disembarked-chart', data['period'][year-1514].countries, '#Disembarked');
    diedChart = createChart('#died-chart', data['period'][year-1514].countries, '#Died');
}
function updateCharts(data, year) {
    updateChart(durationChart, data.countries, 'Duration');
    updateChart(voyagesChart, data.countries, '#Voyages');
    updateChart(shipsChart, data.countries, '#Ships');
    updateChart(embarkedChart, data.countries, '#Embarked');
    updateChart(disembarkedChart, data.countries, '#Disembarked');
    updateChart(diedChart, data.countries, '#Died');
}

function createMap(selector, series, criteria) {
    var dataset = getDataset(series, criteria);
    var fills = getFills();
    var template = getTemplate();
    var bubbles = getBubbles(series);
    var bubblesTemplate = getBubblesTemplate();
    return getDataMap(selector, dataset, fills, template, bubbles, bubblesTemplate);
}

function updateMap(selector, series, criteria) {
    $(selector).empty();
    var dataset = getDataset(series, criteria);
    var fills = getFills();
    var template = getTemplate();
    var bubbles = getBubbles(series);
    var bubblesTemplate = getBubblesTemplate();
    return getDataMap(selector, dataset, fills, template, bubbles, bubblesTemplate);
}

function getDataset(series, criteria) {
    var dataset = {};
    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    
    var onlyValues = series.map(function (obj) {
        return getObjectValue(obj, criteria);
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
        .domain([0, maxValue])
        .range(getCriteriaRange(criteria)); // blue color
        //.interpolator(d3.interpolateRainbow);

    // fill dataset in appropriate format
    series.forEach(function (item) { //
        // item example value ["USA", 70]
        var iso = item.iso3;
        var value = getObjectValue(item, criteria);
        dataset[iso] = {
            numberOfThings: value,
            fillColor: paletteScale(value)
        };
    });
    
    return dataset;
}

function getCriteriaRange(criteria) {
    
    if(criteria=='#Embarked') {
        return ["rgba(255,0,0,.1)", "rgba(255,0,0,1)"];
    } else if(criteria == '#Disembarked') {
        return ["rgba(255,255,0,.1)", "rgba(255,255,0,1)"];
    } else if(criteria == '#Died') {
        return ["rgba(255,0,255,.1)", "rgba(255,0,255,1)"];
    } else if(criteria == '#Voyages') {
        return ["rgba(0,0,255,.1)", "rgba(0,0,255,1)"];
    } else if(criteria=='Duration') {
        return ["rgba(200,100,0,.1)", "rgba(200,100,0,1)"];
    } else if(criteria=='#Ships') {
        return ["rgba(200,100,200,.1)", "rgba(200,100,200,1)"];
    }
    else return undefined; 
}

function getObjectValue(obj, criteria) {
    if(criteria=='#Embarked') {
        return obj.embarked;
    } else if(criteria == '#Disembarked') {
        return obj.disembarked;            
    } else if(criteria == '#Died') {
        return obj.died;            
    } else if(criteria == '#Voyages') {
        return obj.nvoyages;            
    } else if(criteria == 'Duration') {
        return obj.ldate - obj.fdate + 1;            
    } else if(criteria == '#Ships') {
        return obj.nships;            
    }
    else return undefined; 
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
        defaultFill: 'transparent'
    }
}

function getTemplate() {
    return (
        function (geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data || data.numberOfThings == 0) {
                return;
            }
            // tooltip content
            return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings.toLocaleString('en'), '</strong>',
                    '</div>'].join('');
        }
    );
};

/*
    A = PI * r^2
    r = SQRT(A/PI)
*/
function getBubbles(series) {
    var bubbles = [];
    var i = 0;

    $.each(series, function (key, value) {
        if (value.iso3 != '') {
            bubbles[i++] = {
                centered: value.iso3,
                country: value.name,
                fillKey: value.iso3,
                radius: Math.sqrt(value.embarked / Math.PI) / 10,
                embarked: value.embarked,
                disembarked: value.disembarked,
                died: value.died,
                borderColor: 'gray'
            }
        }
    });
    return bubbles;
};

function getBubblesTemplate() {
    return (
        function (geo, data) {
            return '<div class="hoverinfo">Country:' + data.country + '<hr>Embarked: ' + data.embarked + '</br>Disembarked: ' + data.disembarked + '</br>Died: ' + data.died + '';
        });
}

function updateDatamapBubbles(series) {
    $.each(series, function (key, value) {
        if (value.iso3 != '') {
            updateCircle(value);
        }
    });
};

function updateCircle(value) {
    var circles = document.getElementsByTagName('circle');
    //alert(circles.length);
    $.each(circles, function(key, circle) {
        if(circle.getAttribute('data-info').centered == value.iso3) {
           circle.setAttribute('r', Math.sqrt(value.embarked / Math.PI) / 10); 
        }
    });
}

function getCountriesSeriesMax(series) {
    var max = 0;
    for (var i = 0; i < series.length; i++) {
        if (series[i][3] > max) {
            max = series[i][3];
        }
    }
    return max;
};

function height(value, series) {
    var max = series[0][3];
    var maxHeight = 500;
    return value * maxHeight / max;
};

function getDataMap(selector, dataset, fills, template, bubbles, bubblesTemplate) {
    var options = getOptions(selector, dataset, fills, template);
    var map = new Datamap(options);
    map.graticule();
    return map;
}

function getOptions(selector, dataset, fills, template) {
    var mapViewId = selector.replace('#', '');
    var options = {
        element: document.getElementById(mapViewId),
        responsive: true,
        fills: fills,
        data: dataset,
        geographyConfig: {
            borderColor: 'gray',
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
    };

    return options;
}



function createChart(selector, data, criteria) {
    var datasets = getChartData(data, criteria);

    var onlyValues = data.map(function (obj) {
        return getObjectValue(obj, criteria);
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);
    
    var chart = $(selector).empty();
    var mychart = new Chart(chart, {
        type: 'bar',
        data: {
            labels: data.map(function (obj) {
                return obj.iso2;
            }),
            datasets: datasets
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        labels: data.map(function (obj) {
                            return obj.name;
                        })
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: maxValue
                    }
                }]
            }
        }
    });
    
    return mychart;
}

function getChartData(data, criteria) {
    var data = data.sort(getCompareFunction(criteria));    

    if (criteria == '#Embarked') {
        return [{
            label: '#Embarked',
            data: data.map(function (obj) {
                return obj.embarked;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    } 
    else if (criteria == '#Disembarked') {
        return [{
            label: '#Disembarked',
            data: data.map(function (obj) {
                return obj.disembarked;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    } 
    else if (criteria == '#Died') {
        return [{
            label: '#Died',
            data: data.map(function (obj) {
                return obj.died;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    } 
    else if (criteria == '#Voyages') {
        return [{
            label: '#Voyages',
            data: data.map(function (obj) {
                return obj.nvoyages;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    } 
    else if (criteria == 'Duration') {
        return [{
            label: 'Duration (years)',
            data: data.map(function (obj) {
                return getPlayerYearValue() - obj.fdate + 1;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    }
    else if (criteria == '#Ships') {
        return [{
            label: 'Number of Ships',
            data: data.map(function (obj) {
                return obj.nships;
            }),
            backgroundColor: getCriteriaRange(criteria)[1]
        }];
    }
    else return undefined;

}



function updateChart(chart, data, criteria) {
    var cdata = data.sort(compareDesc);
    var datasets = getChartData(cdata, criteria);
    
    var onlyValues = data.map(function (obj) {
        return getObjectValue(obj, criteria);
    });

    var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

    chart.data = {
        labels: cdata.map(function (obj) {
            return obj.iso2;
        }),
        datasets: datasets,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        labels: data.map(function (obj) {
                            return obj.iso2;
                        })
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: maxValue
                    }
                }]
            }
        }
    };

    chart.update(0);

}

function compareDesc2(a, b) {
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    } else {
        return 0;
    }
}

function compareDesc(a, b) {
    if (parseInt(a) < parseInt(b)) {
        return 1;
    } else if (parseInt(a) > parseInt(b)) {
        return -1;
    } else {
        return 0;
    }
}

function getCompareFunction(criteria) {
    if (criteria == '#Embarked') {
        return function(a,b) {compareDesc(a.embarked, b.embarked)};
    } else if (criteria == '#Disembarked') {
        return function(a,b) {compareDesc(a.disembarked, b.disembarked)};
    } else if (criteria == '#Died') {
        return function(a,b) {compareDesc(a.died, b.died)};
    } else if (criteria == '#Voyages') {
        return function(a,b) {compareDesc(a.nvoyages, b.nvoyages)};
    } else if (criteria == 'Duration') {
        return function(a,b) {compareDesc(a.duration, b.duration)};
    } else if (criteria == '#Ships') {
        return function(a,b) {compareDesc(a.ships, b.ships)};
    }
    else return undefined;
}

