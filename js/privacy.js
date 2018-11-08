$(document).ready(function(){
    initPrivacy();
    activate($('#toggle_Privacy'));
});

function initPrivacy() {
    centerPrivacy();
    $(window).on('resize', function() {
        centerPrivacy();
    });
}

function centerPrivacy() {
    $('#privacy .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#privacy .title-wrapper'
    });
}

