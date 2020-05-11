const onSave = () => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {'action': 'getCurrent'}, saveBookmark)
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
            chrome.tabs.update(tabs[0].id, {url: linkUrl}, () => {
                setTimeout(() => {
                    chrome.tabs.sendMessage(tabs[0].id, { 'action': 'openNew', 'percentage': percentage });
                }, 1000);
            });
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
        const links = result.links;
        
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

    const bin = document.createElement('i');
    bin.classList.add('fa');
    bin.classList.add('fa-trash');
    bin.classList.add('bin');

    const link = document.createElement('span');
    link.href = linkURL;
    
    const linkText = document.createTextNode(linkURL);
    link.appendChild(linkText);

    listItem.appendChild(bin);
    listItem.appendChild(link);
    document.querySelector('.list').appendChild(listItem);     

    bin.addEventListener('click', onDelete, false);
    listItem.addEventListener('click', onOpen, false);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', onSave, false);
    
    chrome.storage.sync.get(['links'], (result) => {
        const links = result.links;
        const keys = Object.keys(result.links);
        for (const key of keys) {
            createListItem(links[key].link, key);
        }
    });

}, false);
