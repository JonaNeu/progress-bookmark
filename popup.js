var linksList = {};

const onSave = () => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, '', saveBookmark)
    })  
};

const onDelete = (e) => {
    const id = e.target.parentNode.id;

    const element = document.querySelector('#' + id);
    element.remove(); 

    e.stopPropagation();

    // todo: remove from storage
};

const onOpen = () => {
    alert('open');
};

const saveBookmark = (res) => {

    const id = createUUID();

    createListItem(res.url, id);
    
    // alert(getScrollPercentage(res.scrollTop, res.scrollHeight, res.clientHeight));

    // todo: add to storage
}

const getScrollPercentage = (scrollTop, scrollHeight, clientHeight) => {
    return (scrollTop / (scrollHeight - clientHeight)) * 100;
}

const getPixelsToScroll = (scrollPercentage, scrollHeight, clientHeight) => {
    return (scrollPercentage * (scrollHeight - clientHeight)) / 100;
}

const createUUID = () => {
    return 'id' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const createListItem = (linkURL, id) => {
    console.table(linksList);

    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.id = id;

    const bin = document.createElement('i');
    bin.classList.add('fa');
    bin.classList.add('fa-trash');
    bin.classList.add('bin');

    const link = document.createElement('a');
    link.href = linkURL;
    
    const linkText = document.createTextNode(linkURL);
    link.appendChild(linkText);

    listItem.appendChild(bin);
    listItem.appendChild(link);

    document.querySelector('.list').appendChild(listItem);     

    bin.addEventListener('click', onDelete, false);
    listItem.addEventListener('click', onOpen, false);

        // <div class="list-item">
    //       <i class="fa fa-trash"></i></i>
    //       <a href="#">https://google.com</a>
    //   </div>
}

const loadInitial = async () => {
    await chrome.storage.sync.get(['links'], (result) => {
        // create items
        const links = result.links;
        const keys = Object.keys(result.links);
        for (const key of keys) {
            createListItem(links[key].link, key);
        }

        linksList = result.links;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').addEventListener('click', onSave, false);

    // set a sample value
    // chrome.storage.sync.set({firstUrl: {data: 'test - - jona'}}, () => {
    //     alert('Value is set to ' + value);
    // });

    // chrome.storage.sync.clear(() => {
    //     alert('Cleared');
    // });

    // chrome.storage.sync.set({ 
    //         links: {
    //             'idv141uivu6jqrelhyxiwlyj': {
    //                 link: 'https://google.com',
    //                 percentage: 80
    //             },
    //             'id3v1zwyqhrfs9it8v0099pm': {
    //                 link: 'https://google11111.com',
    //                 percentage: 20
    //             },
    //             'ide1iqsjt3nxhq0cxw8qgtf': {
    //                 link: 'https://google2222.com',
    //                 percentage: 50
    //             }
    //         }

    //     }, () => {
    //     alert('Value is set to');
    // });



    
    loadInitial();

    console.table(linksList);



}, false);


// get the id of the element
// alert(event.srcElement.id);