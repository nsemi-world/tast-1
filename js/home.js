
$(document).ready(function () {
    activate($('#toggle_home'));
    centerHomeTitle();
    loadSectionImage('#home .frontpage', 'home.jpg');
    configureSubsections();
    

    $(window).on('resize', function () {
        centerHomeTitle();
        debounce('#home .frontpage', 'home.jpg');
    });
    
    $('#toggle-quizz').on('click', function(event) {
        event.preventDefault();
        $('#explore').toggle(1000);
        initQuizz();
    });

    

});

// Positioning
function centerHomeTitle() {
    $('#home .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#home .title-wrapper'
    });
}


