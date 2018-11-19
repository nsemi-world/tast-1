$(document).ready(function () {
    activate($('#toggle_home'));
    centerHome();
    loadSectionImage('#home .frontpage', 'home.jpg');
    configureSubsections();

    $(window).on('resize', function () {
        centerHome();
        debounce('#home .frontpage', 'home.jpg');
    });

    $('#top3-controls #number-of-tops').on('change', function (event) {
        $('#top3-options #top-value').text($(this).val());
        $('#ncorrect').text('0');
        $('#ntries').text('0');
        updateQuizz();
    });
    
    $('#top3-options label').on('click', function (event) {
        event.preventDefault();
        activateOption($(this));
        updateQuizz();
    });
    $('#top3-criteria label').on('click', function (event) {
        event.preventDefault();
        activateCriteria($(this));
        updateQuizz();
    });

    updateQuizz();
});


function activateOption($option) {
    $('#top3-options label.active').removeClass('active');
    $option.addClass('active');
}

function activateCriteria($criteria) {
    $('#top3-criteria label.active').removeClass('active');
    $criteria.addClass('active');
    sortQuizzByCriteriaDesc($(this).val());
}

function centerHome() {
    $('#home .title-wrapper .title').position({
        my: 'center',
        at: 'center',
        of: '#home .title-wrapper'
    });
}

function updateQuizz() {
    disableQuizz();    
    var question = getQuizzQuestion();
    var answers = getQuizzAnswers();
    $('#top3-quizz-title').html(question);
    $('#user-answers').html(answers);
    $('#user-results #ntotal').text($('#number-of-tops').val());

    // Make Answers droppables
    $('#user-answers p').droppable({
        accepts: '.draggable',
        tolerance: "touch",        
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function( event, ui ) {
            var $currentDroppable = $(this);
            var evaluation = evaluate($currentDroppable.data('rank'), ui.draggable.data('rank'));
            if(evaluation == true) {
                /* Thanks to: https://stackoverflow.com/questions/5581288/how-to-decide-whether-to-accept-or-reject-a-jquery-draggable-into-a-droppable
                ui.draggable.animate(ui.draggable.data("origPosition"),"slow");*/
                ui.draggable.animate({
                    color: 'green'
                }, 1000);
                ui.draggable.draggable("option", 'revert', false);
                ui.draggable.position({
                    my: 'left',
                    at: 'right+10',
                    of: $(this).find('span')
                });
                
                var $ntries = ui.draggable.find('.ntries');
                var ntriesValue = parseInt($ntries.text().replace(' (', '').replace(')', ''));
                $ntries.text(" (" + (++ntriesValue) + ")");
                
                $(window).on('resize', function(event){
                    ui.draggable.position({
                        my: 'left',
                        at: 'right+10',
                        of: $currentDroppable.find('span')
                    });
                });

                $(this).droppable("disable");
                ui.draggable.draggable("disable");
                updateNotification(true);
            }
            else {
                ui.draggable.animate({
                    color: 'red'
                }, 1000);
                ui.draggable.draggable("option", "revert", true);
                updateNotification(false);
                
                var $ntries = ui.draggable.find('.ntries');
                var ntriesValue = parseInt($ntries.text().replace(' (', '').replace(')', ''));
                $ntries.text(" (" + (++ntriesValue) + ")");
                
            }
        }
    });
    loadAnswersFromServer();
}

function evaluate(rank1, rank2) {
    return rank1 === rank2;
}

function updateNotification(doit) {
    var $ntries = $('#user-results #ntries');
    var ntriesValue = parseInt($ntries.text());
    $ntries.text(++ntriesValue);
    if(doit) {
        var $results = $('#user-results #ncorrect');
        var value = parseInt($results.text());
        $results.text(++value);
        
        var $total = $('#user-results #ntotal');
        if($results.text() == $total.text() ) {
           alert('You win!');
        }
    }
}

function getQuizzQuestion() {
    var $activeOption = $('#top3-options label.active');
    var $activeCriteria = $('#top3-criteria label.active');
    var question = createQuestion($activeOption.attr('id'), $activeCriteria.attr('id'));
    return question;
}

