$(document).ready(function() {
    initHome();
    activate($('#toggle_home'));
});


function initHome() {
    loadSectionImage('#home', 'home.jpg');
    centerHome();
    
    $(window).on('resize', function() {
        loadSectionImage('#home', 'home.jpg');
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

