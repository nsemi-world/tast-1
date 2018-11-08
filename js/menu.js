$(document).ready(function() {
    $('#toggle_login').on('click', function() {
        if(!isLoggedIn()) {
            login();
        }
    });
});

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

