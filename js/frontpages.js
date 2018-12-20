$(document).ready(function() {
   configureSubsections(); 
});

function configureSubsections() {
    $('.frontpage .title-wrapper').css({
        backgroundColor: 'rgba(255,255,255,.5)',
    });

    centerFrontpageTitle();
    $(window).on('resize', function() {
        centerFrontpageTitle();
    });

}

// Center Article title
function centerFrontpageTitle() {
    $('.title-wrapper .title').position({
        my: 'left',
        at: 'left',
        of: '.title-wrapper'
    });
}

function getRandomColor() {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var a = .95;
    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    return rgba;
}

