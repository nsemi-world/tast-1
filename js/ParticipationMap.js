
function replaceMap(id, series) {
    getMapView(id).empty();
    createMap(id, series);
}

function getMapView(id) {
    return $('#' + id);
}





