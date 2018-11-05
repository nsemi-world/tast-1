$(document).ready(function(){
    initContacts();
    activate($('#toggle_contacts'));
});

function initContacts() {
    centerContacts();
    $(window).on('resize', function() {
        centerContacts();
    });
}

function centerContacts() {
    $('#contacts .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#contacts .title-wrapper'
    });
}

