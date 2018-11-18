var resizeTimeout = false;

// FUnction to load an image for a specific section
function loadSectionImage(sectionName, filename) {
    var $target = $(sectionName);
    var width = $target.innerWidth();
    var height = $target.innerHeight();

    console.log(width + 'x' + height);

    $.ajax({
        url: 'php/getSectionImageFromDatabase.php',
        data: {
            name: filename,
            width: width,
            height: height
        },
        success: function (data) {
            if ($target) {
                $target.css({
                    backgroundImage: "url(" + data.url + ")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                });
            }
            console.log("Got image from db!");
        },
        error: function () {
            console.error("Error reading/saving image from db!");
        }
    });

}

function debounce(selector, filename) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        console.log('After timeout ' + new Date());
        loadSectionImage(selector, filename);
    }, 2000);
}



function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

function configureSubsections() {

    $('.subsection').hover(
        function (event) {
            $(this).animate({
                backgroundColor: 'linear-gradient(to bottom right, var(--main-color),' +  getRandomColor() + ')'
            }, 1000);
        },
        function (event) {
            $(this).animate({
                backgroundColor: '#eee'
            }, 1000);
        }
    );

    $.each($('.frontpage .title-wrapper'),
        function () {
            $(this).animate({
                backgroundColor: getRandomColor()
            }, 1000);
        }
    );
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
