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


/////////// THE CODE ////////////


//This is le javascript that's SUPPOSED to take care of scaling. Still testing it. 
$( document ).ready( function() {
            var $body = $('body'); //Cache this for performance

            var setBodyScale = function() {
                var scaleSource = $body.width(),
                    scaleFactor = 0.35,                     
                    maxScale = 600,
                    minScale = 30; //Tweak these values to taste

                var fontSize = scaleSource * scaleFactor; //Multiply the width of the body by the scaling factor:

                if (fontSize > maxScale) fontSize = maxScale;
                if (fontSize < minScale) fontSize = minScale; //Enforce the minimum and maximums

                $('body').css('font-size', fontSize + '%');
            }

            $(window).resize(function(){
                setBodyScale();
            });

            //Fire it when the page first loads:
            setBodyScale();
        });

// These functions allow us to store objects in localStorage
Storage.prototype.setObj = function (name, object) {
	localStorage.setItem(name, JSON.stringify(object));
}

Storage.prototype.getObj = function (name) {
	return JSON.parse(localStorage.getItem(name));
}


// This function lets us pick a random property/key from an object.
// It's useful for selecting a random word from our list
function pickRandomKey(obj) {

var keys = [];
for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
        keys.push(prop);
    }
}

return keys[ keys.length * Math.random() << 0 ];

}

// function for decreasing progress bar width
function progress() {
		width -= incrementVal;
		$('#progressBar').css("width", width);
}

// Remove team button. Only removes this team if there are already more than
// two teams. This also updates each remaining team's placeholder and id.
function removeTeam() {
	var numTeams = parseFloat(localStorage.getItem('numTeams'));
	if (numTeams > 2) {
		$(this).closest('tr').remove();
		var tableData = $('#menuTable')[0];
		numTeams -= 1;
		localStorage.setItem('numTeams', numTeams);
		for (i = 0; i < numTeams; i++) {
			var textInputBox = tableData.rows[i].cells[0].children[0];
			textInputBox.setAttribute('id', String(i+1));
			textInputBox.setAttribute('placeholder', 'Team ' + String(i+1));
			var removeButton = tableData.rows[i].cells[1].children[0];
			removeButton.setAttribute('id', 'team' + String(i+1));
	}
}
}

// Adds a new team when the add button is clicked ONLY if there are not
// four or more teams already existing
function addTeam() {
	var numTeams = parseFloat(localStorage.getItem('numTeams'));
	if (numTeams < 4) {
		numTeams += 1;
		localStorage.setItem('numTeams', numTeams);
		$('#menuTable > tbody > tr').eq(numTeams-2).after('<tr>\
            <td>\
              <input id="' + String(numTeams) + '" placeholder="Team ' + String(numTeams) + '" type="text;">\
            </td>\
            <td>\
              <button type="submit" class="btn btn-success btn-small" id="team' + String(numTeams) + '">-</button>\
            </td>\
          </tr>');

		$('#team' + String(numTeams)).click(removeTeam);
		}
	}

// Iterates to the next team and returns that team number
function nextTeam(team) {
	var numTeams = parseFloat(localStorage.getItem('numTeams'));
	if (numTeams - team > 0) {
		team += 1;
		return team;
	} else {
		team = 1;
		return team;
	}
}

