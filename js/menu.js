$(document).ready(function() {
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
    
    switchUserIcon();
    
});

function switchUserImage(imageUrl) {
    $('#toggle_login img').show().attr('src', imageUrl).css({
        //height: '24px',
        borderRadius: '50%'
    });
    
    $('#toggle_login i').hide();
}
function switchUserIcon() {
    $('#toggle_login i').show();        
    $('#toggle_login img').hide();
}

function activate(link) {
    $('#menu .active').removeClass('active');
    link.addClass('active');
}

