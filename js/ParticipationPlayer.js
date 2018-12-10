var FIRST_YEAR = 1514;
var LAST_YEAR = 1866;
var CURRENT_YEAR = 1514;

var started = false;
var interval = null;


// Execution
function createPlayer() {
    configurePlayerCommands();
    configureCriteria();
    configureMode();
}

function configurePlayerCommands() {
    $('#ppause').hide();

    $('#pplay').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #ppause, #prefresh').toggle();
        play();
    });
    $('#ppause').on('click', function (event) {
        event.preventDefault();
        $('#pplay, #prefresh, #ppause').toggle();
        pause();
    });
    $('#prefresh').on('click', function (event) {
        event.preventDefault();
        refresh();
    });
}

function configureCriteria() {
    $('#pduration, #pvoyages, #pships, #pembarked, #pdisembarked, #pdied').on('click', function(event){
        $(this).toggleClass('hidden text-secondary');
    });
    $('#pduration').on('click', function(event) {
        $('#card-duration').toggle();
    });
    $('#pvoyages').on('click', function(event) {
        $('#card-voyages').toggle();
    });
    $('#pships').on('click', function(event) {
        $('#card-ships').toggle();
    });
    $('#pembarked').on('click', function(event) {
        $('#card-embarked').toggle();
    });
    $('#pdisembarked').on('click', function(event) {
        $('#card-disembarked').toggle();
    });
    $('#pdied').on('click', function(event) {
        $('#card-died').toggle();
    });
}

function configureMode() {
    $('#pmaps, #pcharts, #ptables').on('click', function(event) {
        $(this).toggleClass('hidden text-secondary');
    });
    
    $('#pmaps').on('click', function(event){
        $('.card-body .map').toggle();
    });
    
    $('#pcharts').on('click', function(event){
        $('.card-body .chart').toggle();
    });
    
}

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
    frameRequest = requestAnimationFrame(startParticipationAnimation2);
    //startParticipationAnimation();
};

function pause() {
    //stopParticipationAnimation();
    cancelAnimationFrame(frameRequest);
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
        width: Math.round(100 * (year-1514)/(1866-1514)) + '%'
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
    }, 500);
};

function stopParticipationAnimation() {
    clearInterval(interval);
}
