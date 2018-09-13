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
    let time = document.getElementById("trainTime").value.trim()
    let frequency = Number(document.getElementById("frequency").value)
    const military = /^\s*([01]?\d|2[0-3]):[0-5]\d\s*$/i;
    if (!time.match(military) || frequency < 0 || !Number.isInteger(frequency)) {
        document.getElementById("message").innerHTML = "Invalid Input!"
        console.log("Error");
        return false;
    } else {
        userRef.push({
          name: document.getElementById("trainName").value.trim(),
          destination: document.getElementById("destination").value.trim(),
          time: time,
          frequency: frequency,
        })
        document.getElementById("trainForm").reset()
    }
    retreiveData()
  }
//Retreive Data
function retreiveData() {
    userRef.on('value', function(data){
        document.querySelector("#trainList").innerHTML = ""
        const trains = data.val()
    for (const key in trains) {
        if (trains.hasOwnProperty(key)) {
            const train = trains[key];
            let x = moment(train.time, "HH:mm")
            let y = moment()
            let difference = y.diff(x, "minutes")
            let minutesAway = train.frequency - (difference%train.frequency)
            let nextTrain = moment().add(minutesAway, 'minutes').format("hh:mm A");
            
            if (difference < 0) {
                nextTrain = moment(train.time, "HH:mm").format("hh:mm A")
                minutesAway = Math.abs(difference)
            } 
            
            let trainElement = document.createElement('tr')
                trainElement.innerHTML = `
                    <td class="editable">${train.name}</td>
                    <td class="editable">${train.destination}</td>
                    <td class="editable">${train.frequency}</td>
                    <td class="editable">${nextTrain}</td>
                    <td>${minutesAway}</td>
                    <td><div class="delete"><a href="#"><i class="material-icons">delete</i></a></div></td>
                `
            document.querySelector('#trainList').appendChild(trainElement)
        }  
    }
    })
}


// Edit Train Schedule
function edit(editIcon) {
    let editArr = document.querySelectorAll('.editable')
    editArr.forEach(function(el){
        el.contentEditable = "true"
        el.style.color = "brown"
    })
    editIcon.innerHTML =`
    <a href="#"><i class="material-icons done">done</i></a>
    `
    let deleteArr = document.querySelectorAll('.delete')
    deleteArr.forEach(function(el){
        el.style.visibility = "visible"
    })
}

//Update Data
function updateData(doneIcon) {
    let editArr = document.querySelectorAll('.editable')
    editArr.forEach(function(el){
        el.contentEditable = "false"
        el.style.color = "black"
    })
    doneIcon.innerHTML =`
    <a href="#"><i class="material-icons edit">edit</i></a>
    `
}

//EventListener
document.addEventListener("DOMContentLoaded", function(){
    retreiveData()
    function repeatEvery(func, interval) {
        // Check current time and calculate the delay until next interval
        var now = new Date(),
            delay = interval - now % interval;
    
        function start() {
            // Execute function now...
            func();
            // ... and every interval
            repeatEvery(func, interval);
        }

        // Delay execution until it's an even interval
        setTimeout(start, delay);
    }
    
    repeatEvery(retreiveData, 60000);
})
document.getElementById('addTrain').addEventListener('click', addTrain)
document.addEventListener('click', function(e) {
    // console.log(e.target.parentElement.parentElement.parentElement)
    if (e.target.matches(".edit")) {
        let editIcon = e.target.parentElement.parentElement
        edit(editIcon)
    }
    if (e.target.matches(".done")) {
        let doneIcon = e.target.parentElement.parentElement
        updateData(doneIcon)
    }
}, false)

