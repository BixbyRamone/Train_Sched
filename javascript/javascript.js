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
    //  s = "0" + s;
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

  

  

  console.log("var: " + trainName);
  console.log("var: " + trainDest);
  console.log("var: " + frstTrnTm);
  console.log("var: " + frequency);
  console.log("var: " + nxtArrive);

  nxtArrive = nextArrival(frstTrnTm, frequency);
  tta = calcMinAway(nxtArrive);

  console.log("nxtArrive: " + nxtArrive);

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


  database.ref().on("child_added", function(childSnapshot) {

        var sv = childSnapshot.val();



       //  var svArray = Object.keys(sv);

       //  var lastIndex = svArray.length - 1;
        // var lastKey = svArray[lastIndex];
        // var lastObj = sv[lastKey]

          $('#train-name-display').append("<br>" + sv.trainName);
          $('#destination-display').append("<br>" + sv.trainDest);
          // $('#frequency-display').append("<br>" + lastObj.firstTrnTm);
          $('#frequency-display').append("<br>" + sv.frequency + " mins");
          $('#next-arrival-display').append("<br>" + sv.nxtArrive);
          $('#minutes-away-display').append("<br>" + sv.tta);



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
    } 
    else { 
    finTime = calcNextArrival(hour, minute, freq);
    //calculate the next available arrival
    }
      
    
//      var hourString = timeToString(hour);

//      var minString = timeToString(minute);     

//      tta = calcTimeToArrive(minute, hour);

//      // if (hour >= 24 && minute != 0) {
//      //  hour = hour - 24;
//      // }

//      // if ( hour < getHour() ) {

//      // }

// // //creating display of time
// //     var hourString = hour;
// //       if (hourString < 10) {
// //         hourString = "0" + hourString;
// //       }
// //     var minString = minute;
// //       if (minString < 10) {
// //         minString = "0" + minString;
// //       }
//      finTime = hourString + ":" + minString;
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

  // function calcTimeToArrive(mins, hours) {
  //  var timeToArrv = "";
  //  if (getMin() > mins) {
  //    hours = hours - 1;
  //    mins = mins + 60;
  //  }

  //  if ( getHour() > hours) {
  //    hours = hours + 24;     
  //  }

  //  mins = mins - getMin();
  //  hours = hours - getHour();

  //  timeToArrv = hours + " hours & " + mins + " minutes.";

  //  return timeToArrv;
  // }

   function calcNextArrival(hourx, minutex, freqx) {
    // console.log("check if freq is string: " + z + 00);
    var freqx = parseInt(freqx);
    // calculate the next available arrival

    // convert hours into minutes
    var hourmin1 = hourx * 60;
    var hourmin2 = getHour() * 60;
    var timeThen = hourmin1 + minutex;
    var timeNow = hourmin2 + getMin();
    // number of times the train will arrive at the station
    // var visits = (timeNow - timeThen)  / freqx;

    // console.log(z);

    while ( timeNow > timeThen) {
      var timeThen = timeThen + freqx;

    }
    console.log("this should be answer in minutes: " + timeThen);

    var newTimemin = timeThen % 60;
    var newTimehour = Math.floor(timeThen / 60);

    var returnTime = timeToString(newTimehour) + ":" + timeToString(newTimemin);

    return returnTime;
  }

  function calcMinAway(arriv) {
    var char1 = arriv.charAt(0);
    var char2 = arriv.charAt(1);
    var char3 = arriv.charAt(arriv.length - 2);
    var char4 = arriv.charAt(arriv.length - 1);
    var hour = parseInt(char1 + char2);
    var minute = parseInt(char3 + char4);

    var hourmin1 = hour * 60;
      var hourmin2 = getHour() * 60;
      var arrivaltime = hourmin1 + minute;
      var timeNow = hourmin2 + getMin();

      var returnmin = arrivaltime - timeNow;

      return returnmin;
  }
 // nextArrival(frstTrnTm);
})