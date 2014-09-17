//some vars
var output = '';
var divAccuracy = '';
var bigButton = '';
var divLastUpdate = '';
var watchID = 0.0;

var buttonActivated = 'button1';

window.onload = function() {
  document.getElementById("bigButton").onclick = function() {
//main function to start with the app
  setButton();
  output = document.getElementById("out"); 
  //change the button
  var a = "./images/big_button.png";
  var b = "./images/big_button_off.png";
  bigButton =   document.getElementById("bigButton");
  var pfad = bigButton.src;
  pfad = pfad.split("/");
  pfad = pfad[pfad.length-1];
  bigButton.src = a;
  if (pfad == "big_button_off.png") {
	  output.innerHTML = "<p>...</p>";
	  watchID = navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true, timeout: 50000, maximumAge: 1000});
  }
  else {
  navigator.geolocation.clearWatch(watchID);
  bigButton.src = b;
  output.innerHTML = "";
  divAccuracy.innerHTML = "~";
  divLastUpdate.innerHTML = "-<br>-<br>-";
  }
}//endBigButton
document.getElementById("MinDec").onclick = function() {
	buttonActivated = "button2";
    setButton();
}//end MinDec
document.getElementById("MinSek").onclick = function() {
	buttonActivated = "button1";
    setButton();
}//end MinSek
document.getElementById("Dec").onclick = function() {
	buttonActivated = "button3";
    setButton();
}//end Dec
}; //end onload

function geoFindMe() {

  if (!navigator.geolocation){
    output.innerHTML = "<p>###not supporting geo###</p>";
    return;
  }
};

function success(position) {
	//update the Accuracy first
	displayAccuracy(position.coords.accuracy);
	//update last update now
	displayLastChangeDate();
	//create the output String
	var output_string = '';
	//first get the dec coords and add them to the output
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    if (buttonActivated == "button3") {
    output_string = '<p>N  ' + latitude + '° <br>E  ' + longitude + '°</p>';
    }
	//2n calc them to bgm and display them
	var new_cords = portMe_tobgm(latitude, longitude);
	var latitude_bgm  = new_cords[0];
    var longitude_bgm = new_cords[1];
    if (buttonActivated == "button1") {
    output_string += '<p>N  ' + latitude_bgm[0] + '° '+ latitude_bgm[1].toFixed(6) + '<br>E  ' + longitude_bgm[0] + '° ' + longitude_bgm[1].toFixed(6)+' </p>';
	}
	//3rd get not bgms and display it
	new_cords = portMe_tobgms(latitude_bgm, longitude_bgm);
	var latitude_bgms = new_cords[0];
	var longitude_bgms = new_cords[1];
    if (buttonActivated == "button2") {
	output_string += '<p>N  ' + latitude_bgms[0] + '° '+ latitude_bgms[1] + '\' ' + latitude_bgms[2].toFixed(3)+'\'\'<br>E  ' + longitude_bgms[0] + '° ' + longitude_bgms[1]+'\' '+ longitude_bgms[2].toFixed(3)+ '\'\'</p>';
	}
	//update the output div
	output.innerHTML = output_string;
};

function error() {
    output.innerHTML = "###not_working###";
  };


function displayAccuracy(accuracy) {
	divAccuracy = document.getElementById("accuracy");
	divAccuracy.innerHTML = "<p>m<br>" + accuracy + "";
};

function displayLastChangeDate() {
	var jetzt = new Date();
	var hours = jetzt.getHours();
	var mins = jetzt.getMinutes();
	var seconds = jetzt.getSeconds();
	zeit = hours+'<br>'+mins+'<br>'+seconds;
	divLastUpdate = document.getElementById("lastUpdate");
	divLastUpdate.innerHTML = zeit;
};

function portMe_tobgm(latitude, longitude) {
	var latitude_dec = 0;
	var longitude_dec = 0;
	var lat_return = [];
	var long_return = [];

	//do some latitude magic
	latitude = parseFloat(latitude);
	latitude_dec = latitude % 1;
	latitude_grad = latitude - latitude_dec;
	latitude_dec = latitude_dec * 60;
	lat_return = [latitude_grad, latitude_dec];
	//do some longitude magic
	longitude = parseFloat(longitude);
	longitude_dec = longitude % 1;
	longitude_grad = longitude - longitude_dec;
	longitude_dec = longitude_dec * 60;
	long_return = [longitude_grad, longitude_dec];
	return [lat_return, long_return];
};

function portMe_tobgms(latitude_bgm, longitude_bgm) {
	//do some latitude magic now
	var latitude_bgm_dec = 0;
	latitude_bgm_dec = latitude_bgm[1] % 1;
	var latitude_bgm_min = 0;
	latitude_bgm_min = latitude_bgm[1] - latitude_bgm_dec;
	var latitude_bgm_sek = 0;
	latitude_bgm_sek = latitude_bgm_dec*60;
	var lat_return = [];
	lat_return = [latitude_bgm[0], latitude_bgm_min, latitude_bgm_sek];
	//do some longitude magic
	var longitude_bgm_dec = 0;
	longitude_bgm_dec = longitude_bgm[1] % 1;
	var longitude_bgm_min = 0;
	longitude_bgm_min = longitude_bgm[1] - longitude_bgm_dec;
	var longitude_bgm_sek = 0;	
	longitude_bgm_sek = longitude_bgm_dec*60;
	var long_return = [];
	long_return = [longitude_bgm[0], longitude_bgm_min, longitude_bgm_sek];
	return [lat_return, long_return];
};



function setButton() {
	var buttonMinDec = document.getElementById("MinDec");
	var buttonMinSek = document.getElementById("MinSek");
	var buttonDec = document.getElementById("Dec");

   if (buttonActivated == 'button1') {
  		buttonMinDec.src = "./images/minDec.png";   
		buttonMinSek.src = "./images/minSek_on.png";
		buttonDec.src = "./images/Dec.png";
   }
   if (buttonActivated == 'button2') {
		buttonMinDec.src = "./images/minDec_on.png";
	    buttonMinSek.src = "./images/minSek.png";
		buttonDec.src = "./images/Dec.png";
   }
   if (buttonActivated == 'button3') {
		buttonMinDec.src = "./images/minDec.png";
	    buttonMinSek.src = "./images/minSek.png";
	 	buttonDec.src = "./images/Dec_on.png";
   }
};


