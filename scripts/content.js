// @ts-check

(async () => {
  var currUrl = window.location.href;
  let pdfUrl = await fetchPdfUrlFromStorage(currUrl);

  if (pdfUrl != '') {
    injectDownloadButton(pdfUrl);
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    var pdfUrl = msg.url;
    // console.log(window.location.href);
    if (pdfUrl && pdfUrl != '') {
      chrome.storage.sync.set({
        [window.location.href]: pdfUrl,
      });
    }

    injectDownloadButton(pdfUrl);

    sendResponse();
    return undefined;
  });
})();

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

/**
 * @param {string} pdfUrl
 */
async function getButtonStr(pdfUrl) {
  let downloadSvgPath = chrome.runtime.getURL('assets/download-button.svg');
  var downloadSvg = await (await fetch(downloadSvgPath)).text();

  return `<a href="${pdfUrl}">
  <button id="pdf-download" style="border: none; background-color: #ffff; cursor: pointer">
  ${downloadSvg}
  </button>
  </a>`;
}

/**
 * @param {string} pdfUrl
 */
function injectDownloadButton(pdfUrl) {
  /**
   * @type {Element}
   */
  var pdfPanel;

  let timer = setInterval(async () => {
    pdfPanel = document.getElementsByClassName('pdf-control-panel')[0];
    if (pdfPanel) {
      clearTimeout(timer);

      var buttonStr = await getButtonStr(pdfUrl);

      if (!document.getElementById('pdf-download')) {
        pdfPanel.innerHTML += buttonStr;
      }
    }
  }, 150);
}
