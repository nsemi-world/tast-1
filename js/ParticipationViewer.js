function createParticipationViewer(parent, title, data) {
    createTitle(title);
    createPlayer();
    //createMap('all-map', data['all'].countries);
    createMap('period-map', data['period'][1866 - 1514].countries);
    periodTable = createTable('period-table', data['period'][1866 - 1514].countries);
    //createChart('period-chart', data['period'][0].countries);

    //createMap('year-map', data['year'][0].countries);
}

function updateParticipationViewer(mapid, d) {
    updatePlayerYear(d.last_voyage_date);
    replaceMap('period-map', d.countries);
    replaceTable('period-table', d.countries);
}

function createTitle(title) {
    var $title = $('<h3></h3>')
        .addClass("h3 display-5 py-3 text-center text-light")
        .text(title);

    $('#ptitle').append($title);
}

function createPlayer() {
    $('#ppause').hide();

    $('#pplay').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #ppause, #prefresh').toggle();
        play();
    });
    $('#ppause').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #prefresh, #ppause').toggle();
        pause();
    });
    $('#prefresh').on('click', function (event) {
        event.preventDefault();
        refresh();
    });
}


function createTable(selector, data) {
    return $('#' + selector).DataTable({
        data: data.map(function (obj) {
            if (obj.name != null && obj.name != '') {
                return [obj.name, obj.nvoyages, obj.embarked, obj.disembarked, obj.died];
            }
        }),
        "columnDefs": [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
        "order": [[1, 'desc']],
        columns: [
            {
                title: 'name'
            },
            {
                title: '#voyages'
            },
            {
                title: '#embarked'
            },
            {
                title: 'disembarked'
            },
            {
                title: 'died'
            }
        ],
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false
    });
}

function replaceTable(selector, data) {
    var mdata = data.map(function (obj) {
        if (obj.name != null || obj.name != '') {
            return [obj.name, obj.nvoyages, obj.embarked, obj.disembarked, obj.died];
        }
    });
    periodTable.clear();
    periodTable.rows.add(mdata);
    periodTable.draw();
}
