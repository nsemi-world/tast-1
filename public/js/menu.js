$(document).ready(function() {
    $('#toggle_login').on('click', function(event) {
        event.preventDefault();
        checkLoginState();
    });
    
    $(document).on('_facebook_status', function(event, isLoggedIn) {
        if(isLoggedIn) {
            logout();
        }
        else {
            login();
        }
    });

    $(document).on('_facebook_login', function (event, userid, userimage) {
        updateSessionUser(userid, userimage);
    });

    $(document).on('_facebook_logout', function (event, response) {
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
    if(userid !== null && userimage !== null) {
        sessionStorage.setItem('userid', userid);
        sessionStorage.setItem('userimage', userimage);
    } else {
        sessionStorage.removeItem('userid');
        sessionStorage.removeItem('userimage');
    }
    
    loadUserIfAny();
    
}

function loadUserIfAny() {
    if(sessionStorage.getItem('userid')) {
       switchUserImage(sessionStorage.getItem('userimage'));
    }
    else {
        switchUserIcon();
    }
}