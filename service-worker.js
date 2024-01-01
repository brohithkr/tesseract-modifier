// @ts-check

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   console.log(sender.tab?.url);
//   // @ts-ignore
//   sendResponse({ url: sender.tab?.url });
//   return undefined;
// });

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (
    details.url.match('https://tesseractonline.com/student/subject/.+/unit/.+/topic/.+/content')
  ) {
    getPdfUrl(details.tabId, details.url);
  }
});

/**
 * @param {number} tabId
 * @param {string} tabUrl
 */
async function getPdfUrl(tabId, tabUrl) {
  console.log(tabId);

  let pdfUrl = await fetchPdfUrlFromStorage(tabUrl);

  if (pdfUrl != '') {
    chrome.tabs.sendMessage(tabId, { url: pdfUrl });
    return;
  }

  var version = '1.0';
  chrome.debugger.attach(
    {
      tabId: tabId,
    },
    version,
    onAttach.bind(null, tabId, tabUrl)
  );
}

/**
 * @param {number} tabId
 * @param {string} tabUrl
 */
function onAttach(tabId, tabUrl) {
  chrome.debugger.sendCommand(
    {
      //first enable the Network
      tabId: tabId,
    },
    'Network.enable'
  );
  console.log(tabUrl);
  // @ts-ignore
  chrome.debugger.onEvent.addListener(allEventHandler.bind(tabUrl));
}

/**
 * @param {{tabId: number;}} debuggeeId
 * @param {string} message
 * @param {{request: {url: any;};requestId: any;response: {url: any;};}} params
 * @param {string} tabUrl
 */
async function allEventHandler(debuggeeId, message, params, tabUrl) {
  var reqUrl = '';
  if (params.request && params.request.url) {
    reqUrl = params.request.url;
  }
  console.log(reqUrl);
  if (reqUrl && filter(reqUrl)) {
    console.log(`found: ${reqUrl}`);

    let resp = await chrome.tabs.sendMessage(debuggeeId.tabId, { url: reqUrl, tabUrl });

    chrome.debugger.detach(debuggeeId);
  }
}

/**
 * @param {string} url
 */
function filter(url) {
  return url.startsWith('http') && url.endsWith('pdf');
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
async function fetchPdfUrlFromStorage(url) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([url], (obj) => {
      resolve(obj[url] ? obj[url] : '');
    });
  });
}
