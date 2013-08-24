// Tabooze for iPhone and Android
//
// COPYRIGHT 2013 by Aleks Kamko, Asif Dhanani, Frank Lu, Samir Makhani, and Sean Scofield
//
// This file contains all of the javascript needed for the Tabooze game.
// In this order, this file contains the following:
//
//     1. A function that makes sure the html windows auto-scale correctly
//
//     2. Necessary global functions that we use multiple times
//
//     3. Onload functions for each of our html pages. Basically, each one of
//            our html pages has in its <body> tag an onload method that calls
//            a function in this file with the same name as that html file.
//            That function runs all of the javascript necessary for that page.


/////////// THE CODE ///////////

var nextWindow,
globals = ['numTeams', 'team1', 'team2', 'team1Score', 'team2Score',
                    'points', 'curTeam', 'curRound', 'time', 'bonRounds',
                    'bonusList', 'wordList', 'bonusWords', 'newWords'];

//This is le javascript that's SUPPOSED to take care of scaling. Still testing
// it.
$(document).ready(function() {
    var body = $('body'); //Cache this for performance

    var setBodyScale = function() {
        var scaleSource = body.width(),
            scaleFactor = 0.35,
            maxScale = 600,
            minScale = 30; //Tweak these values to taste

        var fontSize = scaleSource * scaleFactor; //Multiply the width of the
        //body by the scaling factor:

        if (fontSize > maxScale) fontSize = maxScale;
        if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and
        // maximums

        $('body').css('font-size', fontSize + '%');
    };

    $(window).resize(function() {
        setBodyScale();
    });

    //Fire it when the page first loads:
    setBodyScale();
});

$('#home').click(function () {
    if (window.confirm('Returning to the main menu will end your current session. Are you sure?')) {
        window.location = 'index.html';
    }
});

$('#tutorial').click(function () {
    window.location = 'tutorial.html';
});

function initGlobals() {
    for (i=0; i < globals.length; i++) {
        eval(globals[i] + ' = ""');
    }
}

function loadGlobals() {
    numTeams = parseFloat(localStorage.getItem('numTeams')),
    team1 = localStorage.getItem('team1'),
    team2 = localStorage.getItem('team2'),
    team1Score = parseFloat(localStorage.getItem('1Score')),
    team2Score = parseFloat(localStorage.getItem('2Score')),
    points = parseFloat(localStorage.getItem('points')),
    curTeam = parseFloat(localStorage.getItem('curTeam')),
    curRound = parseFloat(localStorage.getItem('curRound')),
    time = localStorage.getItem('timeLimit'),
    bonRounds = localStorage.getObj('bonRounds'),
    bonusList = localStorage.getObj('bonusList'),
    wordList = localStorage.getObj('wordList'),
    newWords = localStorage.getObj('newWords'),
    bonRoundDict = localStorage.getObj('bonRoundDict');

    for (i=2; i < numTeams; i++) {
        eval('team' + String(i+1) + ' = "' + localStorage.getItem('team' +
                String(i+1)) + '"');
        eval('team' + String(i+1) + 'Score = "' + localStorage.getItem('team' +
                String(i+1)) + 'Score"');
    }
}

function setGlobals() {
    for (i=0; i<globals.length; i++) {
        localStorage.setItem(globals[i], eval('globals[i]'));
    }
}

// These functions allow us to store objects in localStorage
Storage.prototype.setObj = function(name, object) {
    localStorage.setItem(name, JSON.stringify(object));
};

Storage.prototype.getObj = function(name) {
    return JSON.parse(localStorage.getItem(name));
};

// This function lets us pick a random property/key from an object.
// It's useful for selecting a random word from our list

function pickRandomKey(obj) {
    var keys = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            keys.push(prop);
        }
    }
    return keys[keys.length * Math.random() << 0];
}

// function for decreasing progress bar width

function progress() {
    width -= incrementVal;
    $('#progressBar').css('width', width);
}

// Remove team button. Only removes this team if there are already more than
// two teams. This also updates each remaining team's placeholder and id.

