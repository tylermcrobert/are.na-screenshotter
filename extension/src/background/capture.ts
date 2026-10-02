import { MESSAGE } from "~lib/messages"

/**
 * Store a capture (screenshot or GIF data URL) and open the panel on its tab
 * @param tab Tab the capture came from
 * @param screenshot Data URL, or null if capturing failed
 */
export async function showCapture(tab: chrome.tabs.Tab, screenshot: string | null) {
  if (!tab.id) return

  await chrome.storage.local.set({
    screenshot,
    tabUrl: tab.url ?? "",
    tabTitle: tab.title ?? ""
  })

  chrome.tabs.sendMessage(tab.id, { type: MESSAGE.SCREENSHOT })
}