// Timer function controls the timer countdown
function timer() {
 	var timer = $("#timer")[0];
 	var time = timer.innerHTML,
 	colonIndex = time.indexOf(':'),
 	minutes = parseInt(time.substring(0, colonIndex)),
 	seconds = parseInt(time.slice(colonIndex + 1));
 	if (seconds == 0) {
 		if (minutes == 0) {
 			time = '0:00';
 			window.location = "timeUp.html";
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
 	timer.innerHTML = minutes + ':' + seconds;
}

// pauses the game
$('#help').click(function () {
					window.location = "pauseMenu.html";
					localStorage.setItem('')
});

// Here are our onload functions. Each one is named to correspond with it's 
// respective html page.

function bonusRound() {
	window.setInterval(timer, 1000);
}


function index() {

	// Clear all locally stored variables
	localStorage.clear();

	numTeams = 2;
	localStorage.setItem('numTeams', 2);

	// Store the list from data.json as a global var in localStorage
	var wordList = jQuery.extend({}, list);
	localStorage.setObj('wordList', wordList);

	$('#add').click(addTeam);

	$('#team1').click(removeTeam);
	$('#team2').click(removeTeam);
	
	// Store team names to local Storage, and switch to the gameOptions menu 
	// when start button is clicked
	$('#start').click(function () {
						for (i=0; i<numTeams; i++) {
							var name = $('#' + String(i+1))[0].value;
							if (name) {
								localStorage.setItem('team' + String(i+1), name);
							} else {
								localStorage.setItem('team' + String(i+1), 'Team ' + String(i+1));
							}
						}

						window.location = 'gameOptions.html';
					});
}

function startRound() {
	var curTeam = localStorage.getItem('curTeam');
	var curRound = localStorage.getItem('curRound');
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

	$('#startGame').click(function () {
							localStorage.setItem('numRounds', $("#Rounds").val());
							localStorage.setItem('numBonRounds', $("#BonRounds").val());
							localStorage.setItem('timeLimit', $("#time").val());
							localStorage.setItem('curTeam', 1);
							localStorage.setItem('curRound', 1);

							numTeams = parseFloat(localStorage.getItem('numTeams'));
							for (i=0; i < numTeams; i++) {
								localStorage.setItem(String(i+1) + 'Score', 0);
							}

							window.location = 'startRound.html';
							});
}


function mytaboob() {

	var progressBar = $('#progressBar'),
	width = progressBar.width(),
	incrementVal = width / 120;
	window.setInterval(progress, 500);
	
	function progress() {
		width = progressBar.width();
		$('#progressBar').css("width", width - incrementVal);
}

}

function synonyms() {
	window.setInterval(timer, 1000);
}

function gameplay() {
	var wordList = localStorage.getObj('wordList');
	localStorage.setItem('points', '0');
	
	function newWord() {
		wordList = localStorage.getObj('wordList');
		word = pickRandomKey(wordList);
		buzzWords = $('#buzzword_box').children();

		// Insert the word and it's synonyms into the html page
		$('#mainword').html(word);
		for (i=0; i<buzzWords.length; i++) {
			buzzWords[i].textContent = wordList[word][i];
		}

		// Every time we use a word, we want to delete it from the list
		// so it is not used again the current game
		delete wordList[word];
		localStorage.setObj('wordList', wordList);
	}

	newWord();

	// Initialize the timer with the chosen time limit value
	$('#timer').html("localStorage.getItem('timeLimit') + "":00");
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
	$('#correct').click(function () {
							curTeam = localStorage.getItem('curTeam');
							localStorage.setItem('points', parseFloat(localStorage.getItem('points')) + 1);
							localStorage.setItem(curTeam + 'Score', parseFloat(localStorage.getItem(curTeam + 'Score')) + 1);
						});

	// if "tabooze" button pushed, grab a new word and take a point away
	// from the current team
	$('#tabooze').click(newWord);
	$('#tabooze').click(function () {
							curTeam = localStorage.getItem('curTeam');
							localStorage.setItem('points', parseFloat(localStorage.getItem('points')) - 1);
							localStorage.setItem(curTeam + 'Score', parseFloat(localStorage.getItem(curTeam + 'Score')) - 1);
	})
}

function timeUp() {
	var curTeam = parseFloat(localStorage.getItem('curTeam')),
	points = parseFloat(localStorage.getItem('points')),
	team1Score = parseFloat(localStorage.getItem('1Score')),
	team2Score = parseFloat(localStorage.getItem('2Score')),
	numTeams = parseFloat(localStorage.getItem('numTeams')),
	curRound = parseFloat(localStorage.getItem('curRound'));


	$('#title').html('Team ' + curTeam + ' earned ' + points + ' points');
	$('#1').html(team1Score + ' points');
	$('#2').html(team2Score + ' points');

	if (numTeams > 2) {
		for (i=2; i<numTeams; i++) {
			eval('team' + String(i+1) + 'Score = localStorage.getItem("' + String(i+1) + 'Score");');
			$('tr#teamNames').append('<td>\
	            						<p><u>Team ' + String(i+1) + '</u></p>\
	          						 </td>');

			$('tr#teamScores').append('<td>\
							            <p id="' + String(i+1) + '" style="font-size:100%;"></p>\
							          </td>');

		$('#' + String(i+1)).html(eval('team' + String(i+1) + 'Score') + ' points');
		}
		$('#continueRow').attr('colspan', numTeams);
	}

	$('#continue').click(function() {
							curTeam = nextTeam(curTeam);
							localStorage.setItem('curTeam', curTeam);
							// If the next team up is team 1, we must be starting a new round
							if (curTeam == 1) {
								localStorage.setItem('curRound', curRound + 1);
							}
							window.location = "startRound.html";
	});
}


function pauseMenu() {
	$('#mainMenu').click(function() {
							window.location = "index.html";
	})
}

