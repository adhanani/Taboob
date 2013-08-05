var numRounds,
numBonRounds,
timeLimit,
currentTeam = 1,
teams = [1, 2],
round = 1;

// Iterates to the next team and returns that team number
function nextTeam(team) {
	if (teams.length - teams.indexOf(team) > 1) {
		currentTeam += 1;
		return currentTeam;
	} else {
		team = 1;
		return team;
	}
}

// Timer function
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

function bonusRound() {
	window.setInterval(timer, 1000);
}

// Here are our onload functions. Each one is named to correspond with it's 
// respective html page.

function index() {
    // Remove team button. Only removes this team if there are already more than
    // two teams. This also updates each remaining team's placeholder and id.
    $('.team').click(function() {
		var numTeams = $("#menuTable")[0].rows.length - 2;
		if (numTeams > 2) {
			$(this).closest('tr').remove();
			var tableData = $('#menuTable')[0];
			numTeams -= 1;
			for (i = 0; i < numTeams; i++) {
				var textInputBox = tableData.rows[i].cells[0].children[0];
				textInputBox.setAttribute('id', String(i+1));
				textInputBox.setAttribute('placeholder', 'Team ' + String(i+1));
		}
	}
	});

    // Adds a new team when the add button is clicked ONLY if there are not
    // four or more teams already existing
	$('#add').click(function() {
		var i = $("#menuTable")[0].rows.length - 3;
		if (i < 3) 
		{
			$('#menuTable > tbody > tr').eq(i).after('<tr>\
	            <td>\
	              <input id="' + String(i+2) + '" placeholder="Team ' + String(i+2) + '" type="text;">\
	            </td>\
	            <td>\
	              <button class="team">-</button>\
	            </td>\
	          </tr>')
			
			// We have to add the remove team button for each new team
			$('.team').click(function() {
				var numTeams = $("#menuTable")[0].rows.length - 2;
				if (numTeams > 2) {
					$(this).closest('tr').remove();
					var tableData = $('#menuTable')[0];
					numTeams -= 1;
					for (i = 0; i < numTeams; i++) {
						var textInputBox = tableData.rows[i].cells[0].children[0];
						textInputBox.setAttribute('id', String(i+1));
						textInputBox.setAttribute('placeholder', 'Team ' + String(i+1));
		}
	}
	});
			}
		}); 

	// Switch to the gameOptions menu when start button is clicked
	$('#start').click(function () {
					window.location = 'gameOptions.html';
					});
}

function startRound() {
	curTeam = String(currentTeam);
	$("#header").text("Team " + curTeam);
	$("#round").text("Round " + String(round));
}

function gameOptions() {
	// Initialize number of rounds, number of bonus rounds, and time limit
	$('#time').val('3');
	$('#Rounds').val('5');
	$('#BonRounds').val('1');

	// When start button is pushed, we must store the game options we've selected
	// in global variables

	$('#startGame').click(function () {
							numRounds = $("#Rounds").val();
							numBonRounds = $("#BonRounds").val();
							timeLimit = $("#time").val();
							window.location = 'startRound.html';
							});

}



