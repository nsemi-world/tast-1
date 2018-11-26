$(document).ready(function() {
   configureSubsections(); 
});

function configureSubsections() {
    $('.frontpage .title-wrapper').css({
        backgroundColor: 'rgba(10,0,0,.85)',
    });

    centerFrontpageTitle();
    $(window).on('resize', function() {
        centerFrontpageTitle();
    });

}

// Center Article title
function centerFrontpageTitle() {
    $('.title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '.title-wrapper'
    });
}

function getRandomColor() {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var a = .5;
    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    console.log(rgba);
    return rgba;
}

