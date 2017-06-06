$(document).ready(function() {

	// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCHJaJK00xLM1NgBB25blGj4IRAbNx39CI",
    authDomain: "train-schedule-e1a01.firebaseapp.com",
    databaseURL: "https://train-schedule-e1a01.firebaseio.com",
    projectId: "train-schedule-e1a01",
    storageBucket: "train-schedule-e1a01.appspot.com",
    messagingSenderId: "320414934017"
  };
  firebase.initializeApp(config);
// ease of use variable
  var database = firebase.database();
//declare variables for input
  var trainName = "";
  var trainDest = "";
  var firstTrnTm = "";
  var frequency = 0;
  var nxtArrive = "";
  var tta = "";

//CLOCK---------------------
  function renderTime() {
  	var currentTime = new Date();
  	var h = getHour();
  	var m = getMin();
  	var s = currentTime.getSeconds();

  	var hour = h;
  	var min = m;

  	if (h === 24) {
  		h = 0
  	} else if (h > 12) {
  		h = h - 0;
  	}

  	if (h < 10) {
  		h = "0" + h;
  	}

  	if (m < 10) {
  		m = "0" + m;
  	}

  	// if ( s < 10 ) {
  	// 	s = "0" + s;
  	// }

  	var myClock = h + ":" + m; // + ":" + s;

  	$('#clock-display').html(myClock);
  	

}

function getHour() {
	var currentTime = new Date();
	var h = currentTime.getHours();
	return h;
}

function getMin() {
	var currentTime = new Date();
	var m = currentTime.getMinutes();
	return m;
}

  setInterval(function(){ renderTime() }, 1000);
//-----------------CLOCK

 $("#add-train").on("click", function() {
      event.preventDefault();
//assign variables to values using ID tags
	trainName = $('#train-name-inpt').val().trim();
	trainDest = $('#destination-inpt').val().trim();
	frstTrnTm = $('#first-train-time-inpt').val().trim();
	frequency = $('#frequency-inpt').val().trim();

	nxtArrive = nextArrival(frstTrnTm, frequency);

	console.log("var: " + trainName);
	console.log("var: " + trainDest);
	console.log("var: " + frstTrnTm);
	console.log("var: " + frequency);
	console.log("var: " + nxtArrive);

	
	if (checkFirstTrainInput(frstTrnTm)) {
//pushing to firebase
	database.ref().push({
		trainName: trainName,
		trainDest: trainDest,
		frstTrnTm: frstTrnTm,
		frequency: frequency,
		nxtArrive: nxtArrive,
		tta: tta
	});

	

}
	else {
		alert("Input time in correct format");
	}
		

	  });


	database.ref().on("value", function(snapshot) {

        var sv = snapshot.val();



        var svArray = Object.keys(sv);

        var lastIndex = svArray.length - 1;
      	var lastKey = svArray[lastIndex];
      	var lastObj = sv[lastKey]

          $('#train-name-display').append("<br>" + lastObj.trainName);
          $('#destination-display').append("<br>" + lastObj.trainDest);
          // $('#frequency-display').append("<br>" + lastObj.firstTrnTm);
          $('#frequency-display').append("<br>" + lastObj.frequency + " mins");
          $('#next-arrival-display').append("<br>" + lastObj.nxtArrive);
          $('#minutes-away-display').append("<br>" + lastObj.tta);



      },  function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });


  

 function nextArrival (arriv, freq) {
 		var char1 = arriv.charAt(0);
 		var char2 = arriv.charAt(1);
 		var char3 = arriv.charAt(arriv.length - 2);
 		var char4 = arriv.charAt(arriv.length - 1);
 		console.log("string check: " + char1 + ";" + char2 + ";" + char3 + ";" + char4);

 		var hour = parseInt(char1 + char2);
 		var minute = parseInt(char3 + char4);
 		var finTime = "";
 		var nextAHr = 0;

 		if ( hour > getHour() ) {
 			finTime = char1 + char2 + ":" + char3 + char4;
 		} else if ( hour == getHour()  && minute > getMin() ) {
 			finTime = char1 + char2 + ":" + char3 + char4;
 		} else { //}

 		//calculate the next available arrival

 		minute = parseInt(freq) + minute;

	 		while (minute >= 60) {
	 			minute = minute - 60;
	 			hour++;
	 		}
 		}

 		if ( hour >= 24 && minute != 0) {
 				hour = hour -24;
 			}

 			// 	if  (hour < getHour() ) {
 			// 		while (hour < getHour() ) {
 			// 			minute = parseInt(freq) + minute;

 			// 			while (minute >= 60) {
 			// 			minute = minute - 60;
 			// 			hour = hour + 1;
 			// 		}
 			// 	}
 			// }
 		
 		var hourString = timeToString(hour);

 		var minString = timeToString(minute); 		

 		tta = calcTimeToArrive(minute, hour);

 		// if (hour >= 24 && minute != 0) {
 		// 	hour = hour - 24;
 		// }

 		// if ( hour < getHour() ) {

 		// }

// //creating display of time
//  		var hourString = hour;
//  			if (hourString < 10) {
//  				hourString = "0" + hourString;
//  			}
//  		var minString = minute;
//  			if (minString < 10) {
//  				minString = "0" + minString;
//  			}
 		finTime = hourString + ":" + minString;
 		// console.log("time in funct: " + finTime);

 		return finTime;

  	// $('.panel-title').html('Current Train Schedule');
    }


    function timeToString(time) {
    	if (time < 10) {
 				time = "0" + time;
 			}
 			return time;
    }

	function checkFirstTrainInput(str) {
		console.log("str: " + str);
		var t = /^\d{2,}:\d{2}$/.test(str);
		console.log("checkinput: " + str.match(/^([2][0-3]|[01]?[0-9])([.:][0-5][0-9])?$/));
		console.log("checkinput 2: " + t);

		if ( t === true) {
			return true;
		}
	}

	function calcTimeToArrive(mins, hours) {
		var timeToArrv = "";
		if (getMin() > mins) {
			hours = hours - 1;
			mins = mins + 60;
		}

		if ( getHour() > hours) {
			hours = hours + 24;			
		}

		mins = mins - getMin();
		hours = hours - getHour();

		timeToArrv = hours + " hours & " + mins + " minutes.";

		return timeToArrv;
	}

 // nextArrival(frstTrnTm);
})