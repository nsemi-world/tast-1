$(document).ready(function() {
    initHome();
    activate($('#toggle_home'));
});


function initHome() {
    centerHome();    
    $(window).on('resize', function() {
        centerHome();
    });
}

function centerHome() {
    $('#home .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#home .title-wrapper'
    });
}

