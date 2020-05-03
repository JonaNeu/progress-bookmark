const getPixelsToScroll = (scrollPercentage, scrollHeight, clientHeight) => {
  return (scrollPercentage * (scrollHeight - clientHeight)) / 100;
}

// test with waiting for document to be loaded
// with the browser width the height is not exactly the same

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const doc = document.documentElement;
  
  switch(request.action) {
    case 'getCurrent': 
      const sT = doc['scrollTop'];
      const sH = doc['scrollHeight'];
      const cH = doc['clientHeight'];
        
      sendResponse({
        url: window.location.href,
        scrollTop: sT,
        scrollHeight: sH, 
        clientHeight: cH
      });
      break;
    case 'openNew':
      window.scrollTo(0, getPixelsToScroll(request.percentage, doc['scrollHeight'], doc['clientHeight']));
      break;
    default: 
      break;
  }
});