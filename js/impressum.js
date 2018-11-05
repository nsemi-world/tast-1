$(document).ready(function(){
    initImpressum();
    activate($('#toggle_impressum'));
});

function initImpressum() {
    centerImpressum();
    $(window).on('resize', function() {
        centerImpressum();
    });
}

function centerImpressum() {
    $('#impressum .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#impressum .title-wrapper'
    });
}

