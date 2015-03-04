//some vars
var output = '';
var divAccuracy = '';
var bigButton = '';
var divLastUpdate = '';
var watchID = 0.0;

function startIndex() {
	//load the settings first
	startSettings();

	//setup the html elements
	setMainArea();
	setLastUpdate();
	setOnOff();
    output = document.getElementById("out"); 

	if (localStorage.getItem('borgTheme') == 'borg') {

			document.getElementById("bigButton").onclick = function() {
			on_off_button = document.getElementById("on_off_button");
			var pfad = on_off_button.src;
			var a = "./images/big_button.png";
			var b = "./images/big_button_off.png";
			pfad = pfad.split("/");
			pfad = pfad[pfad.length-1];
			on_off_button.src = a;
			if (pfad == "big_button_off.png") {
				  output.innerHTML = "<p>...</p>";
				  watchID = navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true, timeout: 50000, maximumAge: 1000});
			  }
			else {
			  navigator.geolocation.clearWatch(watchID);
			  on_off_button.src = b;
			  output.innerHTML = "";
			  divAccuracy.innerHTML = "~";
			  divLastUpdate.innerHTML = "-<br>-<br>-"
		   }//else
   }//if onclick
   }//if borg 

   if (localStorage.getItem('borgTheme') == 'normal') {
		   document.getElementById("bigButton").onclick = function() {
		   var buttonText = document.getElementById("bigButton").firstChild.data;
		   if (buttonText=='Stop') {
				  navigator.geolocation.clearWatch(watchID);
				  output.innerHTML = "";
				  divAccuracy.innerHTML = "~";
				  divLastUpdate.innerHTML = "-<br>-<br>-"
				  document.getElementById("bigButton").firstChild.data = "Start";
		   }
		   else {
			    output.innerHTML = "<p>...</p>";
  			    watchID = navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true, timeout: 50000, maximumAge: 1000});
				document.getElementById("bigButton").firstChild.data = "Stop";
			}
   }//if onclick
   }//if normal

}; //end onload

