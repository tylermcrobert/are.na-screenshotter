import { showCapture } from "./capture"
import {
  createRecordingMenu,
  isRecording,
  RECORDING_MENU_ID,
  stopRecording,
  toggleRecording
} from "./recording"

chrome.runtime.onInstalled.addListener(createRecordingMenu)

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-recording" && tab) {
    toggleRecording(tab)
  }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === RECORDING_MENU_ID && tab) {
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
