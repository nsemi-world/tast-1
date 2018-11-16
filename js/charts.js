$(document).ready(function() {
    initCharts();
    activate($('#toggle_charts'));
});

function initCharts() {
    loadSectionImage('#charts .frontpage', 'charts.jpg');
    centerCharts();
    
    $(window).on('resize', function() {
        centerCharts();
        debounce('#charts .frontpage', 'charts.jpg');
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

function centerCharts() {
    $('#charts .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#charts .title-wrapper'
    });
}
