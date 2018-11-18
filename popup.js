function displayloadingtext(text) {
  var status = document.getElementById('status');
  // Update status to let user know options were saved.
  status.textContent = text;
  setTimeout(function () {
    status.textContent = '';
  }, 500);
}

// Saves options to chrome.storage
function save_options() {
  var time = document.getElementById('time').value;
  chrome.storage.sync.set({
    selectedTime: time,
  }, function () {
    displayloadingtext("Refresh time saved.");
    restore_options();
    if (time != 0) {
      createAlarm(time);
    } else {
      cancelAlarm();
    }
  });
}

// Restores select box using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 10
  chrome.storage.sync.get({
    selectedTime: '1',
  }, function (items) {
    var savedTime = items.selectedTime;
    if (savedTime > 0) {
      convertedTime = savedTime + " minute(s)";
    } else if (savedTime == 0) {
      convertedTime = "Not refreshing";
    } else {
      convertedTime = "Please select a refresh time"
    }
    document.getElementById('currenttiming').innerHTML = "<strong>" + convertedTime + "</strong>";
  });
}

//connection to sb wifi
function checkconnection() {
  displayloadingtext("Refreshing, please wait");
  //check connection to sb
    const Http = new XMLHttpRequest();
    //const url = 'http://stsg.image-gmkt.com/css/sg/qoo10/front/cm/common/image/logo_qoo10_sub.gif';
    const url = 'http://sb.login.org/status';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4) {
        if (Http.status == 200) {
          //get the data on status page
          conmsg();
        } else {
          dcmsg();
        }
      }
    }
};

function conmsg() {
  document.getElementById("connectmsg").style.display = "none";
  document.getElementById("sis").style.display = "none";
  document.getElementById('speed').innerHTML = "Connected";
  chrome.browserAction.setBadgeText({
    text: 'CON'
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#008000'
  });
}

function dcmsg() {
  document.getElementById("connectmsg").style.display = "block";
  document.getElementById("sis").style.display = "block";
  document.getElementById('speed').innerHTML = "";
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#8B0000'
  });
  chrome.browserAction.setBadgeText({
    text: 'DC'
  });
}

function cancelAlarm() {
  chrome.alarms.clear();
}

//minimum 1 min
function createAlarm(time) {
  var time1 = parseFloat(time);
  cancelAlarm();
  chrome.alarms.create({
    delayInMinutes: time1,
    periodInMinutes: time1
  });
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  checkconnection();
});

//click listener for save
document.getElementById('savebutton').addEventListener('click',
  save_options);
