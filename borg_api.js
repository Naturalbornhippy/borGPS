//some vars
var output = '';

//main function to start with the app
function main() {
  output = document.getElementById("out"); 
  output.innerHTML = "<p>Locating…</p>";
  navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true, timeout: 10000, maximumAge: 5000});
}

function geoFindMe() {

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
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
    output_string = '<p><b>Dezimalgrad</b><br>Latitude: ' + latitude + '° <br>Longitude: ' + longitude + '°</p>';
	//2n calc them to bgm and display them
	var new_cords = portMe_tobgm(latitude, longitude);
	var latitude_bgm  = new_cords[0];
    var longitude_bgm = new_cords[1];
    output_string += '<p><b>Grad, Dezimalminuten</b><br>Latitude: N ' + latitude_bgm[0] + '° '+ latitude_bgm[1].toFixed(4) + '<br>Longitude: E ' + longitude_bgm[0] + '° ' + longitude_bgm[1].toFixed(4)+' </p>';
	//3rd get not bgms and display it
	new_cords = portMe_tobgms(latitude_bgm, longitude_bgm);
	var latitude_bgms = new_cords[0];
	var longitude_bgms = new_cords[1];
	output_string += '<p><b>Grad, Minuten, Sekunden</b><br>Latitude: N ' + latitude_bgms[0] + '° '+ latitude_bgms[1] + '\' ' + latitude_bgms[2].toFixed(3)+'\'\'<br>Longitude: E ' + longitude_bgms[0] + '° ' + longitude_bgms[1]+'\' '+ longitude_bgms[2].toFixed(3)+ '\'\'</p>';
	//update the output div
	output.innerHTML = output_string;
};

function error() {
    output.innerHTML = "Unable to retrieve your location";
  };


function displayAccuracy(accuracy) {
	divAccuracy = document.getElementById("accuracy");
	divAccuracy.innerHTML = "<p>Genauigkeit: " + accuracy;
};

function displayLastChangeDate() {
	var jetzt = new Date();
	var hours = jetzt.getHours();
	var mins = jetzt.getMinutes();
	var seconds = jetzt.getSeconds();
	zeit = hours+':'+mins+':'+seconds;
	divLastUpdate = document.getElementById("lastUpdate");
	divLastUpdate.innerHTML = "Updated: " + zeit;
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

