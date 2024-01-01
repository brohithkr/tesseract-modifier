// @ts-check

(async () => {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    /**
     * @type {Element}
     */
    var pdfPanel;
    let timer = setInterval(() => {
      pdfPanel = document.getElementsByClassName('pdf-control-panel')[0];
      if (pdfPanel) {
        clearTimeout(timer);
        const pdfUrl = msg.url;
        // alert(`${pdfPanel} ${pdfUrl}`);
        console.log(pdfPanel);
        pdfPanel.innerHTML += `<a href="${pdfUrl}"><button></button></a>`;
        sendResponse();
      }
    }, 150);
    // console.log()
    return undefined;
    // console.log(msg);
  });
})();
