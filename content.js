const getPixelsToScroll = (scrollPercentage, scrollHeight, clientHeight) => {
  return (scrollPercentage * (scrollHeight - clientHeight)) / 100;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const doc = document.documentElement;
  const bod = document.body;

  const sT = doc['scrollTop'] | bod['scrollTop'];
  const sH = doc['scrollHeight'] | bod['scrollHeight'];
  const cH = doc['clientHeight'];

  switch(request.action) {
    case 'getCurrent': 
      sendResponse({
        url: window.location.href.split("#")[0],
        scrollTop: sT,
        scrollHeight: sH, 
        clientHeight: cH
      });
      break;
    case 'openNew':
      window.scrollBy({
        top: getPixelsToScroll(request.percentage, sH, cH), 
        left: 0,
        behavior: 'smooth' 
      });
      break;
    default: 
      break;
  }
});