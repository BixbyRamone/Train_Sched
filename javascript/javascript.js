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
  var frequency = "";

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


	console.log(trainName);
	console.log(trainDest);
	console.log(frstTrnTm);
	console.log(frequency);

	if (checkFirstTrainInput(frstTrnTm)) {
//pushing to firebase
	database.ref().push({
		trainName: trainName,
		trainDest: trainDest,
		frstTrnTm: frstTrnTm,
		frequency: frequency
	});
}
	else {
		alert("Input time in correct format")
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



      },  function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });


  

 function nextArrival (toString) {
    	var arrival = JSON.stringify(toString);
    	console.log(arrival);
  	// $('.panel-title').html('Current Train Schedule');
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


 // nextArrival(frstTrnTm);
})