import {genTechMeme} from '~background/workflow'
import type { PlasmoMessaging } from "@plasmohq/messaging"
 

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const {tech}=req.body;
    const meme=await genTechMeme(tech)
    console.log(meme,'meme',tech)
    res.send({
        meme
    })
}
 
export default handler