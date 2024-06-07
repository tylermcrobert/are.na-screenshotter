chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    const screenshot = await chrome.tabs.captureVisibleTab()

    chrome.storage.local.set({ screenshot: screenshot })

    chrome.tabs.sendMessage(tab.id, {
      type: "screenshot",
      base64Image: screenshot
    })
  }
})
