$(document).ready(function(){
    initPrivacy();
    activate($('#toggle_privacy'));
});

function initPrivacy() {
    loadSectionImage('#privacy .frontpage', 'privacy.jpg');
    centerPrivacy();
    $(window).on('resize', function() {
        centerPrivacy();
        debounce('#privacy .frontpage', 'privacy.jpg');
    });
}

function centerPrivacy() {
    $('#privacy .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#privacy .title-wrapper'
    });
}

