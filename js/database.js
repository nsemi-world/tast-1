var observationsTable;

$(document).ready(function () {
    configureDatabasePage();
    activate($('#toggle_database'));
    initDatabase();
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
        centerDatabase();
    });

    $(document).on('_initial_data_loaded', function (event, data) {
        $('.OBSERVATIONS').text(data.nobservations);
        $('.VARIABLES').text(data.nvariables);
        $('.CELLS').text(data.nvariables * data.nobservations);

        $('.OBSERVATIONS, .VARIABLES, .CELLS').css("font-weight", "bold");
    });

    $('#observe-button').on('click', function (event) {
        event.preventDefault();
        loadObservations();
    });

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
    /*
    centerDatabase();    
    getPlacesDataTable();
    getShipsDataTable();
    getOwnersDataTable();
    getCaptainsDataTable();
    */
}

function loadVariablesList() {
    $.ajax({
        url: 'php/variables.json',
        success: function (response) {
            console.log(response);
            updatePageTemplates(response.length, response[266].coverage);
            updateVariablesList(response);
            updateVariablesMeaningAndCoverage(response);
            updateVariablesForm(response);
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
        $(this).toggleClass('bg-primary text-light');
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

function updateVariablesForm(data) {
    var $vList = $('#variables-checklist');
    $.each(data, function (key, value) {
        var $html = '';
        $html += '<input type="checkbox" class="form-check-input" id="' + value.name + '">';
        $html += '<label class="form-check-label text-truncated" for="' + value.name + '" title="' + value.description + ' | coverage = ' + getCoveragePercentage(value.coverage) + '"><b>' + value.name + '</b></label>';
        $check = $('<div class="form-group form-check d-inline-block my-auto col-4 col-sm-4 col-md-3 col-lg-2"></div>');
        $check.html($html);
        $vList.append($check);

        $check.on('change', function (event) {
            var isChecked = $(this).prop("checked");
            if (isChecked) {
                $(this).prop("checked", false);
                removeBadge(value.name);
            } else {
                $(this).prop("checked", true);
                addBadge($(this).find('label').text(), value.name);
            }
        });
    });
}

function addBadge(text, name) {
    $('#variables-checklist-badges').append($('<span class="badge badge-primary mr-1 my-1"></span>').text(text).attr('id', 'badge-' + name));
}

function removeBadge(name) {
    var $badge = $('#badge-' + name);
    $badge.remove();
}

function loadObservations() {
    var variables = ['voyageid'];
    $.each($('#variables-checklist-badges .badge'), function () {
        var name = $(this).text();
        if(name != 'voyageid') {
            variables.push(name);
        }
    });
    
    $.ajax({
        url: 'php/getObservations.php',
        data: {
            variables: variables
        },
        success: function (response) {
            console.log(response);
            updateObservationsTable(response, variables);
        },
        error: function () {
            alert('Error while feteching observations');
        }
    });
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
                title: v
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

function getShipsDataTable() {
    return $('#example-ships').DataTable({
        ajax: {
            url: 'php/getShips.php',
            cache: true
        },
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
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true,
        autoWidth: false
    }).page.len(50);
}

function getOwnersDataTable() {
    return $('#example-owners').DataTable({
        ajax: {
            url: 'php/getOwners.php',
            cache: true
        },
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
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true,
    }).page.len(50);
}

function getCaptainsDataTable() {
    return $('#example-captains').DataTable({
        ajax: {
            url: 'php/getCaptains.php',
            cache: true
        },
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
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true
    }).page.len(50);
}

function getPlacesDataTable() {
    return $('#example-places').DataTable({
        ajax: {
            url: 'php/getPlaces.php',
            cache: true
        },
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
        info: false,
        deferRender: true,
        scrollY: 400,
        scrollCollapse: false,
        scroller: true,
        stateSave: true
    }).page.len(50);
}



function centerDatabase() {
    $('#database .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#database .title-wrapper'
    });
}
