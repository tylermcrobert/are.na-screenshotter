import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import Window from "~components/Window"
import { MESSAGE } from "~lib/messages"

export default function Content() {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    function onMessage(
      message: { type: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: () => void
    ) {
      if (message.type === "screenshot") {
        setOpen((open) => !open)
        sendResponse()
      } else if (message.type === MESSAGE.CLOSE_PANEL) {
        setOpen(false)
      }
    }
    chrome.runtime.onMessage.addListener(onMessage)
    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [])

  if (!isOpen) return null

  return (
    <div className="root">
      <Window closeWindow={() => setOpen(false)}>
        <iframe
          src={chrome.runtime.getURL("tabs/iframe.html")}
          className="h-full w-full"
        />
      </Window>
    </div>
  )
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
