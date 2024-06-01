import Auth from "~components/Auth"
import Capture from "~components/Capture"

import "./style.css"

import { useEffect, useState } from "react"

function IndexPopup() {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    chrome.storage.local.get("accessToken").then((res) => {
      setAccessToken(res.accessToken)
    })
  }, [])

  return (
    <div className="px-2 w-[270px]">
      {accessToken ? <Capture /> : <Auth setAccessToken={setAccessToken} />}
    </div>
  )
}

export default IndexPopup
