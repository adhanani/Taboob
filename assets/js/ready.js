$(document).ready(function() {
  // Handler for .ready() called.
  alert("Your mom");

$('#add').click(function() {
	var i = document.getElementById("teams").rows.length - 3;
	if (i < 3) {
		console.log(i);
		$('#teams > tbody > tr').eq(i).after("<tr><td><form class='navbar-form pull-left'>\
	              <input type='text' class='form-control' style='width: 200px;'>\
	              <button type='submit' class='btn btn-default'>-</button>\
	            </form></td></tr>");
	}
  })

});