import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const response = await fetch(req.body.url, req.body.options)

    console.log(req.body.options)

    const data = await response.json()

    if (!response.ok) {
      console.error(data)
      throw new Error(data.message || "An unexpected error occurred.")
    }

    res.send({ data })
  } catch (error: any) {
    res.send({ error: error.message || "An unknown internal error occurred." })
  }
}

export default handler
