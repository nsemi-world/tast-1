var quizzData = null;
var quizzStarted = false;

function initQuizz() {
    updateQuizz();
    configureUserNotificationArea();
    $('#top3-controls #number-of-tops').on('change', function (event) {
        getUserScoreCorrectAnswers().text('0');
        getUserScoreTotalAttempts().text('0');
        updateQuizz();
    });

    $('#top3-options li').on('click', function (event) {
        event.preventDefault();
        activateOption($(this));
        updateQuizz();
    });
    $('#top3-criteria li').on('click', function (event) {
        event.preventDefault();
        activateCriteria($(this));
        updateQuizz();
    });

    getMenuCollapseButton().on('click', function (event) {
        event.preventDefault();
        getMenuOptions().slideToggle(1000);
        getMenuCriteria().slideToggle(1000);
    });
    
}

function configureUserNotificationArea() {
    centerPercentage();
    $(window).on('resize', function(event){
        centerPercentage();
    });
}

function centerPercentage() {
    $('#percentage-indicator .percentage').position({
        my: 'center',
        at: 'center',
        of: '#percentage-indicator'
    });
    $('#percentage-indicator').position({
        my: 'center',
        at: 'center',
        of: '#user-notification-area'
    });
}

/** 
 * ---------------------------------------
 * Accessors to Quizz dom elements
 * ------------------------------------------ 
 */
function getQuizz() {
    return $('#top3-quizz');
}

function getQuizzTitle() {
    return $('#top3-quizz-title');
}

function getQuizzMenu() {
    return $('#top3-quizz #top3-menu');
}

function getMenuCollapseButton() {
    return $('#top3-controls #collapse-menu-button');
}

function getUserScore() {
    return $('#user-score');
}

function getUserBadge() {
    return $('#score-badge');
}

function getUserScoreCorrectAnswers() {
    return $('#score-badge .ncorrect');
}

function getUserScoreTotalAnswers() {
    return $('#score-badge .ntotal');
}

function getUserScoreTotalAttempts() {
    return $('#score-badge .ntries');
}

function getUserScorePercentage() {
    return $('#score-badge .percentage, #user-notification-area .percentage');
}

function getMenuControls() {
    return $('#top3-menu #top3-controls ');
}

function getMenuTopValue() {
    return $('#top3-options #top-value');
}

function getNumberOfTopsSelector() {
    return $('#top3-controls #number-of-tops option:selected');
}

function getMenuOptions() {
    return $('#top3-menu #top3-options ');
}

function getMenuCriteria() {
    return $('#top3-menu #top3-criteria ');
}

function getCriteriaEmbarked() {
    return $('#top3-criteria #criteria-embarked');
}

function getCriteriaDisembarked() {
    return $('#top3-criteria #criteria-disembarked');
}

function getCriteriaDied() {
    return $('#top3-criteria #criteria-died');
}

function getUserAnswers() {
    return $('#user-answers');
}

function getPossibleAnswers() {
    return $('#possible-answers');
}

function getActiveOption() {
    return $('#top3-options li.active');
}

function getActiveCriteria() {
    return $('#top3-criteria li.active');
}

function getQuizzBody() {
    return $('#top3-quizz-body .row');
}

/** 
 * ---------------------------------------
 * Activate Options and Criteria
 * ------------------------------------------ 
 */
function activateOption($option) {
    getActiveOption().removeClass('active');
    $option.addClass('active');
}

function activateCriteria($criteria) {
    getActiveCriteria().removeClass('active');
    $criteria.addClass('active');
}


/**
 * Update quizz consists by restart the quizz configuration according 
 * to user input. This consists of the following steps:
 *  1 - Disable the quizz to disable more user inputs
 *  2 - Update the quizz question, and prepare user answers area
 *  3 - Call the server to fetch the quizz data
 */
function updateQuizz() {
    getQuizzTitle().html(createQuizzQuestion());   getUserScoreTotalAnswers().text(getNumberOfTopsSelector().val());
    getUserAnswers().html(getQuizzAnswers());
    createDroppables();
    cleanSum();
    loadAnswersFromServer();
}

function cleanSum() {
    $('#sum').text(0);
    $('#sum').data('sum', 0);
}

function enableQuizzMenu() {
    getMenuCollapseButton().click();
}

