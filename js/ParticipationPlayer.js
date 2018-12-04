var FIRST_YEAR = 1514;
var LAST_YEAR = 1866;
var CURRENT_YEAR = 1514;

var started = false;
var interval = null;


// Execution


function getPlayer() {
    return $('pplayer');
}

function getPlayerYear() {
    return $('#year');
}
function getPlayerYearValue() {
    return parseInt($('#year').text());
}

function updatePlayerYear(newYear) {
    getPlayerYear().text(newYear);
}

function getPlayerSetting() {
    return $('#psettings');
}

function getPlayerRefresh() {
    return $('#prefresh');
}

function getPlayerPlay() {
    return $('#pplay');
}

function getPlayerPause() {
    return $('#ppause');
}
        
function play() {
    //frameRequest = requestAnimationFrame(startParticipationAnimation2);
    startParticipationAnimation();
};

function pause() {
    stopParticipationAnimation();
    //cancelAnimationFrame(frameRequest);
};

function refresh() {
    getCountriesSeries(1514);
    updateProgress(1514);
    //update
    //updatePlayerYear(1514);
}


function startParticipationAnimation2(timestamp) {
    var year = getPlayerYearValue() + 1;
    if (year >= 1866) {
        cancelAnimationFrame(frameRequest);
        $('#pplay, #ppause, #prefresh').toggle();
    } else {
        getCountriesSeries(year);
        frameRequest = requestAnimationFrame(startParticipationAnimation2)
    }
    updateProgress(year);
    updatePlayerYear(year);
}

function updateProgress(year) {
    $('.progress-bar').css({
        width: 100 * (year-1514)/(1866-1514) + '%'
    });
    
    $('.progress-bar .end').text(year);
}

function startParticipationAnimation() {
    interval = setInterval(function () {
        var year = getPlayerYearValue() + 1;
        if (year >= 1866) {
            stopParticipationAnimation();
            $('#pplay, #ppause, #prefresh').toggle();
        } else {
            getCountriesSeries(year);
        }
        updateProgress(year);
        updatePlayerYear(year);
    }, 1000);
};

function stopParticipationAnimation() {
    clearInterval(interval);
}
