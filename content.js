chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    
      chrome.storage.sync.get(['key'], function(result) {
        console.log('Value currently is ' + result.key);
      });
    
  
    sendResponse({
      url: window.location.href,
      currentProgress: 80,
      totalHeight: 100,
    });
})