$(document).ready(function(){
    initImpressum();
    activate($('#toggle_impressum'));
});

function initImpressum() {
    loadSectionImage('#impressum', 'impressum.jpg');
    centerImpressum();
    $(window).on('resize', function() {
        loadSectionImage('#impressum', 'impressum.jpg');
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

