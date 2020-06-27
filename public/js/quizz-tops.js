var quizzData = null;
var quizzStarted = false;
var stages = {
    init: 0,
    work: 1,
    end: 2
};

function initQuizz() {
    
    configureState(stages.init);

    getForm().on('submit', function(event){
        //alert('ON SUMBIT');
        event.preventDefault();
        event.stopPropagation();
        var validated = validateForm();
        if(validated) {
            startQuizz(getTypeValue(), 
                       getCategoryValue(), 
                       getCriteriaValue());
        }
    });
    
    getType().on('change', function(event) {
        event.preventDefault();
        updateTitle(getTypeValue(), getCategoryValue(), getCriteriaValue());
    });
    getCategory().on('change', function(event) {
        event.preventDefault();
        updateTitle(getTypeValue(), getCategoryValue(), getCriteriaValue());
    });
    getCriteria().on('change', function(event) {
        event.preventDefault();
        updateTitle(getTypeValue(), getCategoryValue(), getCriteriaValue());
    });
    
    $('#gotomenu').on('click', function(event){
        event.preventDefault();
        saveUserResults();
        resetQuizz();
        configureState(stages.end);
    });
    
    updateTitle(getTypeValue(), getCategoryValue(), getCriteriaValue());
    validateForm();
}

/** 
 * ---------------------------------------
 * Accessors to Quizz dom elements
 * ------------------------------------------ 
 */
// Quizz
function getQuizz() {
    return $('#top-quizz');
}
// Header
function getHeader() {
    return $('#quizz-header');
}
// Title
function getTitle() {
    return $('#quizz-title');
}
// Score
function getScore() {
    return $('#score');
}
// Score badge
function getScoreBadge() {
    return $('#score-badge');
}
// Correct Answers
function getCorrectAnswers() {
    return $('#score-badge .ncorrect');
}
function getCorrectAnswersValue() {
    return parseInt(getCorrectAnswers().text());
}
function setCorrectAnswers(number) {
    getCorrectAnswers().text(number);
}

// Total answers
function getTotalAnswers() {
    return $('#score-badge .ntotal');
}
function getTotalAnswersValue() {
    return parseInt(getTotalAnswers().text());
}
function setTotalAnswers(number) {
    getTotalAnswers().text(number);
}
// Total attempts
function getTotalAttempts() {
    return $('#score-badge .ntries');
}
function getTotalAttemptsValue() {
    return parseInt(getTotalAttempts().text());
}
function setTotalAttempts(number) {
    getTotalAttempts().text(number);
}

// Percentage
function getPercentage() {
    return $('.percentage');
}
function getPercentageValue() {
    return parseInt(getPercentage().text());
}
function setPercentage(number) {
    getPercentage().text(number);
}

// Facebook Recommend button
function getFacebookRecommendButton() {
    return $('#fb-like span');
}
// Body
function getBody() {
    return $('#quizz-body');
}
// Menu
function getMenu() {
    return $('#quizz-menu');
}
// Form
function getForm() {
    return $('#quizz-form');
}
// Type
function getType() {
    return $('#top-type');
}
// Type value
function getTypeValue() {
    return parseInt(getType().val());
}
// Category
function getCategory() {
    return $('#top-category');
}
// Selected Category
function getCategorySelected() {
    return $('#top-category option:selected');
}
// Category Value
function getCategoryValue() {
    return parseInt(getCategorySelected().val());
}
// Criteria
function getCriteria() {
    return $('#top-criteria');
}
// Selected Criteria
function getCriteriaSelected() {
    return $('#top-criteria option:selected');
}
// Criteria Value
function getCriteriaValue() {
    return parseInt(getCriteriaSelected().val());
}
// Form Submit Button 
function getSubmitButton() {
    return $('#quizz-form-submit');
}
// Disable Form Submit Buttton
function disableSubmitButton() {
    getSubmitButton().prop('disabled', true);
}
// Enable Form Submit Button
function enableSubmitButton() {
    getSubmitButton().prop('disabled', false);
}


// Working Area
function getWorkingArea() {
    return $('#working-area');
}
// Answers
function getUserArea() {
    return $('#user-area');
}
// User Answers
function getUserAnswers() {
    return $('#user-answers');
}
// Sum
function getSum() {
    return $('#sum');
}
// Possible Answers
function getPossibleAnswers() {
    return $('#possible-answers');
}


/******************************************
Form Validation
*******************************************/
function validateForm() {
    var $type = getType();
    if(parseInt($type.val()) <= 0){
        $type.addClass('invalid');
        return false;
    }
    else {
        $type.removeClass('invalid');
        return true;
    }
}

/********************************************
 * Quizz States
 ********************************************/
function configureState(stage) {
    if(stage === stages.init) {
        getWorkingArea().hide();
        getMenu().show();
    }

    else if(stage === stages.work) {
        getMenu().hide();
        getWorkingArea().show();
    }
    
    else if(stage === stages.end) {
        getWorkingArea().hide();
        getMenu().show();
    }
}

function resetQuizz() {
    setTotalAttempts(0);
    setTotalAnswers(0);
    setCorrectAnswers(0);
    setPercentage(0);
    getUserAnswers().empty();
    getPossibleAnswers().empty();
    $('#gotomenu').addClass('btn-outline-secondary');
    getUserArea().removeClass('bg-transparent').addClass('bg-light');
}


