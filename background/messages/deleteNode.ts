import { storage } from "~background/db";

import type { PlasmoMessaging } from "@plasmohq/messaging"


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { node ,nodeLabels} = req.body;
  await storage.ready;
  const labels = await storage.get('labels')
  const keywords = await storage.get('keywords')
  if (labels.includes(node)) {
    await storage.set("labels", labels.filter((item) => item != node))
    await storage.delete(node)
  } else {
    await storage.set("keywords", keywords.filter((item) => item != node))
    nodeLabels.map(async label => {
      let techs = await storage.get(label);
      techs = techs.filter((item) => item != node)
      storage.set(label, techs);
    })
  }
}

export default handler