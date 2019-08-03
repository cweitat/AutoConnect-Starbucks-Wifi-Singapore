function displayloadingtext(text) {
  var status = document.getElementById('status');
  // Update status to let user know options were saved.
  status.textContent = text;
  setTimeout(function () {
    status.textContent = '';
  }, 500);
}

//connection to sb wifi
function checkconnection() {
  displayloadingtext("Refreshing, please wait");
  //check connection to sb
  const Http = new XMLHttpRequest();
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

//for opening new tab from chroem extension
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("refresh").addEventListener("click", function(){
    checkconnection();
  });

  chrome.alarms.clear();
  chrome.alarms.create({
    delayInMinutes: 1,
    periodInMinutes: 1
  });
  checkconnection();

  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    (function () {
      var ln = links[i];
      var location = ln.href;
      ln.onclick = function () {
        chrome.tabs.create({
          active: true,
          url: location
        });
      };
    })();
  }
});