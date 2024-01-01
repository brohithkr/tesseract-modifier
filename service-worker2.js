// @ts-check

async function getCurrentTabUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}

/**
 * @type {number}
 */
let currentTabId;
let version = '1.0';
let server = '';
const requests = new Map();

// try {
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  let currentTabUrl = await getCurrentTabUrl();
  console.log("hello");
  console.log(currentTabUrl);
  console.log(
    currentTabUrl?.match('https://tesseractonline.com/student/subject/.+/unit/.+/topic/.+/contentm')
  );
  //  if (
  // !currentTabUrl?.match(
  //   'https://tesseractonline.com/student/subject/.+/unit/.+/topic/.+/contentm'
  // )
  //  ) {
  //    return;
  //  }
  currentTabId = tabId;
  chrome.debugger.attach(
    {
      tabId: currentTabId,
    },
    version,
    onAttach.bind(null, currentTabId)
  );
  chrome.debugger.onDetach.addListener(debuggerDetachHandler);
  console.log('attach');
  //  sendResponse({status:0});
});
function debuggerDetachHandler() {
  console.log('detach');
  requests.clear();
}
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
// https://chromedevtools.github.io/devtools-protocol/tot/Network
/**
 * @param {{ tabId: number; }} debuggeeId
 * @param {string} message
 * @param {{ request: { url: any; }; requestId: any; response: { url: any; }; }} params
 */
function allEventHandler(debuggeeId, message, params) {
  console.log(params.request.url);
}

function filter(url) {
  return url.startsWith('http') && !url.endsWith('css') && !url.endsWith('js');
}
// } catch (e) {
//   console.log(e);
// }
