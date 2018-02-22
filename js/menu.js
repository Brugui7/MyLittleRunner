/**
* Controller of the main menú
* @author Alejandro Brugarolas Sánchez-Lidón <alejandro.brugarolas@gmail.com>
* @since 2018-01-20
*/


window.onload = function(){
	var audio = new Audio('res/intro.mp3');
	audio.loop = true;
	audio.play();
	//getLeaderBoard();
};


/** Obtains the top 10 scores from the database */
function getLeaderBoard(){
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     document.getElementById('leaderBoard').innerHTML = this.responseText;
	    }
	  };
	  xhttp.open("GET", "webservices/getTop10.php", true);
	  xhttp.send();
}