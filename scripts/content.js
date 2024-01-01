// @ts-check

(async () => {
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log()
    console.log(msg);
    sendResponse();
    return undefined;
  });
})();