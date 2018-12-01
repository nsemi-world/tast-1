var participationViewer = null;
var participationData = null;

$(document).ready(function () {
    console.log('>>> Participation Page: Started');
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
    $(document).on('_data_loaded', function(event, pdata) {
        var data = pdata['all'];
        updateTotalVoyages(data);
        updateFirstVoyageDate(data);
        updateLastVoyageDate(data);
        updateCountriesList(data);
        updateTimelines(data);
        createParticipationViewer('#participation-viewer', "Evolution of World's Prticipation in the Trans-atlantic Slave Trade", data);
    });
    
    $(document).on('_series_loaded', function (event, data) {
        updateParticipationViewer(data);
    });

        
    $(window).on('resize', function () {
        debounce('#participation .frontpage', 'participation.jpg');
    });
}

function loadParticipationData() {
    $.ajax({
        url: 'php/participation.json',
        success: function(data) {
            console.log(data);
            participationData = data;
            $(document).trigger('_data_loaded', [data]);
        },
        error: function() {
            alert('Error while fetching timelines data. Sorry for the inconvenience. An issue is being created. Please come back later.');
        }
    });
}

function getCountriesSeries(y) {
    //console.log('Needs data for year: ' + y);
    var data = participationData.year[y-1514];
    $(document).trigger('_series_loaded', [data]);
}

function getCountriesSeriesFromServer(y) {
    var url = 'php/getParticipationData.php';

    $.ajax({
        url: url,
        data: {year: y},
        success: function (data) {
            console.log(data);
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
    //$('#participation-timeline').accordion();
    updateFirstTimeline(data.countries);
    updateLastTimeline(data.countries);
}

function updateFirstTimeline(countriesData) {
    var sorted = countriesData.sort(compareFirst);
    
    var $timeline = $('#FIRST_VOYAGE_TIMELINE');
    
    var $line = $('<div class="position-relative rounded bg-secondary"></div>')
        .css({
            height:'2px', 
            width:'100%'
        });
    
    $timeline.append($line);
    
    $.each(sorted, function(key, value){
        addNodeToLine($line, value.fdate, value.name, value.iso2);
    });
}

function updateLastTimeline(countriesData) {
    var sorted = countriesData.sort(compareFirst);
    
    var $timeline = $('#LAST_VOYAGE_TIMELINE');
    
    var $line = $('<div class="position-relative rounded bg-secondary"></div>')
        .css({
            height:'2px', 
            width:'100%', 
        });
    
    $timeline.append($line);
    
    $.each(sorted, function(key, value){
        addNodeToLine($line, value.ldate, value.name, value.iso2);
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
        var li = '<div class="text-truncate">' + country[0].name + '</div>';
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
function cleanSeries() {
    initCountriesData();
}


