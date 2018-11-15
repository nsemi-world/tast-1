$(document).ready(function(){
    initPrivacy();
    activate($('#toggle_privacy'));
});

function initPrivacy() {
    loadSectionImage('#privacy', 'privacy.jpg');
    centerPrivacy();
    $(window).on('resize', function() {
        loadSectionImage('#privacy', 'privacy.jpg');
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

