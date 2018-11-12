$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        checkLoginState();
    });
    
    $(document).on('_facebook_status', function(event, isLoggedIn){
        if(isLoggedIn) {
            $('#toggle_login i').addClass('loggedin');
            $('#toggle_login').text('Logout');
            
        }
        else {
            $('#toggle_login i').removeClass('loggedin');
            $('#toggle_login').text('Login');
        }
    })
});

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

