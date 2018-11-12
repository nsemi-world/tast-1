$(document).ready(function() {
    checkLoginState();
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        checkLoginState();
    });
    
    $(document).on('_facebook_status', function(event, isLoggedIn){
        if(isLoggedIn) {
            logout();
        }
        else {
            login();
        }
    });
    
    $(document).on('_facebook_login', function (event, response) {
        $('#toggle_login i').addClass('loggedin');
        $('#toggle_login').text('Logout');
    });

    $(document).on('_facebook_logout', function (event, response) {
        $('#toggle_login i').removeClass('loggedin');
        $('#toggle_login').text('Login');
    });
    
});

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

