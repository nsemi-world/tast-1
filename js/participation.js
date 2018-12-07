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
        updateTimelines(data);
        updateNumbersTable(data);
        createParticipationViewer('#participation-viewer', "Evolution of World's Prticipation in the Trans-atlantic Slave Trade", pdata);
    });

    $('select').on('change', function (event) {
        updateParticipationViewer(participationData['period'][getPlayerYearValue() - 1514]);
    });

    $(window).on('resize', function () {
        debounce('#participation .frontpage', 'participation.jpg');
        periodMap.resize();
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
    updateParticipationViewer(participationData['period'][y - 1514]);
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


function updateTimelines(data) {
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

