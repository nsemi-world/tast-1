
function loadSectionImage(sectionName, filename) {
    
    var documentWidth = screen.width;
    var documentHeight = screen.height;
    
    console.log(documentWidth + 'x' + documentHeight);
    
    $.ajax({
        url: 'php/getSectionImage.php',
        data: {name: filename, width: documentWidth, height: documentHeight},
        success: function(data) {
            //alert(data.url);
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