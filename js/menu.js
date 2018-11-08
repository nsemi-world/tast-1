$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        alert("Is Logged In? " + isLoggedIn());
        if(!isLoggedIn()) {
            login();
        }
    });
});

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

