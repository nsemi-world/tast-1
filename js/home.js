
$(document).ready(function () {
    $(window).on('resize', function () {
        centerHomeTitle();
        debounce('#home .frontpage', 'home.jpg');
    });
    
    $('#toggle-quizz').on('click', function(event) {
        event.preventDefault();
        $('#explore').slideToggle(500);
        initQuizz();
    });

    activate($('#toggle_home'));
    centerHomeTitle();
    loadSectionImage('#home .frontpage', 'home.jpg');
    configureSubsections();
    initQuizz();

    

});

// Positioning
function centerHomeTitle() {
    $('#home .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#home .title-wrapper'
    });
}