function disableQuizzMenu() {
    getMenuCollapseButton().click();
}

/**
 * Create droppables from users answers placeholders 
 * with the following configuration:
 *  1 - Accetps: any element with class .draggable
 *  2 - Tolerance: touch
 *  3 - Classes: defaults
 *  4 - On drop: evaluates draggable rank against droppable rank
 */
function createDroppables() {
    // Make Answers droppables
    $('#user-answers div').droppable({
        accepts: '.draggable',
        //tolerance: "fit",
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function (event, ui) {
            if (!quizzStarted) {
                disableQuizzMenu();
                quizzStarted = true;
            }
            onDrop($(this), ui.draggable)
        }
    });
}

function onDrop($droppable, $draggable) {
    var evaluation = evaluateAnswer($droppable.data('rank'), $draggable.data('rank'));

    if (evaluation == true) {
        updateDraggableOnSuccess($droppable, $draggable);
    } else {
        updateDraggableOnFail($droppable, $draggable);
    }

    updateScore(evaluation, $droppable.data('rank'));
    updateAttempts($draggable);
}

function autoPosition($droppable, $draggable) {
    $(window).on('resize', function (event) {
        $draggable.position({
            my: 'left',
            at: 'right+10',
            of: $droppable.find('span')
        });
    });
}

function disableDragAndDrop($droppable, $draggable) {
    $droppable.droppable("disable");
    $draggable.draggable("disable");
}

function updateDraggableOnSuccess($droppable, $draggable) {
    $draggable
        .animate({
            color: 'green'
        }, 1000)
        .draggable("option", 'revert', false)
        .position({
            my: 'left',
            at: 'right+10',
            of: $droppable.find('span')
        });

    disableDragAndDrop($droppable, $draggable);
    autoPosition($droppable, $draggable);
    
    var value = findValueWithRank($droppable.data('rank'));
    value = toNumeral(value);
    
    $droppable
        .append($('<span class="float-right badge mt-1"></span').text(value));
    $draggable.find('.name').show();
}

function findValueWithRank(rank) {
    return quizzData[rank-1].total;
}

function toNumeral(value) {
    return numeral(value).format('0,0');    
}

function updateDraggableOnFail($droppable, $draggable) {
    $draggable.animate({
        color: 'red'
    }, 1000);
    $draggable.draggable("option", "revert", true);
}

function evaluateAnswer(rank1, rank2) {
    return rank1 === rank2;
}

function updateAttempts($draggable) {
    var $ntries = $draggable.find('.ntries');
    var ntriesValue = parseInt($ntries.text());
    $ntries.text(++ntriesValue);
}

function updateScore(doit, rank) {
    var $attempts = getUserScoreTotalAttempts();
    var $correct = getUserScoreCorrectAnswers();
    var $total = getUserScoreTotalAnswers();
    var $percentage = getUserScorePercentage();

    var attemptsValue = parseInt($attempts.text());
    var correctValue = parseInt($correct.text());
    var totalValue = parseInt($total.text());


    $attempts.text(++attemptsValue);

    if (doit) {
        $correct.text(++correctValue);
        
        var sum = parseInt(getSum().data('sum'));
        sum += parseInt(findValueWithRank(rank));
        getSum().text(toNumeral(sum)).data('sum', sum);
        
        if ($correct.text() == $total.text()) {
            addWinActions();
            quizzStarted = false;
            enableQuizzMenu();
        }
    }

    $percentage.text(Math.round(100 * correctValue / attemptsValue) + "%");
}


function addWinActions() {
    // Add Like button
    $('#central').removeClass('bg-light').addClass('bg-transparent');
    getUserNotificationArea().removeClass('bg-transparent').addClass('bg-light');
}

function getUserNotificationArea() {
    return $('#user-notification-area');
}

function createQuizzQuestion() {
    var $option = getActiveOption();
    var $criteria = getActiveCriteria();
    var question = createQuestion($option.attr('id'), $criteria.attr('id'));
    return question;
}