function removeTeam() {
    numTeams = parseFloat(localStorage.getItem('numTeams'));
    if (numTeams > 2) {
        $(this).closest('tr').remove();
        var tableData = $('#menuTable')[0];
        numTeams -= 1;
        localStorage.setItem('numTeams', numTeams);
        for (i = 0; i < numTeams; i++) {
            var textInputBox = tableData.rows[i].cells[0].children[0];
            textInputBox.setAttribute('id', String(i + 1));
            textInputBox.setAttribute('placeholder', 'Team ' + String(i + 1));

            var removeButton = tableData.rows[i].cells[1].children[0];
            removeButton.setAttribute('id', 'team' + String(i + 1));
        }
    }
}

// Adds a new team when the add button is clicked ONLY if there are not
// four or more teams already existing

function addTeam() {
    loadGlobals();
    if (numTeams < 4) {
        numTeams += 1;
        localStorage.setItem('numTeams', numTeams);
        $('#menuTable > tbody > tr').eq(numTeams - 2).after('<tr>\
            <td>\
              <input id="' + String(numTeams) + '" placeholder="Team ' +
              String(numTeams) + '" type="text;">\
            </td>\
            <td>\
              <button type="submit" class="btn btn-success btn-small btn-pink" id="team'
              + String(numTeams) + '">-</button>\
            </td>\
          </tr>');

        $('#team' + String(numTeams)).click(removeTeam);
    }
}

// Iterates to the next team and returns that team number

function nextTeam(team) {
    loadGlobals();
    if (numTeams - team > 0) {
        team += 1;
    } else {
        team = 1;
    }
    return team;
}

function prevTeam(team) {
    loadGlobals();
    if (team > 1) {
        team -= 1;
    } else {
        team = numTeams;
    }
    return team;
}

function bonusRoundNext(teamNo, curRound) {
    var bonRoundDict = localStorage.getObj('bonRoundDict');
    if (teamNo == 1) {
        if (bonRoundDict[1].indexOf(curRound + 1) > -1) {
            return true;
        } else {
            return false;
        }
    } else if (bonRoundDict[teamNo].indexOf(curRound) > -1) {
        return true;
    } else {
        return false;
    }
}

function iterRound(round) {
    loadGlobals();
    if (round == numTeams) {
        return round + 1;
    }
    return round;
}

// Timer function controls the timer countdown

function timer() {
    var theTimer = $('#timer')[0],
    time = theTimer.innerHTML,
    colonIndex = time.indexOf(':'),
    minutes = parseInt(time.substring(0, colonIndex)),
    seconds = parseInt(time.slice(colonIndex + 1));
    if (seconds == 0) {
        if (minutes == 0) {
            time = '0:00';
            window.location = nextWindow;
            return
        } else {
            minutes = String(minutes - 1);
            seconds = '59';
        }
    } else {
        seconds -= 1;
        if (seconds < 10) {
            seconds = '0' + String(seconds);
        } else {
            seconds = String(seconds);
        }
    }
    theTimer.innerHTML = minutes + ':' + seconds;
}

// Here are our onload functions. Each one is named to correspond with it's
// respective html page.

function bonusRound() {
    loadGlobals();
	function startBonusRound() {
		window.location = 'Synonyms.html';
	}
    $('#p').html('Team ' + String(prevTeam(curTeam)) + ' (' + eval('team' +
                    String(prevTeam(curTeam))) + ') will have 60 seconds to ' +
                    'create synonyms for as many words as possible that team ' +
                    String(curTeam) + ' (' + eval('team' + String(curTeam))
                    + ') will be guessing.');
	$('#startbonus').click(startBonusRound);
}


function index() {

    // Clear all locally stored variables
    localStorage.clear();
    initGlobals();

    numTeams = 2;
    localStorage.setItem('numTeams', 2);

    // Store the list from data.json as a global var in localStorage
    var wordList = jQuery.extend({}, list);
    localStorage.setObj('wordList', wordList);
    localStorage.setObj('bonusList', bonus);

    $('#add').click(addTeam);
    $('#team1').click(removeTeam);
    $('#team2').click(removeTeam);

    // Store team names to local Storage, and switch to the gameOptions menu
    // when start button is clicked
    $('#start').click(function() {
        for (i = 0; i < numTeams; i++) {
            var name = $('#' + String(i + 1))[0].value;
            if (name) {
                localStorage.setItem('team' + String(i + 1), name);
            } else {
                localStorage.setItem('team' + String(i + 1), 'Team ' + String(i + 1));
            }
        }
        window.location = 'gameOptions.html';
    });
}


