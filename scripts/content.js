// @ts-check

(async () => {
  /**
   * @type {Element}
   */
  var pdfPanel;
  let downloadSvgPath = chrome.runtime.getURL('assets/download-button.svg');
  var downloadSvg = await (await fetch(downloadSvgPath)).text();

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    let timer = setInterval(() => {
      pdfPanel = document.getElementsByClassName('pdf-control-panel')[0];
      if (pdfPanel) {
        clearTimeout(timer);
        const pdfUrl = msg.url;
        // alert(`${pdfPanel} ${pdfUrl}`);
        console.log(pdfPanel);
        pdfPanel.innerHTML += `<a href="${pdfUrl}"><button style="border: none; background-color: #ffff; cursor: pointer">${downloadSvg}</button></a>`;
        sendResponse();
      }
    }, 150);
    // console.log()
    return undefined;
    // console.log(msg);
  });
})();
