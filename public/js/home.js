
$(document).ready(function () {
    $('#toggle-quizz').on('click', function(event) {
        event.preventDefault();
        $('#top-quizz').slideToggle(500);
        initQuizz();
    });

    activate($('#toggle_home'));
    configureSubsections();
    initQuizz();
});

