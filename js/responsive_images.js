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