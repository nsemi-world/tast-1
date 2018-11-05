$(document).ready(function(){
    initContribute();
    activate($('#toggle_contribute'));
});

function initContribute() {
    centerContribute();
    $(window).on('resize', function() {
        centerContribute();
    });
}

function centerContribute() {
    $('#contribute .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#contribute .title-wrapper'
    });
}

