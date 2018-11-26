
$(document).ready(function () {
    $(window).on('resize', function () {
        debounce('#home .frontpage', 'home.jpg');
    });
    
    $('#toggle-quizz').on('click', function(event) {
        event.preventDefault();
        $('#top-quizz').slideToggle(500);
        initQuizz();
    });

    activate($('#toggle_home'));
    loadSectionImage('#home .frontpage', 'home.jpg');
    configureSubsections();
    initQuizz();
});

