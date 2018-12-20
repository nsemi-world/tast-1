var CHART = null;
var CHART2 = null;

$(document).ready(function () {
    activate($('#toggle_charts'));
    loadSectionImage('#charts .frontpage', 'charts.jpg');

    handleEvents();
    loadVariables();
    
    // Basic Charting Tool
    initOptions();
    
    // Improvement 1
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

function initOptions1() {
    $('#charts-function')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
    $('#function-argument')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
    $('#function-groupby-variable')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
    $('#charts-type')
        .children()
        .first()
        .prop('selected', 'selected')
        .click();
}

function handleEvents() {
    $(window).on('resize', function () {
        debounce('#charts .frontpage', 'charts.jpg');
    });

    $(document).on('_variables_loaded', function (event, data) {
        initChartsDashboard1(data);
        initOptions1();
    });

    $('select').on('click', 'option', function (event) {
        event.preventDefault();
        $(this).parent().find('.active').toggleClass('active');
        $(this).toggleClass('active');
    });
    $('#charts-dashboard select').on('click', 'option', function (event) {
        event.preventDefault();
        updateFormula(getSelectVariable(), getGroupByVariable());
        loadChartData(getSelectVariable(), getGroupByVariable(), getChartTypeValue());
        //$('#charts-dashboard form button').click();
        
    });
    $('#charts-dashboard-improved select').on('click', 'option', function (event) {
        event.preventDefault();
        updateFormula1();
        loadChartData1();
        //$('#charts-dashboard-improved form button').click();
    });
}

function loadVariables() {
    $.ajax({
        url: 'php/variables.json',
        success: function (result) {
            $(document).trigger('_variables_loaded', [result]);
        },
        error: function () {
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

function updateFormula(cFunction, cGroupBy) {
    $('#charts-dashboard .formula-function').text(cFunction);
    $('#charts-dashboard .formula-domain-variable').text(cGroupBy);
}
function updateFormula1() {
    var cFunction = $('#charts-function .active').val();
    var fArgument = $('#function-argument .active').val();
    var groupBy = $('#function-groupby-variable .active').val();
    
    $('#charts-dashboard-improved .formula-function').text(cFunction + '(' + fArgument + ')');
    $('#charts-dashboard-improved .formula-domain-variable').text(groupBy);
}

function loadChartData(selectVariable, groupByVariable, chartType) {
    updateFormula(selectVariable, groupByVariable);
    $.ajax({
        url: 'php/getChartData.php',
        data: {
            select: selectVariable,
            groupBy: groupByVariable
        },
        success: function (response) {
            createChart('#chart', response, chartType);
            $('#chart-wrapper .chart-caption').html(
                '<b>Figure 1: ' + 
                getSelectChartType() + 
                ' chart of: ' + 
                getSelectFunction() + 
                ' ' + getSelectGroupBy() + 
                '</b>');
        },
        error: function () {
            alert('Error while loading chart data...')
        }
    })
}

function createChart(selector, data, chartType, label) {
    var $chart = $(selector).empty();
    if (CHART2) {
        CHART2.destroy();
    }
    CHART2 = new Chart($chart, {
        type: chartType,
        data: getChartData(data, label),
        options: getChartOptions(data, chartType)
    });
}

function getChartData(data, label) {
    return {
        labels: data.map(function (obj) {
            return obj[0];
        }),
        datasets: [{
            label: label,
            data: data.map(function (obj) {
                return obj[1];
            }),
            backgroundColor: data.map(function (obj) {
                return getRandomColor();
            })
        }]
    };
}

function getChartOptions(data, cType) {
    return {
        legend: {
            position: 'right'
        }
    }
}


function loadChartData1() {
    updateFormula1();
    var chartFunction = $('#charts-function .active').val();
    var functionArgument = $('#function-argument .active').val();
    var groupBy = $('#function-groupby-variable .active').val();
    var chartType = $('#charts-type').val();
    
    $.ajax({
        url: 'php/getChartData.php',
        data: {
            select: chartFunction + '(' + functionArgument + ')',
            groupBy: groupBy
        },
        success: function (response) {
            createChart('#chart-1', response, chartType, );
            $('#chart-wrapper-1 .chart-caption').html(
                '<b>Figure 2: ' + 
                $('#charts-type').text() + 
                ' chart of: ' + 
                $('#charts-function .active').text() + 
                ' ' + $('#function-groupby-variable .active').text() + 
                '</b>');
        },
        error: function () {
            alert('Error while loading chart data...')
        }
    });
}

function initChartsDashboard1(variables) {
    $.each(variables, function(key, variable){
        $('#function-argument').append(createOption(variable));
        $('#function-groupby-variable').append(createOption(variable));
    });
}

function createOption(variable) {
    var $option = $('<option/>');
    $option.attr('value', variable.name).text(variable.description);
    return $option
}