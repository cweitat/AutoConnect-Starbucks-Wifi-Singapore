function notconnectedtowifi() {
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#8B0000'
  });
  chrome.browserAction.setBadgeText({
    text: 'X'
  });
  //random text send
  chrome.runtime.sendMessage({ msg: "null" });
}

//set disconnect badge
function dcbadge() {
  chrome.runtime.sendMessage({ msg: "dcbadge" });
}

//set connected badge
function cbadge() {
  chrome.browserAction.setBadgeText({
    text: '✓'
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: '#008000'
  });
  chrome.runtime.sendMessage({ msg: "cbadge" });
}

chrome.browserAction.setTitle({
  title: "... = Trying, X = Not connected to SB Wifi"
});

function logout() {
  const Http = new XMLHttpRequest();
  const url = 'http://sb.login.org/logout';
  Http.open("POST", url);
  Http.send();
  //try login again
  autoconnect();
}

function autoconnect() {
  const Http1 = new XMLHttpRequest();
  //const url1 = 'http://stsg.image-gmkt.com/css/sg/qoo10/front/cm/common/image/logo_qoo10_sub.gif';
  const url1 = 'http://login5.d-synergy.com/starbucks/v3/lpass.php';
  // const params = 'username=dsuser&dst=http%3A%2F%2Fwww.starbucks.com.sg%2F'
  Http1.open("POST", url1);
  // Http1.send(params);
  Http1.send();
  Http1.onreadystatechange = (e) => {
    if (Http1.readyState == 4) {
      if (Http1.status == 200) {
        //connected
        cbadge();
      } else {
        //not connected, attempt logout
        dcbadge();
        logout();
      }
    }
  }
}

function checkconnectionresponse() {
  //check connection to online
  const Http = new XMLHttpRequest();
  const url = 'https://google.com';
  Http.open("POST", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    if (Http.readyState == 4) {
      if (Http.status == 200) {
        //get the data on status page
        cbadge();
      } else {
        dcbadge();
        autoconnect();
      }
    }
  }
}
//check if wifi is connected to sb
function checkconnecttosbwifi() {
  const http3 = new XMLHttpRequest();
  const uurl = "http://sb.login.org/status";
  http3.open("GET", uurl);
  http3.send();
  http3.onreadystatechange = (e) => {
    if (http3.readyState == 4) {
      if (http3.status != 200) {
        //not connected to sb wifi
        notconnectedtowifi();
      } else {
        //connected to sb wifi
        checkconnectionresponse();
      }
    }
  }
};

//liten for updte from popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
      if(request.msg == "checkInternet") {
        checkconnecttosbwifi();
      }
  }
);

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "autorun") {
    checkconnecttosbwifi();
  }
});

chrome.alarms.create("autorun", {
  delayInMinutes: 1,
  periodInMinutes: 1
});