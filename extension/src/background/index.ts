import { MESSAGE } from "~lib/messages"

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    const screenshot = await chrome.tabs.captureVisibleTab()

    chrome.storage.local.set({
      screenshot,
      tabUrl: tab.url ?? "",
      tabTitle: tab.title ?? ""
    })

    chrome.tabs.sendMessage(tab.id, { type: MESSAGE.SCREENSHOT })
  }
})
