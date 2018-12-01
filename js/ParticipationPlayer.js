var FIRST_YEAR = 1514;
var LAST_YEAR = 1866;

var started = false;
var interval = null;


// Execution
function createPlayer(parent) {
    var $timeframe = $('<span id="year" class="text-light float-left">1866</span>');
    var $settings = $('<button id="psettings" class="btn fas fa-cog"></button>');
    var $refresh = $('<button id="prefresh" class="btn fas fa-undo"></button>');
    var $play = $('<button id="pplay" class="btn fas fa-play"></button>');
    var $pause = $('<button id="ppause" class="btn fas fa-pause"></button>');

    var $player = $('<div></div>')
        .attr('id', 'pplayer')
        .addClass('container clearfix shadow rounded text-right bg-secondary m-auto')
        .append($refresh)
        .append($timeframe)
        .append($play)
        .append($pause)
        .append($settings)
        .appendTo($(parent));
    
    configurePlayer();
}

function configurePlayer() {
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
    startParticipationAnimation();
};

function pause() {
    stopParticipationAnimation();
};

function refresh() {
    getCountriesSeries(1514);
}

function startParticipationAnimation() {
    interval = setInterval(function () {
    var year = getPlayerYearValue();
        if (year >= 1866) {
            stopParticipationAnimation();
            $('#pplay, #ppause, #prefresh').toggle();
        } else {
            getCountriesSeries(year);
        }
    }, 500);
};

function stopParticipationAnimation() {
    clearInterval(interval);
}
