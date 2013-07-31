$('#add').click(function() {
	alert('hello');
	var i = $("#menutable")[0].rows.length - 3;
	if (i < 3) {
		$('#menutable > tbody > tr').eq(i).after('<tr>\
            <td>\
              <input type="text;">\
            </td>\
            <td>\
              <button class="team">-</button>\
            </td>\
          </tr>');
	}
	// We have to add the click function to each new button

	$('.team').click(function() {
	var numRows = $("#menutable")[0].rows.length;
	if (numRows > 4) {
		$(this).closest('tr').remove();
		}
	})
})

// The click method for the first two teams

$('.team').click(function() {
	var numRows = $("#menutable")[0].rows.length;
	if (numRows > 4) {
		$(this).closest('tr').remove();
	}
  })

function timer() {
	var timer = $("#timer")[0];
	var time = timer.innerHTML,
	colonIndex = time.indexOf(':'),
	minutes = parseInt(time.substring(0, colonIndex)),
	seconds = parseInt(time.slice(colonIndex + 1));
	if (seconds == 0) {
		if (minutes == 0) {
			time = '0:00';
			window.clearInterval(theTimer);
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

theTimer = window.setInterval(timer, 1000);




