var SERVER_DATA = {
    variables: [],
    observations: []
}
var observationsTable;

$(document).ready(function () {
    configureDatabasePage();
    activate($('#toggle_database'));
    initDatabase();
    createDroppableTrash();
    $('#rawdata').prop("checked", false);

    
});

function configureDatabasePage() {
    // load page data database.json, with the static data of the webpage
    $('#nav-tab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust();
    });

    $(window).on('resize', function () {
        debounce('#database .frontpage', 'database.jpg');
    });

    $(document).on('_initial_data_loaded', function (event, data) {
        $('.OBSERVATIONS').text(data.nobservations);
        $('.VARIABLES').text(data.nvariables);
        $('.CELLS').text(data.nvariables * data.nobservations);
        $('.OBSERVATIONS, .VARIABLES, .CELLS').css("font-weight", "bold");
    });

    $('#observe-button').on('click', function (event) {
        event.preventDefault();
        var variables = collectVariablesFromBadgeList();
        loadObservations(variables);
    });
    
    $('#rowdata').on('change', function(event) {
        var isChecked = $(this).prop("checked");
        if (isChecked) {
            $(this).prop("checked", false);
        } else {
            $(this).prop("checked", true);
        }
    });
    
    $('#vsubsets a').on('click', function(event) {
        event.preventDefault();
        var $a = $(this);
        var vars = $a.attr('title');
        var variables = vars.split(', ');
        addBadgesFor(variables);
        //loadObservations(variables);
    })
}

function addBadgesFor(variables) {
    
    $.each($('#variables-checklist-badges span'), function(key, value) {
        if($(this).text() != 'voyageid') {
            $(this).remove();
        }
    });
    $.each(variables, function(key, value){
        if(value != 'voyageid') {
            addBadge(value, value);
        }
    });
    
    
}

function collectVariablesFromBadgeList() {
    var variables = ['voyageid'];
    $.each($('#variables-checklist-badges .badge'), function () {
        var name = $(this).text();
        if(name != 'voyageid') {
            variables.push(name);
        }
    });
    return variables;
}

function loadInitialData() {
    $.ajax({
        url: 'php/database.json',
        success: function (response) {
            $(document).trigger('_initial_data_loaded', [response]);
        },
        error: function () {
            alert('Error while requesting initial data for page');
        }

    });
}

function initDatabase() {
    loadSectionImage('#database .frontpage', 'database.jpg');
    loadVariablesList();
}

function loadVariablesList() {
    $.ajax({
        url: 'php/variables.json',
        success: function (response) {
            SERVER_DATA.variables = response;
            updatePageTemplates(response.length, response[266].coverage);
            updateVariablesList(response);
            updateVariablesMeaningAndCoverage(response);
        },
        error: function () {
            alert('Error fetching variable list');
        }

    });
}

function updatePageTemplates(variables, observations) {
    $('.VARIABLES').text(variables);
    $('.OBSERVATIONS').text(observations);
    $('.CELLS').text(variables * observations);
    $('.SUBSETS').text(Math.pow(2, variables));
    $('.PREDEFINED-SUBSETS').text($('#vsubsets a').length);
}


function updateVariablesList(variables) {
    var $vList = $('#variables-list');
    $.each(variables, function (key, value) {
        var newvar = $('<p class="bg-secondary pl-1"></p>').text(value.name);
        $vList.append(newvar);
    });
}

function updateVariablesMeaningAndCoverage(data) {
    var variablesDataTable = $('#variables-table').DataTable({
        data: data.map(function (obj) {
            return [obj.name, obj.description, obj.coverage, getCoveragePercentage(obj.coverage)];
        }),
        order: [[3, "desc"]]
    });

    $('#variables-table tbody').on('click', 'tr', function (event) {
        var name = $(this).find('td').first().text();
        var isSelected = $(this).hasClass('bg-primary');

        if (!isSelected) {
            addBadge(name, name);
        } else {
            removeBadge(name);
        }
        $(this).toggleClass('bg-primary');
    });
}

function addColumn(thead, name) {
    var col = $('<th></th>').addClass(name).text(name);
    $(thead).append(col);
}

function removeColumn(thead, name) {
    var col = $(thead + ' th.' + name);
    col.remove();
}

function getCoveragePercentage(coverage) {
    return ((100 * coverage) / $('.OBSERVATIONS').text()).toFixed(2);
}

function addBadge(text, name) {
    var $badge = $('<span class="badge badge-primary mr-1 my-1"></span>')
        .text(text)
        .attr('id', 'badge-' + name)
        .data('name', name)
        .addClass('badge badge-primary draggable')
        .draggable({
            revert: "invalid"
        });
    
    $('#variables-checklist-badges').append($badge);
}

function createDroppableTrash() {
    $('#droppable-trash').droppable({
        accepts: '.draggable',
        classes: {
            "ui-droppable-hover": "border border-danger"
        },
        drop: function(event, ui) {
            var $draggable = ui.draggable;
            var $droppable = $(this);
            removeBadge($draggable.data('name'));
        }
    }).css("height", "40px");
}

function removeBadge(name) {
    var $badge = $('#badge-' + name);
    $badge.remove();
}
function removeBadgeSelector(id) {
    var $badge = $('#' + id);
    $badge.remove();
    
    $.each($('#variables-table tbody tr'), function(){
        var $tr = $(this);
        var name = id.replace('badge-', '');
        var $first_td = $tr.find('td').first();
        
        if($first_td.text() == name) {
            $tr.removeClass('bg-primary');
        }
    }); 
}

function loadObservations(variables) {
    $.ajax({
        url: 'php/getObservations.php',
        data: {
            variables: variables,
            join: shouldJoin()
        },
        success: function (response) {
            SERVER_DATA.observations = response;
            updateObservationsTable(response, variables);
        },
        error: function () {
            alert('Error while feteching observations');
        }
    });
}

function shouldJoin() {
    var join =  ! $('#rawdata').prop('checked');
    return join;
}

function updateObservationsTable(data, variables) {
    if (observationsTable) {
        observationsTable.destroy();
        $('#single-vo-table thead, #single-vo-table tbody').empty();
        // removel all headers
    }
    observationsTable = $('#single-vo-table').DataTable({
        data: data.map(function (d) {
            return objectToArray(d);
        }),
        columns: variables.map(function (v) {
            return {
                title: v + '<small>' + getVariableDescription(v) + '</small>'
            };
        }),
        deferRender: true
    });
    
}

function objectToArray(obj) {
    var result = [];
    var i = 0;
    $.each(obj, function (key, value) {
        //console.log(key + ' ' + value);
        result[i++] = value;
    });
    return result;
}

function getVariableDescription(v) {
    
    for(var i = 0; i < SERVER_DATA.variables.length; i++) {
        var value = SERVER_DATA.variables[i];
        if(value.name == v) {
            return ' - ' + value.description;
        }
    }

    return '';
}

