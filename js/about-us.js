$(document).ready(function(){
    initAboutUs();
    activate($('#toggle_about_us'));
});

function initAboutUs() {
    centerAboutUs();
    $(window).on('resize', function() {
        centerAboutUs();
    });
}

function centerAboutUs() {
    $('#about-us .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#about-us .title-wrapper'
    });
}