function createQuestion(option, criteria) {
    if (option == 'option-top-countries') {
        if (criteria == 'criteria-embarked') {
            return 'Which country had more people embarked from Afrika?';
        } 
        else if (criteria == 'criteria-disembarked') {
            return 'Which country had more people disembarked in Europe or in the Americas?';
        } 
        else if (criteria == 'criteria-died') {
            return 'Which country had more people dying during the Middle Passage?';
        }
    }
    else if (option == 'option-top-owners') {
        if (criteria == 'criteria-embarked') {
            return 'Which ship owners had more people embarked from Afrika?';
        } 
        else if (criteria == 'criteria-disembarked') {
            return 'Which ship owners had more people disembarked in Europe or in the Americas?';
        } 
        else if (criteria == 'criteria-died') {
            return 'Which ship owners had more people dead during the Middle Passage?';
        }
    }
    else if (option == 'option-top-captains') {
        if (criteria == 'criteria-embarked') {
            return 'Which ship captains had more people embarked from Afrika?';
        } 
        else if (criteria == 'criteria-disembarked') {
            return 'Which ship captains had more people disembarked in Europe or in the Americas?';
        } 
        else if (criteria == 'criteria-died') {
            return 'Which ship captains had more people dead during the Middle Passage?';
        }
    }
    else if (option == 'option-top-ships') {
        if (criteria == 'criteria-embarked') {
            return 'Which ships had more people embarked from Afrika?';
        } 
        else if (criteria == 'criteria-disembarked') {
            return 'Which ship had more people disembarked in Europe or in the Americas?';
        } 
        else if (criteria == 'criteria-died') {
            return 'Which ship had more people dead during the Middle Passage?';
        }
    }

}

function getQuizzAnswers(option, criteria) {
    var numberOfTops = parseInt($('#number-of-tops option:selected').text());
    var html = '';
    for(var i = 1; i <= numberOfTops; i++ ) {
        html += '<p data-rank="' + i + '">' + i + '.' + ' ';
        html += '<span>' + '</span>'
        html += '</p>';
        if(i != numberOfTops) {
           html += "<hr/>";
        }
    }
    
    return html;
}


function loadAnswersFromServer() {
    var min = parseInt($('#number-of-tops option:selected').val());
    var type = $('#top3-options label.active').text();
    var criteria = $('#top3-criteria label.active').text();
    loadQuizzData(min, type, criteria);
}

function loadQuizzData(min, type, criteria) {
    $.ajax({
        url: 'php/getTops.php',
        data: {min: min, type: type, criteria: criteria},
        success: function(data) {
            answers = configureAnswers(JSON.parse(data), min);
            putUIElements(answers);
            enableQuizz();
        },
        error: function() {
            alert("Error loading tops");
        }
    });    
}


function showQuizz() {
    $('#explore').show();
}

function hideQuizz() {
    $('#explore').hide();
}
function enableQuizz() {
    $('#top3-menu').prop("disabled", false);
}

function disableQuizz() {
    $('#top3-menu').prop("disabled", true);
}

function configureAnswers(quizzData, min) {
    console.log(quizzData);
    $.each(quizzData, function(key, value) {
        value['rank'] = (key + 1);
    });
    
    quizzData.sort(randomize);
    quizzData.sort(randomize);
    
    return quizzData;
}

function randomize(a, b) {
    return .5 - Math.random();           
}

function putUIElements(answers) {
    $('#possible-answers').empty();
    $.each(answers, function(kez, value) {
        var button = getButtonFor(value);
    });
}

function getButtonFor(countryData) {
    if(countryData.iso2) {
        var countryCode = countryData.iso2.toLowerCase();
        var $flag = $('<img></img')
            .addClass('flag flag-'+countryCode)
            .attr('src', 'img/blank.gif')
            .attr('alt', countryData.name + ' flag')
            .attr('title', countryData.name);
        
        var $name = $('<span></span>').text(countryData.name);
        var $ntries = $('<span class="ntries"></span>').text(' (' + 0 + ')');
        
        var $answer = $('<div></div>')
            .addClass('draggable')
            .addClass('m-0 p-0 text-left')
            .data('rank', countryData.rank)
            .append($flag)
            .append($name)
            .append($ntries);
        
        $('#possible-answers').append($answer);
        
        $answer.draggable({
            revert: "invalid"
        });
    }
}
















