import { showCapture } from "./capture"
import { toggleRecording } from "./recording"

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-recording" && tab) {
    toggleRecording(tab)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    showCapture(tab, await chrome.tabs.captureVisibleTab())
  }
})
