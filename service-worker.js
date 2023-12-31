console.log("hello");

try {
    function filter(reqs) {
        console.log(reqs.url);
        return undefined;
    }
    
    chrome.webRequest.onBeforeRequest.addListener(filter, {
        urls: ["<all_urls>"]
    })
} catch(e) {
    console.log(e);
}