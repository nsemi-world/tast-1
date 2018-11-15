$(document).ready(function(){
    initContacts();
    activate($('#toggle_contacts'));
});

function initContacts() {
    loadSectionImage('#contacts', 'contacts.jpg');
    centerContacts();
    $(window).on('resize', function() {
        loadSectionImage('#contacts', 'contacts.jpg');
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

