// window.scrollBy(x, y) to scroll the height of the windows
// scrollheight -> total height of element
// scrollTop -> how much is already scrolled
// clientHeight -> element width without borders. We need it.


const onClick = () => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, '', saveBookmark)
    })  
};

const saveBookmark = (res) => {
    alert(getScrollPercentage(res.scrollTop, res.scrollHeight, res.clientHeight));
}

const getScrollPercentage = (scrollTop, scrollHeight, clientHeight) => {
    return (scrollTop / (scrollHeight - clientHeight)) * 100;
}

const getPixelsToScroll = (scrollPercentage, scrollHeight, clientHeight) => {
    return (scrollPercentage * (scrollHeight - clientHeight)) / 100;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', onClick, false);

    // set a sample value
    // chrome.storage.sync.set({firstUrl: {data: 'test - - jona'}}, () => {
    //     alert('Value is set to ' + value);
    // });

    var fetchedResult = null;
    chrome.storage.sync.get(['firstUrl'], (result) => {
        var node = document.createElement("div");
        var textnode = document.createTextNode(result.firstUrl.data);
        node.appendChild(textnode);
        document.querySelector('.link-list').appendChild(node);     
    });

}, false);






