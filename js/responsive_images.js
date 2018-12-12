var resizeTimeout = false;

// FUnction to load an image for a specific section
function loadSectionImage(sectionName, filename) {
    var $target = $(sectionName);
    var width = $target.innerWidth();
    var height = $target.innerHeight();

    console.log("Target " + sectionName);
    console.log("width " + width);
    
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
        },
        error: function () {
            console.error("Error reading/saving image from db!");
        }
    });

}

function debounce(selector, filename) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
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




