// @ts-check

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   console.log(sender.tab?.url);
//   // @ts-ignore
//   sendResponse({ url: sender.tab?.url });
//   return undefined;
// });

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  // console.log(details);
  if (
    details.url.match('https://tesseractonline.com/student/subject/.+/unit/.+/topic/.+/content')
  ) {
    getPdfUrl(details.tabId);
  }
});

/**
 * @param {number} tabId
 */
function getPdfUrl(tabId) {
  console.log(tabId);
  var version = '1.0';
  chrome.debugger.attach(
    {
      tabId: tabId,
    },
    version,
    onAttach.bind(null, tabId)
  );
}

/**
 * @param {number} tabId
 */
function onAttach(tabId) {
  chrome.debugger.sendCommand(
    {
      //first enable the Network
      tabId: tabId,
    },
    'Network.enable'
  );
  // @ts-ignore
  chrome.debugger.onEvent.addListener(allEventHandler);
}

/**
 * @param {{ tabId: number; }} debuggeeId
 * @param {string} message
 * @param {{ request: { url: any; }; requestId: any; response: { url: any; }; }} params
 */
async function allEventHandler(debuggeeId, message, params) {
  var reqUrl = '';
  if (params.request.url) {
    reqUrl = params.request.url;
  }
  console.log(reqUrl);
  if (reqUrl && filter(reqUrl)) {
    console.log(`found: ${reqUrl}`);

    let resp = await chrome.tabs.sendMessage(debuggeeId.tabId, { url: reqUrl });

    chrome.debugger.detach(debuggeeId);
  }
}

/**
 * @param {string} url
 */
function filter(url) {
  return url.startsWith('http') && url.endsWith('pdf');
}
