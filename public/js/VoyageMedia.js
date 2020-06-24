var source = 'sounds/SlaveShipSoundEffectsImages.mp3';
var audio;


function VoyageMedia() {
    
    this.init = function() {
        createAudioElements();
        $('#play').on('click', function (event) {
            event.preventDefault();
            audio.play();
        });
        $('#pause').on('click', function (event) {
            event.preventDefault();
            audio.pause();
        });
    };
}

function createAudioElements() {
    var $audio = $('<audio id="audio1" controls></audio>')
        .attr('src', source)
        .attr('type','audio/mpeg');
    
    $('#media')
        .append($audio);
    
    audio = document.getElementById('audio1');
    audio.loop = true;
    audio.volume = 0.5;
}
