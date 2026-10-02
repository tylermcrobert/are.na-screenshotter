import { showCapture } from "./capture"
import { isRecording, stopRecording, toggleRecording } from "./recording"

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-recording" && tab) {
    toggleRecording(tab)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  if (await isRecording()) {
    stopRecording()
  } else if (tab.id) {
    showCapture(tab, await chrome.tabs.captureVisibleTab())
  }
})
