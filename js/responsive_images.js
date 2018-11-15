// FUnction to load an image for a specific section
function loadSectionImage(sectionName, filename) {
    
    var documentWidth = screen.width;
    var documentHeight = screen.height;
    
    console.log(documentWidth + 'x' + documentHeight);
    
    $.ajax({
        url: 'php/getSectionImageFromDatabase.php',
        data: {name: filename, width: documentWidth, height: documentHeight},
        success: function(data) {
            $(sectionName + ' .frontpage').css({
                backgroundImage: "url(" + data.url + ")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            });
        },
        error: function() {
            alert("Error!");
        }
    });
    
}


function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();
console.log(params);