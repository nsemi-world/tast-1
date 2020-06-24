var periodChart = null;

function updateParticipationViewer(data) {
    if(data.countries) {
        updatePlayerYear(data.last_voyage_date);

        replaceMap('period-map', data.countries);
        replaceTable('period-table', data.countries);
        updateChart('period-chart', data.countries);
    }
}


function createTitle(title) {
    var $title = $('<h3></h3>')
        .addClass("h3 display-5 py-3 text-center text-light")
        .text(title);

    $('#ptitle').append($title);
}



function createTable(selector, data) {
    var tableData = getTableDataForCriteria(data);

    periodTable = $('#' + selector).DataTable({
        data: tableData.data,
        columns: tableData.columns,
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

function getTableDataForCriteria(data) {
    var criteria = $('option:selected').val();
    
    if (criteria == '#Embarked') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.embarked];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Disembarked') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.disembarked];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Died') {
        return {
            data: data.map(function (obj) {
                    return [obj.name, obj.died];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == '#Voyages') {
        return {
            data: data.map(function (obj) {
                return [obj.name, obj.nvoyages];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else if (criteria == 'Duration') {
        return {
            data: data.map(function (obj) {
                return [obj.name, (getPlayerYearValue() - obj.fdate) + 1];
            }),
            columns: [{
                title: 'name'
            }, {
                title: 'Value'
            }]
        };
    } 
    else {
        alert('Unknown criteria: ' + criteria);
        return [];
    }
}

function replaceTable(selector, data) {
    var tableData = getTableDataForCriteria(data);

    periodTable.clear();
    periodTable.rows.add(tableData.data);
    periodTable.draw();
}


