$(document).ready(function(){
    initAboutUs();
    activate($('#toggle_about_us'));
});

function initAboutUs() {
    centerAboutUs();
    loadSectionImage('#about-us .frontpage', 'about-us.jpg');
    
    $(window).on('resize', function() {
        centerAboutUs();
        debounce('#about-us .frontpage', 'about-us.jpg');
    });
}

function centerAboutUs() {
    $('#about-us .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#about-us .title-wrapper'
    });
}

