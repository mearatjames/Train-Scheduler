  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyACDRepMUgXkuHpUAPR3CyIQBftXWy2rXE",
    authDomain: "train-scheduler-71636.firebaseapp.com",
    databaseURL: "https://train-scheduler-71636.firebaseio.com",
    projectId: "train-scheduler-71636",
    storageBucket: "train-scheduler-71636.appspot.com",
    messagingSenderId: "739350846894"
  };
  firebase.initializeApp(config);
  let db = firebase.database()

  let userRef = db.ref('trains')

//Add Train
  function addTrain(e) {
    e.preventDefault();

//Time Validation
    let time = document.getElementById("trainTime").value
    let frequency = Number(document.getElementById("frequency").value)
    const military = /^\s*([01]?\d|2[0-3]):[0-5]\d\s*$/i;
    if (!time.match(military) || frequency < 0 || !Number.isInteger(frequency)) {
        document.getElementById("message").innerHTML = "Invalid Input!"
        console.log("Error");
        return false;
    } else {
        userRef.push({
          name: document.getElementById("trainName").value,
          destination: document.getElementById("destination").value,
          time: document.getElementById("trainTime").value,
          frequency: frequency,
        })
        document.getElementById("trainForm").reset()
    }
  }

userRef.on('child_added', data => {
const train = data.val()
// let x = new moment(train.time)
// let y = new moment()
// let duration = y.diff(x, "months")
let trainElement = document.createElement('tr')
    trainElement.innerHTML = `
        <td>${train.name}</td>
        <td>${train.destination}</td>
        <td>${train.frequency}</td>
        <td></td>
        <td></td>
    `
    document.querySelector('#trainList').appendChild(trainElement)
})
//EventListener

document.getElementById('addTrain').addEventListener('click', addTrain)