function startQuizz(type, category, criteria) {
    // Show user answers and call server for responses
    configureState(stages.work);
    updateTitle(type, category, criteria);
    updateWorkingArea(type, category, criteria);
    loadAnswerFromServer(type, category, criteria);
}

// TODO: Better depend on value or element id?
function updateTitle(type, category, criteria) {
    var categoryId = getCategorySelected().attr('id');
    var criteriaId = getCriteriaSelected().attr('id');
    var question = createQuestion(categoryId, criteriaId);
    getTitle().text(question);
}

function updateWorkingArea(type, category, criteria) {
    var answerList = createUserAnswers(type, category, criteria);
    getUserAnswers().html(answerList);
    getTotalAnswers().text(type);
    createDroppables();
    cleanSum();
}

function cleanSum() {
    $('#sum').text(0);
    $('#sum').data('sum', 0);
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
    $('#user-answers .droppable').droppable({
        accepts: '.draggable',
        //tolerance: "fit",
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function (event, ui) {
            onDrop($(this), ui.draggable)
        }
    });
}

function onDrop($droppable, $draggable) {
    var evaluation = evaluateAnswer($droppable.data('rank'), $draggable.data('rank'));

    if (evaluation === true) {
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
    var $attempts = $draggable.find('.ntries');
    var value = parseInt($attempts.text());
    $attempts.text(value + 1);
}

function updateScore(doit, rank) {
    var correctValue = parseInt(getCorrectAnswersValue());
    var totalValue = parseInt(getTotalAnswersValue());
    var attemptsValue = parseInt(getTotalAttemptsValue());

    getTotalAttempts().text(++attemptsValue);

    if (doit) {
        getCorrectAnswers().text(++correctValue);
        
        var sum = parseInt(getSum().data('sum'));
        sum += parseInt(findValueWithRank(rank));
        getSum().text(toNumeral(sum)).data('sum', sum);
        
        if (correctValue === totalValue) {
            addWinActions();
            quizzStarted = false;
        }
    }

    getPercentage()
        .text(Math.round(100 * correctValue / attemptsValue) + "%");
}


function addWinActions() {
    // Add Like button
    getUserArea().removeClass('bg-light').addClass('bg-transparent');
    $('#gotomenu').removeClass('btn-outline-secondary');
    $('#gotomenu').addClass('btn-success');
}

function getUserNotificationArea() {
    return $('#user-notification-area');
}

function createQuestion(optionId, criteriaId) {
    if (optionId === 'option-top-countries') {
        if (criteriaId === 'criteria-embarked') {
            return 'Which country had more people embarked from Afrika?';
        } else if (criteriaId === 'criteria-disembarked') {
            return 'Which country had more people disembarked in Europe or in the Americas?';
        } else if (criteriaId === 'criteria-died') {
            return 'Which country had more people dying during the Middle Passage?';
        }
    } else if (optionId === 'option-top-owners') {
        if (criteria === 'criteria-embarked') {
            return 'Which ship owners had more people embarked from Afrika?';
        } else if (criteriaId === 'criteria-disembarked') {
            return 'Which ship owners had more people disembarked in Europe or in the Americas?';
        } else if (criteriaId === 'criteria-died') {
            return 'Which ship owners had more people dead during the Middle Passage?';
        }
    } else if (optionId === 'option-top-captains') {
        if (criteriaId === 'criteria-embarked') {
            return 'Which ship captains had more people embarked from Afrika?';
        } else if (criteriaId === 'criteria-disembarked') {
            return 'Which ship captains had more people disembarked in Europe or in the Americas?';
        } else if (criteriaId === 'criteria-died') {
            return 'Which ship captains had more people dead during the Middle Passage?';
        }
    } else if (optionId === 'option-top-ships') {
        if (criteriaId === 'criteria-embarked') {
            return 'Which ships had more people embarked from Afrika?';
        } else if (criteriaId === 'criteria-disembarked') {
            return 'Which ship had more people disembarked in Europe or in the Americas?';
        } else if (criteriaId === 'criteria-died') {
            return 'Which ship had more people dead during the Middle Passage?';
        }
    }

}

function createUserAnswers(type, option, criteria) {
    var numberOfTops = parseInt(type);
    var html = '';
    for (var i = 1; i <= numberOfTops; i++) {
        html += '<div class="border-bottom droppable" data-rank="' + i + '">' + i + '.' + ' ';
        html += '<span>' + '</span>'
        html += '</div>';
    }

    return html;
}


function loadAnswerFromServer(min, type, criteria) {
    $.ajax({
        url: getDomain() + 'ClientApi/getTops',
        type: 'POST',
        data: {
            min: min,
            type: type,
            criteria: criteria
        },
        success: function (data) {
            quizzData = data;
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

        var $flagAndName = $('<span class="text-secondary"></span>')
            .append($flag)
            .append($name);
        //$name.hide();

        var $ntriesHolder = $('<small class="pl-1  text-muted"></small>');
        var $ntries = $('<span class="ntries"></span>').text('0');
        var $x = $('<span>x</span>');

        $ntriesHolder.append($ntries).append($x);

        var $answer = $('<div></div>')
            .addClass('draggable badge')
            .addClass('container-fluid')
            .addClass('w-50 m-0 text-left text-truncate d-inline-block')
            .data('rank', countryData.rank)
            .append($flagAndName)
            .append($ntriesHolder);

        getPossibleAnswers().append($answer);

        $answer.draggable({
            revert: "invalid"
        });
    }
}

function saveUserResults() {
    
}
