var connectmsg = document.getElementById("connectmsg");
var status1 = document.getElementById("status1");

//connection to sb wifi
function checkconnection() {
  // Update status to let user know options were saved.
  status1.innerHTML = "Refreshing, please wait";
  // setTimeout(function () {
  //   status.textContent = '';
  // }, 500);

  //check connection to sb
  const Http = new XMLHttpRequest();
  const url = 'http://sb.login.org/status';
  Http.open("POST", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    if (Http.readyState == 4) {
      //change this back later BUG!! supposed to be ==200
      if (Http.status == 200) {
        //get the data on status page
        connectingmsg();
      } else {
        notconnectedtowifi();
        chrome.browserAction.setBadgeBackgroundColor({
          color: '#8B0000'
        });
        chrome.browserAction.setBadgeText({
          text: 'X'
        });
      }
    }
  }
};

function connectingmsg() {
  connectmsg.innerHTML = "Connected to Wifi, checking for connection.";
  chrome.browserAction.setBadgeText({
    text: '...'
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#000'
  });
  chrome.runtime.sendMessage({ msg: "checkInternet" });
}

function notconnectedtowifi() {
  connectmsg.innerHTML = "You are not connected to MyRepublic@Starbucks";
  status1.innerHTML = "No connection to internet";

}

//liten for updte from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
      if(request.msg == "dcbadge") {
        connectmsg.innerHTML = "Connected to Wifi but no internet";
        status1.innerHTML = "No internet";
      } else if (request.msg == "cbadge"){
        connectmsg.innerHTML = "";
        status1.innerHTML = "Connected";
      } else {
        notconnectedtowifi();
      }
  }
);

//for opening new tab from chroem extension
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("refresh").addEventListener("click", function(){
    checkconnection();
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