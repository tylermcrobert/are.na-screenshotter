import {
  MESSAGE,
  type RecordingMessage,
  type RecordingResult
} from "~lib/messages"

import { showCapture } from "./capture"

/** Session storage survives the service worker being suspended mid-recording */
const RECORDING_TAB_KEY = "recordingTabId"
export const RECORDING_MENU_ID = "toggle-recording"

let stopping = false

export async function createRecordingMenu() {
  await chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    id: RECORDING_MENU_ID,
    title: "Record this tab",
    contexts: ["action", "page"]
  })
}

function setRecordingMenuTitle(title: string) {
  return chrome.contextMenus.update(RECORDING_MENU_ID, { title })
}

export async function isRecording() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT]
  })
  return contexts.length > 0
}

export async function toggleRecording(tab: chrome.tabs.Tab) {
  if (await isRecording()) {
    await stopRecording()
  } else if (tab.id) {
    await startRecording(tab.id)
  }
}

async function startRecording(tabId: number) {
  /** Must run before createDocument so uncapturable tabs (e.g. chrome://) fail without leaving a document behind */
  const streamId = await getMediaStreamId(tabId)

  await chrome.offscreen.createDocument({
    url: "tabs/offscreen.html",
    reasons: [chrome.offscreen.Reason.USER_MEDIA],
    justification: "Record the current tab to convert into a GIF"
  })
  await chrome.storage.session.set({ [RECORDING_TAB_KEY]: tabId })

  chrome.runtime.sendMessage<RecordingMessage>({
    type: MESSAGE.START_RECORDING,
    streamId
  })

  await chrome.action.setBadgeText({ text: "REC" })
  await chrome.action.setBadgeBackgroundColor({ color: "#d93025" })
  await setRecordingMenuTitle("Stop recording")
}

export async function stopRecording() {
  if (stopping) return
  stopping = true
  await chrome.action.setBadgeText({ text: "…" })

  try {
    const result = await chrome.runtime
      .sendMessage<RecordingMessage, RecordingResult>({
        type: MESSAGE.STOP_RECORDING
      })
      .catch((error): RecordingResult => ({ error: String(error) }))

    await chrome.offscreen.closeDocument()

    const { [RECORDING_TAB_KEY]: tabId } =
      await chrome.storage.session.get(RECORDING_TAB_KEY)
    await chrome.storage.session.remove(RECORDING_TAB_KEY)

    if ("error" in result) console.error("Recording failed:", result.error)

    const tab = await chrome.tabs.get(tabId).catch(() => null)
    if (tab?.id) {
      await chrome.tabs.update(tab.id, { active: true })
      await showCapture(tab, "gif" in result ? result.gif : null)
    }
  } finally {
    stopping = false
    await chrome.action.setBadgeText({ text: "" })
    await setRecordingMenuTitle("Record this tab")
  }
}

/** The installed @types/chrome only types the callback form */
function getMediaStreamId(tabId: number) {
  return new Promise<string>((resolve, reject) => {
    chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, (streamId) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve(streamId)
      }
    })
  })
}
