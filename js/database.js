$(document).ready(function() {
    initDatabase();
    activate($('#toggle_database'));
});


function initDatabase() {
    $('#nav-tab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust();
    });

    getPlacesDataTable();
    getShipsDataTable();
    getOwnersDataTable();
    getCaptainsDataTable();
    centerDatabase();    
    $(window).on('resize', function() {
        centerDatabase();
    });
}

function getShipsDataTable() {
    return $('#example-ships').DataTable({
        ajax: 'php/getShips.php',
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
        ajax: 'php/getOwners.php',
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
        ajax: 'php/getCaptains.php',
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
        ajax: 'php/getPlaces.php',
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




