import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const response = await fetch(req.body.url, req.body.options)
    const data = await response.json()

    if (!response.ok) {
      console.error(data)
      throw new Error(
        data.details?.message || data.error || data.message || "An unexpected error occurred."
      )
    }

    res.send({ data })
  } catch (error: any) {
    console.error("Error fetching in background:", error)
    res.send({ error: error.message || "An unknown internal error occurred." })
  }
}

export default handler