function startRound() {
    loadGlobals();
    $("#header").text("Team " + curTeam);
    $("#round").text("Round " + curRound);
    $('#continue').click(function() {
        window.location = 'gameplay.html';
    });
}


function gameOptions() {
    // Initialize number of rounds, number of bonus rounds, and time limit
    $('#time').val('3');
    $('#Rounds').val('5');
    $('#BonRounds').val('1');

    // When start button is pushed, we must store the game options we've selected
    // in global variables
    function chooseBonusRounds(numRounds, numBonRounds) {
    	var bonRoundDict = {},
        numTeams = localStorage.getItem('numTeams'),
        min = Math.min(numRounds, numBonRounds);
        for (i=0; i < numTeams; i++) {
            var bonRounds = [];
        	while (Object.keys(bonRounds).length < min) {
        		var x = Math.ceil(Math.random() * numRounds);
        		if (bonRounds.indexOf(x) < 0) {
                    bonRounds = bonRounds.concat(x);
        		}
        	}
            bonRoundDict[i+1] = bonRounds;
        }
    	return bonRoundDict;
    }

    $('#startGame').click(function() {
    	var numRounds = $("#Rounds").val(),
    	numBonRounds = parseFloat($("#BonRounds").val());

    	bonRoundDict = chooseBonusRounds(numRounds, numBonRounds);
        localStorage.setItem('numRounds', numRounds);
        localStorage.setItem('numBonRounds', numBonRounds);
        localStorage.setItem('timeLimit', $("#time").val());
        localStorage.setItem('curTeam', 1);
        localStorage.setItem('curRound', 1);
        localStorage.setObj('bonRoundDict', bonRoundDict);

        var numTeams = parseFloat(localStorage.getItem('numTeams'));
        for (i = 0; i < numTeams; i++) {
            localStorage.setItem(String(i + 1) + 'Score', 0);
        }
        if (bonRoundDict[1].indexOf(1) >= 0) {
        	window.location = 'Bonusround.html';
        } else {
        	 window.location = 'startRound.html';
        }
    });
}


function synonyms() {
	loadGlobals();
	newWords = {};
	$('#timer').html(String(time) + ':00');

    function pickWord() {
        word = pickRandomKey(bonusList);
        $('#word').html(word);
        delete bonusList[word];
        localStorage.setObj('bonusList', bonusList);
    }

    pickWord();
    nextWindow = 'bonusOver.html';
    window.setInterval(timer, 1000);

    function generateWord() {
    	var synonyms = [];
    	for (i=0; i < 5; i++) {
    		synonyms = synonyms.concat($('#' + String(i+1)).val());
    	}
    	newWords[word] = synonyms;
    	localStorage.setObj('newWords', newWords);
    	for (i=0; i < 5; i++) {
    		($('#' + String(i+1)).val(''));
    	}
	    pickWord();
    }

    $('#next').click(generateWord);
}


