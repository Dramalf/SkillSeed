import { storage } from "~background/db";

import type { PlasmoMessaging } from "@plasmohq/messaging"


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { node,new_name,nodeLabels } = req.body;
  await storage.ready;
  let labels = await storage.get('labels')
  let keywords = await storage.get('keywords')
  if (labels.includes(node)) {
    await storage.set("labels", labels.filter((item) => item != node))
    const techs=await storage.get(node);
    await storage.set(new_name,techs)
    await storage.delete(node)
  } else {
    keywords=keywords.filter((item) => item != node)
    keywords.push(new_name);
    nodeLabels.map(async label=>{
      let techs=await storage.get(label);
      techs=techs.filter((item) => item != node)
      techs.push(new_name);
      storage.set(label,techs);
    })
    await storage.set("keywords", keywords)

  }
}

export default handler