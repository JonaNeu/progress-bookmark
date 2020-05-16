const onSave = () => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getCurrent' }, saveBookmark)
    })  
};

const onDelete = (e) => {
    const id = e.target.parentNode.id;

    // delete from ui
    const element = document.querySelector('#' + id);
    element.remove(); 
    e.stopPropagation();

    // delete from storage
    chrome.storage.sync.get(['links'], (result) => {
        const links = result.links;
        delete links[id];
        
        chrome.storage.sync.set({
            links: links
        });
    });
};

const onOpen = (e) => {
    const id = e.target.parentNode.id;
    
    chrome.storage.sync.get(['links'], (result) => {
        const links = result.links;

        const linkUrl = links[id].link;
        const percentage = links[id].percentage;

        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            
            // add listener waiting for the tab to be loaded
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tabs[0].id) {
                    // to be sure the tab content is loaded we wait a bit longer
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'openNew', percentage: percentage });
                    }, 1500);
                    // remove the listener immediately after action is performed
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            });

            // update the tab tab to open the bookmarked site
            chrome.tabs.update(tabs[0].id, {url: linkUrl}, () => {});
        });
    });
};

const saveBookmark = (result) => {

    const id = createUUID();
    const percentage = getScrollPercentage(result.scrollTop, result.scrollHeight, result.clientHeight)
    const linkURL = result.url;

    // add to ui
    createListItem(linkURL, id);

    // add to storage
    chrome.storage.sync.get(['links'], (result) => {
        let links = result.links;
        if (links === undefined) {
            links = {};
        }
        
        links[id] = {
            link: linkURL,
            percentage: percentage
        };
        
        chrome.storage.sync.set({
            links: links
        });
    });
}

const getScrollPercentage = (scrollTop, scrollHeight, clientHeight) => {
    return (scrollTop / (scrollHeight - clientHeight)) * 100;
}

const createUUID = () => {
    return 'id' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const createListItem = (linkURL, id) => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.id = id;

    const del = document.createElement('div');
    del.classList.add('del');

    const link = document.createElement('span');
    link.href = linkURL;
    
    const linkText = document.createTextNode(linkURL);
    link.appendChild(linkText);

    listItem.appendChild(del);
    listItem.appendChild(link);
    document.querySelector('.list').appendChild(listItem);     

    del.addEventListener('click', onDelete, false);
    listItem.addEventListener('click', onOpen, false);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', onSave, false);
    
    // load stored items
    chrome.storage.sync.get(['links'], (result) => {
        const links = result.links;

        const keys = Object.keys(result.links);
        for (const key of keys) {
            createListItem(links[key].link, key);
        }
    });

}, false);