function startSet() {
	document.getElementById("iconSave").onclick = function() {
	//store the format
	var e = document.getElementById("myFormat");
	var foo = e.options[e.selectedIndex].value;

	localStorage.setItem('borgFormat', foo);
	//store the theme
	var e = document.getElementById("myTheme");
	var foo = e.options[e.selectedIndex].value;

	localStorage.setItem('borgTheme', foo);
	
	window.location = "index.html";
	}
}


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
    if (localStorage.getItem('borgFormat') == "Dec") {
    output_string = '<p>N  ' + latitude + '° <br>E  ' + longitude + '°</p>';
    }
	//2n calc them to bgm and display them
	var new_cords = portMe_tobgm(latitude, longitude);
	var latitude_bgm  = new_cords[0];
    var longitude_bgm = new_cords[1];
    if (localStorage.getItem('borgFormat')== "MinDec") {
    output_string += '<p>N  ' + latitude_bgm[0] + '° '+ latitude_bgm[1].toFixed(6) + '<br>E  ' + longitude_bgm[0] + '° ' + longitude_bgm[1].toFixed(6)+' </p>';
	}
	//3rd get not bgms and display it
	new_cords = portMe_tobgms(latitude_bgm, longitude_bgm);
	var latitude_bgms = new_cords[0];
	var longitude_bgms = new_cords[1];
    if (localStorage.getItem('borgFormat') == "MinSek") {
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


//R setON_off Areas
function setOnOff() {
	var areaOnOff= document.getElementById("on_off");

	if (localStorage.getItem('borgTheme') == 'borg') {
		var outputString = '<div id="line"><img src="images/line.png" width="80%" height="5px"></div><div id="bigButton"><img id="on_off_button" src="images/big_button_off.png" width="40" height="40" style="cursor:pointer"></div><div id="circle"><img src="images/circle.png"></div>';
	}
	if (localStorage.getItem('borgTheme') == 'normal') {
		var outputString =' <button type="button" id="bigButton">Start</button> ';
	}
	areaOnOff.innerHTML = outputString;
};

//R Load CSS now
function loadCSS() {
            var e = document.createElement("link");
            e.type = "text/css";
            e.rel = "stylesheet";
			if (localStorage.getItem('borgTheme') == 'borg') {
            e.href = "borg.css";
		    };
			if (localStorage.getItem('borgTheme') == 'normal') {
            e.href = "normal.css";
		    };

            document.getElementsByTagName("head")[0].appendChild(e);
};

//R This function sets the main area
function setMainArea() {
	var areaSettings= document.getElementById("main");
	if (localStorage.getItem('borgTheme') == 'borg') {

		var mainAreaOutput = '<div id="smallline1"><img src="images/small_coord.png" height="3px" width="100%"></div><div id="smallline2"><img src="images/small_coord2.png" height="90%" width="3px"></div><div id="smallline3"><img src="images/small_coord.png" height="3px" width="60%"></div><div id="middlecoords1"><img src="images/middle_coords.png" width="60"></div><div id="out">- - - -</div>';
	}
	if (localStorage.getItem('borgTheme') == 'normal') {
		var mainAreaOutput = '<div id="out">- - - -</div>';
	}
    areaSettings.innerHTML = mainAreaOutput;

};


//R This function sets the lastUpdateArea
function setLastUpdate() {
	var areaLastUpdate= document.getElementById("lastUpdate");
	if (localStorage.getItem('borgTheme') == 'borg') {
		var outputString = '<div id="placeDate">-<br>-<br>-</div>';
	}
	if (localStorage.getItem('borgTheme') == 'normal') {
		var outputString = '<div id="placeDate">-<br>-<br>-</div>';
	}
	areaLastUpdate.innerHTML = outputString;
};

//R This function sets the settingsAreas with the elements need for the template
function setSettings() {
	var areaSettings= document.getElementById("settings");
	
	if (localStorage.getItem('borgTheme') == 'borg') {
		var outputButtons = '<div id="smallOnes"><img id="MinDec" src="images/minDec.png" width="40" height="40"><img id="MinSek" src="images/minSek.png" width="40" height="40"><img id="Dec" src="images/Dec.png" width="40" height="40"></div>';
		areaSettings.innerHTML = outputButtons;

		var buttonMinDec = document.getElementById("MinDec");
		var buttonMinSek = document.getElementById("MinSek");
		var buttonDec = document.getElementById("Dec");

	   if (localStorage.getItem('borgFormat') == 'MinSek') {
	  		buttonMinDec.src = "./images/minDec.png";   
			buttonMinSek.src = "./images/minSek_on.png";
			buttonDec.src = "./images/Dec.png";
	   }
	   if (localStorage.getItem('borgFormat') == 'MinDec') {
			buttonMinDec.src = "./images/minDec_on.png";
			buttonMinSek.src = "./images/minSek.png";
			buttonDec.src = "./images/Dec.png";
	   }
	   if (localStorage.getItem('borgFormat') == 'Dec') {
			buttonMinDec.src = "./images/minDec.png";
			buttonMinSek.src = "./images/minSek.png";
		 	buttonDec.src = "./images/Dec_on.png";
	   }
	}

};



// Check the setttings and populate or Set
function startSettings() {
if(!localStorage.getItem('borgTheme')) {
  populateStorage();
} else {
  	loadCSS();
}
if(!localStorage.getItem('borgFormat')) {
  populateStorage();
} else {
  	setSettings();
}
};


//function init Storage Wars
function populateStorage() {
localStorage.setItem('borgTheme', 'borg');
localStorage.setItem('borgFormat', 'MinDec');
loadCSS();
setSettings();
};


function setFormat() {
	var sel = document.getElementById('myFormat');
    for(var i = 0, j = sel.options.length; i < j; ++i) {
        if(sel.options[i].innerHTML === localStorage.getItem('borgFormat')) {
           sel.selectedIndex = i;
           break;
        }
    }
}

function setTheme() {
	var sel = document.getElementById('myTheme');
    for(var i = 0, j = sel.options.length; i < j; ++i) {
        if(sel.options[i].innerHTML === localStorage.getItem('borgTheme')) {
           sel.selectedIndex = i;
           break;
        }
    }
}
