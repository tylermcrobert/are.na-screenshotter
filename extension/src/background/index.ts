import { MESSAGE } from "~lib/messages"

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    const screenshot = await chrome.tabs.captureVisibleTab()

    chrome.storage.local.set({
      screenshot,
      tabUrl: tab.url ?? "",
      tabTitle: tab.title ?? ""
    })

    chrome.tabs.sendMessage(tab.id, {
      type: MESSAGE.SCREENSHOT,
      base64Image: screenshot
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === MESSAGE.CLOSE_PANEL && sender.tab?.id != null) {
    void chrome.tabs.sendMessage(sender.tab.id, { type: MESSAGE.CLOSE_PANEL })
  }
})
