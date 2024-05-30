import Auth from "~components/Auth"
import Capture from "~components/Capture"

import "./style.css"

import { useEffect, useState } from "react"

function IndexPopup() {
  const [authCode, setAuthCode] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("auth").then((res) => {
      setAuthCode(res.auth)
    })
  }, [])

  return (
    <div className="px-2 w-[270px]">
      {authCode ? <Capture /> : <Auth onAuth={setAuthCode} />}
    </div>
  )
}

export default IndexPopup
