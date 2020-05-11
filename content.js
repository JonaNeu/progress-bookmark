const getPixelsToScroll = (scrollPercentage, scrollHeight, clientHeight) => {
  return (scrollPercentage * (scrollHeight - clientHeight)) / 100;
}

// test with waiting for document to be loaded
// with the browser width the height is not exactly the same

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const doc = document.documentElement;
  const bod = document.body

  const sT = doc['scrollTop'] | bod['scrollTop'];
  const sH = doc['scrollHeight'] | bod['scrollHeight'];
  const cH = doc['clientHeight'];
  
  switch(request.action) {
    case 'getCurrent': 
      sendResponse({
        url: window.location.href,
        scrollTop: sT,
        scrollHeight: sH, 
        clientHeight: cH
      });
      break;
    case 'openNew':
      window.scrollTo(0, getPixelsToScroll(request.percentage, sH, cH));
      break;
    default: 
      break;
  }
});