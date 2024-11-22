import {storage} from "~background/db";

import type { PlasmoMessaging } from "@plasmohq/messaging"
 

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//   const message = await querySomeApi(req.body.id)
    await storage.clear()
}
 
export default handler