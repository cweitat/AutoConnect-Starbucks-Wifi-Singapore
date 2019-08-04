var connectmsg = document.getElementById("connectmsg");
var status1 = document.getElementById("status1");

//connection to sb wifi
function checkconnection() {
  // Update status to let user know options were saved.
  status1.innerHTML = "Refreshing, please wait";
  connectingmsg();
  chrome.runtime.sendMessage({ msg: "checkInternet" });
};

function connectingmsg() {
  connectmsg.innerHTML = "Connected to Wifi, trying for connection.";
  chrome.browserAction.setBadgeText({
    text: '...'
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#000'
  });
}

//liten for updte from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
      if(request.msg == "dcbadge") {
        connectingmsg();
        status1.innerHTML = "No internet";
      } else if (request.msg == "cbadge"){
        connectmsg.innerHTML = "";
        status1.innerHTML = "Connected";
      } else {
        connectmsg.innerHTML = "You are not connected to MyRepublic@Starbucks";
        status1.innerHTML = "No connection to internet";
      }
  }
);

//for opening new tab from chroem extension
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("refresh").addEventListener("click", function(){
    checkconnection();
  });

  checkconnection();

  chrome.alarms.create("autorun", {
    delayInMinutes: 1,
    periodInMinutes: 1
  });

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