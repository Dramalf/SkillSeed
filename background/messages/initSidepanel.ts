import {storage} from "~background/db";

import type { PlasmoMessaging } from "@plasmohq/messaging"
 

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//   const message = await querySomeApi(req.body.id)
const  table=await storage.get('labels');
let data={}
if(table==null){
    return 
}
await Promise.all(table.map(async (item)=>{let techs=await storage.get(item);data[item]=techs}))
    console.log(req,'initSidepanel',table)
  res.send({
    message:{data}
  })
}
 
export default handler