function createQuestion(option, criteria) {
    if (option == 'option-top-countries') {
        if (criteria == 'criteria-embarked') {
            return 'Which country had more people embarked from Afrika?';
        } else if (criteria == 'criteria-disembarked') {
            return 'Which country had more people disembarked in Europe or in the Americas?';
        } else if (criteria == 'criteria-died') {
            return 'Which country had more people dying during the Middle Passage?';
        }
    } else if (option == 'option-top-owners') {
        if (criteria == 'criteria-embarked') {
            return 'Which ship owners had more people embarked from Afrika?';
        } else if (criteria == 'criteria-disembarked') {
            return 'Which ship owners had more people disembarked in Europe or in the Americas?';
        } else if (criteria == 'criteria-died') {
            return 'Which ship owners had more people dead during the Middle Passage?';
        }
    } else if (option == 'option-top-captains') {
        if (criteria == 'criteria-embarked') {
            return 'Which ship captains had more people embarked from Afrika?';
        } else if (criteria == 'criteria-disembarked') {
            return 'Which ship captains had more people disembarked in Europe or in the Americas?';
        } else if (criteria == 'criteria-died') {
            return 'Which ship captains had more people dead during the Middle Passage?';
        }
    } else if (option == 'option-top-ships') {
        if (criteria == 'criteria-embarked') {
            return 'Which ships had more people embarked from Afrika?';
        } else if (criteria == 'criteria-disembarked') {
            return 'Which ship had more people disembarked in Europe or in the Americas?';
        } else if (criteria == 'criteria-died') {
            return 'Which ship had more people dead during the Middle Passage?';
        }
    }

}

function getQuizzAnswers(option, criteria) {
    var numberOfTops = parseInt($('#number-of-tops option:selected').text());
    var html = '';
    for (var i = 1; i <= numberOfTops; i++) {
        html += '<div class="border-bottom" data-rank="' + i + '">' + i + '.' + ' ';
        html += '<span>' + '</span>'
        html += '</div>';
    }

    return html;
}





function loadAnswersFromServer() {
    var min = parseInt(getNumberOfTopsSelector().val());
    var type = getActiveOption().text();
    var criteria = getActiveCriteria().text();
    loadQuizzData(min, type, criteria);
}

function loadQuizzData(min, type, criteria) {
    $.ajax({
        url: 'php/getTops.php',
        data: {
            min: min,
            type: type,
            criteria: criteria
        },
        success: function (data) {
            quizzData = JSON.parse(data);
            createPossibleAnswers(quizzData, min);
        },
        error: function () {
            alert("Error loading tops");
        }
    });
}


function createPossibleAnswers(data, min) {
    var copyData = data.slice(0);
    putUIElements(configureAnswers(copyData, min));
}

function showQuizz() {
    $('#explore').show();
}

function hideQuizz() {
    $('#explore').hide();
}

function configureAnswers(data, min) {
    console.log(data);
    $.each(data, function (key, value) {
        value['rank'] = (key + 1);
    });

    //quizzData.sort(randomize);    
    return shuffle(data);
}

// Thanks to: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array (CoolAJ86 https://stackoverflow.com/users/151312)
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function putUIElements(answers) {
    $('#possible-answers').empty();
    $.each(answers, function (key, value) {
        appendButtonFor(value);
    });
    getSum().data('sum', 0);
}

function getSum() {
    return $('#sum');
}

function appendButtonFor(countryData) {
    if (countryData.iso2) {
        var countryCode = countryData.iso2.toLowerCase();
        var $flag = $('<img></img')
            .addClass('flag flag-' + countryCode)
            .attr('src', 'img/blank.gif')
            .attr('alt', countryData.name + ' flag')
            .attr('title', countryData.name);

        var $name = $('<span class="name"></span>')
            .html('<b>' + countryData.name + '</b>');

        var $flagAndName = $('<span class="pr-1 pl-1"></span>')
            .append($flag)
            .append($name);
        //$name.hide();

        var $ntriesHolder = $('<small class="border-left  pl-1  text-muted"></small>');
        var $ntries = $('<span class="ntries"></span>').text('0');
        var $x = $('<span>x</span>');

        $ntriesHolder.append($ntries).append($x);

        var $answer = $('<div></div>')
            .addClass('draggable badge')
            .addClass('container-fluid')
            .addClass('w-100 m-0 pl-2 text-left')
            .data('rank', countryData.rank)
            .append($flagAndName)
            .append($ntriesHolder);

        getPossibleAnswers().append($answer);

        $answer.draggable({
            revert: "invalid"
        });
    }
}
