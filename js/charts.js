var CHART = null;

$(document).ready(function() {
    activate($('#toggle_charts'));
    handleEvents();
    initCharts();
    initOptions();
});

function initOptions() {    
    $('#select-charts-function')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
    $('#select-charts-groupby')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
    $('#select-charts-type')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
}

function handleEvents() {
    $(window).on('resize', function() {
        debounce('#charts .frontpage', 'charts.jpg');
    });
    
    $(document).on('_variables_loaded', function(event, data){
        createCharts(data);
    });
    
    $('option').on('click', function(event){
        event.preventDefault();
        $(this).parent().find('.active').toggleClass('active');
        $(this).toggleClass('active');
        updateFormula(getSelectFunction(), getSelectGroupBy(), getSelectChartType());
    });
    
    $('form button').on('click', function(event) {
        loadChartData(getSelectVariable(), getGroupByVariable(), getChartTypeValue());
    });
}

function initCharts() {
    loadSectionImage('#charts .frontpage', 'charts.jpg');
}

function loadVariables() {
    $.ajax({
        url: 'php/variables.json',
        success: function(result) {
            $(document).trigger('_variables_loaded', [result]);
        },
        error: function() {
            alert('Error fetching variables.json');
        }
    });
}


function getSelectFunction() {
    return $('#select-charts-function .active').text();
}
function getSelectVariable() {
    return $('#select-charts-function .active').val();
}

function getSelectGroupBy() {
    return $('#select-charts-groupby .active').text();    
}
function getGroupByVariable() {
    return $('#select-charts-groupby .active').val();    
}

function getSelectChartType() {
    return $('#select-charts-type .active').text();    
}

function getChartTypeValue() {
    return $('#select-charts-type .active').val();    
}

function updateFormula(cFunction, cGroupBy, cType) {
    $('#formula .coordinates span ').text(cFunction);
    $('#formula .ordinates span ').text(cGroupBy);
    $('#formula .chart-type span ').text(cType);
}

function loadChartData(selectVariable, groupByVariable, chartType) {
    $.ajax({
        url: 'php/getChartData.php',
        data: {select: selectVariable, groupBy: groupByVariable},
        success: function(response) {
            createChart(response, chartType);
        },
        error: function() {
            alert('Error while loading chart data...')
        }
    })
}

function createChart(data, chartType) {
    var $chart = $('#chart').empty();
    if(CHART) {
        CHART.destroy();
    }
    CHART = new Chart($chart, {
        type: chartType,
        data: {
            labels: data.map(function(obj){
                return obj[0];
            }),
            datasets: [{
                label: getSelectFunction(),
                data: data.map(function(obj) {
                    return obj[1];
                }),
                backgroundColor: getRandomColor()
            }]
        }
    });
}