function gameplay() {
    loadGlobals();
    localStorage.setItem('points', '0');

    function newWord() {
        wordList = localStorage.getObj('wordList'),
        newWords = localStorage.getObj('newWords'),
        listToUseString = '';
        listToUse = '';
        if (newWords && Object.keys(newWords).length > 0) {
            listToUse = newWords;
            listToUseString = 'newWords';
        } else {
            listToUse = wordList;
            listToUseString = 'wordList';
        }
        word = pickRandomKey(listToUse);
        buzzWords = $('#buzzword_box').children();

        // Insert the word and it's synonyms into the html page
        $('#mainword').html(word);
        for (i = 0; i < buzzWords.length; i++) {
            buzzWords[i].textContent = listToUse[word][i];
        }

        // Every time we use a word, we want to delete it from the list
        // so it is not used again the current game
        delete listToUse[word];
        localStorage.setObj(listToUseString, listToUse);
    }

    newWord();

    // Initialize the timer with the chosen time limit value
    $('#timer').html(localStorage.getItem('timeLimit') + ":00");
    nextWindow = 'timeUp.html';
    window.setInterval(timer, 1000);

    // This tells the progress bar to decrease by the appropriate amount
    // every 250 milliseconds
    var progressBar = $('#progressBar');
    width = progressBar.width(),
    time = localStorage.getItem('timeLimit') * 60;
    incrementVal = width / (4 * time);
    window.setInterval(progress, 250);

    // if "correct" button pushed, grab a new word and give the current
    // team a point
    $('#correct').click(newWord);
    $('#correct').click(function() {
        curTeam = localStorage.getItem('curTeam');
        localStorage.setItem('points', parseFloat(localStorage.getItem('points')) + 1);
        localStorage.setItem(curTeam + 'Score', parseFloat(localStorage.getItem(curTeam + 'Score')) + 1);
    });

    // if "tabooze" button pushed, grab a new word and take a point away
    // from the current team
    $('#tabooze').click(newWord);
    $('#tabooze').click(function() {
        curTeam = localStorage.getItem('curTeam');
        localStorage.setItem('points', parseFloat(localStorage.getItem('points')) - 1);
        localStorage.setItem(curTeam + 'Score', parseFloat(localStorage.getItem(curTeam + 'Score')) - 1);
    })
}


function timeUp() {
    loadGlobals();
    localStorage.setObj('newWords', {});

    $('#title').html('Team ' + curTeam + ' earned ' + points + ' points');
    $('#1').html(team1Score + ' points');
    $('#2').html(team2Score + ' points');

    if (numTeams > 2) {
        for (i = 2; i < numTeams; i++) {
            eval('team' + String(i + 1) + 'Score = localStorage.getItem("' + String(i + 1) + 'Score");');
            $('tr#teamNames').append('<td>\
	            						<p><u>Team ' + String(i + 1) + '</u></p>\
	          						 </td>');

            $('tr#teamScores').append('<td>\
							            <p id="' + String(i + 1) + '" style="font-size:100%;"></p>\
							          </td>');

            $('#' + String(i + 1)).html(eval('team' + String(i + 1) + 'Score') + ' points');
        }
        $('#continueRow').attr('colspan', numTeams);
    }

    if (bonusRoundNext(nextTeam(curTeam), curRound)) {
        $('#bonusround').html('Bonus round up next. Do not pass the iPhone to' +
                                ' the next team yet.');
    }

    $('#continue').click(function() {
        curTeam = nextTeam(curTeam);
        localStorage.setItem('curTeam', curTeam);
        // If the next team up is team 1, we must be starting a new round
        if (curTeam == 1) {
            curRound += 1
            localStorage.setItem('curRound', curRound);
        }
        if (curRound > parseFloat(localStorage.getItem('numRounds'))) {
            window.location = 'gameOver.html';
        } else if (bonRoundDict[curTeam].indexOf(curRound) > -1) {
        		window.location = 'Bonusround.html';
        	} else {
                window.location = 'startRound.html';
            }
    });


}


function pauseMenu() {
    $('#mainMenu').click(function() {
        window.location = "index.html";
    })
}


function gameOver() {
    loadGlobals();
    teamScores = {};
    for (i=0; i < numTeams; i++) {
        eval('teamScores[' + String(i+1) + '] = localStorage.getItem(' +
                String(i+1) + 'Score)');
    }
}


function bonusOver() {
    loadGlobals();

    for (i=0; i < numTeams; i++) {
        eval('team' + String(i+1) + 'Name = localStorage.getItem("team' +
                String(i+1) + '")');
    }
    $('#p').html('Pass the device to team ' + String(curTeam) + '.');
    $('#continue').click(function() {
                            window.location = 'startRound.html';
                        });
}

function gameOver() {
    loadGlobals();
    function winner() {
        var highestScore = team1Score,
        winner = 1;
        for (i=1; i < numTeams; i++) {
            var thisScore = eval('team' + String(i+1) + 'Score')
            if (thisScore > highestScore) {
                highestScore = thisScore;
                winner = i+1;
            }
        }
        return [winner, highestScore];
    }

    var theWinner = winner();
    $('#title').html('Team ' + String(theWinner[0]) + ' (' + eval('team' +
        String(theWinner[0])) + ') wins with ' + String(theWinner[1]) +
        ' points.');
}