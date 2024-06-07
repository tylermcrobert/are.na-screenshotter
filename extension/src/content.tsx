import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import Window from "~components/Window"

export default function content() {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "screenshot") {
        setOpen(!isOpen)
        sendResponse({})
      }
    })
  }, [])

  if (!isOpen) return null

  return (
    <div className="root">
      <Window closeWindow={() => setOpen(false)}>
        <iframe
          src="chrome-extension://elbbeemhfnkpohdahlhlmhkjnjkbbpgd/tabs/iframe.html"
          className="w-full h-full"
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
