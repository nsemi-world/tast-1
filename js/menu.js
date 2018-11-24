$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
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

    $(document).on('_facebook_login', function (event, userid, userimage) {
        $('#toggle_login i').addClass('loggedin');
        $('#toggle_login').attr('title', 'Logout');
        
        console.log('>>> userid = ' + userid);
        console.log('>>> userimage = ' + userimage);

        switchUserImage(userimage);
        updateSessionUser(userid, userimage);
    });

    $(document).on('_facebook_logout', function (event, response) {
        $('#toggle_login i').removeClass('loggedin');
        $('#toggle_login').attr('title', 'Login');
        switchUserIcon();
        updateSessionUser(null, null);
    });
    
    loadUserIfAny();
    
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

function updateSessionUser(userid, userimage) {
    // User Id
    // Username
    // Image
    sessionStorage.setItem('userid', userid);
    sessionStorage.setItem('userimage', userimage);
}

function loadUserIfAny() {
    if(sessionStorage.getItem('userid') != null) {
       switchUserImage(sessionStorage.getItem('userimage'));
    }
    else {
        switchUserIcon();
    }
}