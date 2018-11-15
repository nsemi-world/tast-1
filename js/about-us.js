$(document).ready(function(){
    initAboutUs();
    activate($('#toggle_about_us'));
});

function initAboutUs() {
    loadSectionImage('#about-us', 'about-us.jpg');
    centerAboutUs();
    $(window).on('resize', function() {
        loadSectionImage('#about-us', 'about-us.jpg');
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

