$(document).ready(function(){
    initContribute();
    activate($('#toggle_contribute'));
});

function initContribute() {
    loadSectionImage('#contribute', 'contribute.jpg');
    centerContribute();
    $(window).on('resize', function() {
        loadSectionImage('#contribute', 'contribute.jpg');
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

