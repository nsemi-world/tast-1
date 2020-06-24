$(document).ready(function(){
    initContacts();
    activate($('#toggle_contacts'));
});

function initContacts() {
    loadSectionImage('#contacts .frontpage', 'contacts.jpg');
    centerContacts();
    $(window).on('resize', function() {
        centerContacts();
        debounce('#contacts .frontpage', 'contacts.jpg');
    });
}

function centerContacts() {
    $('#contacts .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#contacts .title-wrapper'
    });
}

