

function createParticipationViewer(selector, title, data) {
    initTitle(selector, title);
    createPlayer(selector);
    createMap(selector, data.countries);
    //createScoreTables(selector);
}

function initTitle(selector, title) {
    var $title = $('<h3></h3>')
        .addClass("h3 display-5 py-3 text-center text-light")
        .text(title);

    $(selector).append($title);
}

function updateParticipationViewer(data) {
    updatePlayerYear(parseInt(data.last_voyage_date));
    replaceMap('#participation-viewer', data.countries);
}