

// Initialize Firebase
 
var config = {
  apiKey: "AIzaSyAEsayMsP16ibCDty_v9GgEyBwfgDQVWr8",
  authDomain: "trainscheduler-826e9.firebaseapp.com",
  databaseURL: "https://trainscheduler-826e9.firebaseio.com",
  projectId: "trainscheduler-826e9",
  storageBucket: "trainscheduler-826e9.appspot.com",
  messagingSenderId: "1081926972581"
  };

    firebase.initializeApp(config);

// Create a variable to reference the database
    var database = firebase.database();


  // Whenever a user clicks the submit button to add Trains
  document.querySelector("#submit").addEventListener("click", onSubmitClick);

  function onSubmitClick() {
  
        event.preventDefault();

       // Get the input values

        var trainName = document.getElementById("trainName").value.trim();
        var destination = document.getElementById("destination").value.trim();
        var firstTrainTime = document.getElementById("firstTrainTime").value.trim();
        var frequencyMin = parseInt(document.getElementById("frequency").value.trim());

       
      // using Moment.js to calculate next train time      
      
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

        // Difference between the times
        // to determine the time in years, months, days between today and the randomDate
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        
        // Time apart (remainder)
        var tRemainder = diffTime % frequencyMin;
        
        // Minute Until Train
        var minutesAway = frequencyMin - tRemainder;
        
        // Next Train
        var nextArrival = moment().add(minutesAway, "minutes").format("LT");
        

        // convert firstTrainTime
        var convertedFirstTrain = moment(firstTrainTime, "HH:mm");
       
      
        // to determine the time in minutes between current and the first train time
        var betweenTime = convertedFirstTrain.diff(moment(),"minutes");


        // Time difference considering frenqucy 
        var timeRemain = betweenTime % frequencyMin;



         // next train time
        var minutesAway = 0 ;
        var nextArrival = 0 ;

        if ( timeRemain < 0 )  {
                minutesAway = frequencyMin + timeRemain;

        }

        else {  minutesAway = frequencyMin - timeRemain;

        }
  
        var nextArrival = moment().add(minutesAway, "minutes").format("LT");





      // storing and retrieving the most recent schedule.
      // Store train data to the database
        database.ref().push({
          trainName: trainName,
          destination: destination,
          frequency: frequencyMin,
          firstTrainTime: firstTrainTime,
          nextArrival: nextArrival,
          minutes: minutesAway
          
        });


        // Clear input form
        document.getElementById("newForm").reset();
        document.querySelectorAll(".form-control").innerHTML  ="";

    };

    // At the initial load and subsequent value changes, get a snapshot of the stored data.
    // This function updates page in real-time when the firebase database changes.
     // Firebase watcher + initial loader. This code behaves similarly to .on("value")
        database.ref().on("child_added", function(childSnapshot) {

        // Store everything into a variable.
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var frequencyMin = childSnapshot.val().frequency;
        var nextArrival = childSnapshot.val().nextArrival;
        var minutesAway = childSnapshot.val().minutes;

        
        // update train schedule into the table
 
            var tableRow = document.createElement("tr");
              // append table data to table row

              var tableData1 = document.createElement("td");
              tableData1.textContent = trainName ;
              tableRow.appendChild(tableData1);

              var tableData2 = document.createElement("td");
              tableData2.textContent = destination ;
              tableRow.appendChild(tableData2);

              var tableData3 = document.createElement("td");
              tableData3.textContent = frequencyMin ;
              tableRow.appendChild(tableData3);

              var tableData4 = document.createElement("td");
              tableData4.textContent = frequencyMin ;
              tableRow.appendChild(tableData4);

              var tableData5 = document.createElement("td");
              tableData5.textContent = minutesAway ;
              tableRow.appendChild(tableData5);

              
              // add row to table body
      document.querySelector("#added-train").appendChild(tableRow);
 
            
    });