$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        checkLoginState();
        if(!isLoggedIn()) {
            login();
        }
        else {
            logout();
        }
    });
});

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

