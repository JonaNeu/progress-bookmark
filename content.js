chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    var doc = document.documentElement;
    var sT = doc['scrollTop'];
    var sH = doc['scrollHeight'];
    var cH = doc['clientHeight'];
      
    sendResponse({
      url: window.location.href,
      scrollTop: sT,
      scrollHeight: sH, 
      clientHeight: cH
    });
})