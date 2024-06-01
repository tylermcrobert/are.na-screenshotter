import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const response = await fetch(req.body.url, req.body.options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An unexpected error occurred.")
    }

    res.send(data)
  } catch (error: any) {
    res.send({ error: error.toString() })
  }
}

export default handler
