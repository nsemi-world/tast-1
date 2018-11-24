$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        toggleLoginState();
    });
    
    $(document).on('_facebook_status', function(event, isLoggedIn){
        if(isLoggedIn) {
            $('#toggle_login i').addClass('loggedin');
            $('#toggle_login').attr('title', 'Logout');
        }
        else {
            $('#toggle_login i').removeClass('loggedin');
            $('#toggle_login').attr('title', 'Login');
        }
    });
    
    $(document).on('_facebook_status_changed', function(event, isLoggedIn){
        if(isLoggedIn) {
            logout();
        }
        else {
            login();
        }
    });

    $(document).on('_facebook_login', function (event, response, imageUrl) {
        $('#toggle_login i').addClass('loggedin');
        $('#toggle_login').attr('title', 'Logout');
        switchUserImage(imageUrl);
    });

    $(document).on('_facebook_logout', function (event, response) {
        $('#toggle_login i').removeClass('loggedin');
        $('#toggle_login').attr('title', 'Login');
        switchUserIcon();
    });
    
});

function switchUserImage(imageUrl) {
    $('#toggle_login i').addClass('d-none');
    $('#toggle_login img').attr('src', imageUrl).addClass('d-block');        
}
function switchUserIcon() {
    $('#toggle_login img').addClass('d-none');
    $('#toggle_login i').addClass('d-block');        
}

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

