
const onClick = () => {
    chrome.storage.sync.set({key: 'value jona'}, function() {
        console.log('Value is set to ' + value);
      });
    
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, '', saveBookmark)
    })

    
};

const saveBookmark = (response) => {
    alert('response');    
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', onClick, false);
}, false);

const scrollHeightCalc = () => {
    function getScrollPercent() {
        var h = document.documentElement, 
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    }
}