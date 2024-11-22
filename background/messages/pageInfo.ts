import { type PlasmoMessaging } from "@plasmohq/messaging"
import { storage } from "~background/db";
// import { summarizer } from '~background/summarizer'
import { extractKeyWords, recapRelationship } from '~background/workflow'
function cleanText(input) {
    const onlyEnglish = input.replace(/[^\x00-\x7F]/g, '');
    const regex = /[0-9\W_]+/g; // \W 匹配非单词字符，包括符号；_ 特意包含下划线
    // 使用正则替换，所有匹配的字符替换为空格
    return onlyEnglish.replace(regex, " ").replace(/\s+/g, " ").trim();
}
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    //   const message = await querySomeApi(req.body.id)

    let { title, url } = req.sender.tab;
    console.log('handle pageInfo', { title, url })
    let _url=new URL(url)
    await storage.ready;
    if (await storage.get(title) != null) {

        console.log('already processed ' + title)
        return
    }
    const pageInfo =
        `{ tile:${cleanText(title)},url:${_url.pathname}}`;
    extractKeyWords(pageInfo)
        .then(recapRelationship)
        .then(() => {
            res.send({ok:true})
            return storage.set(title, true)
            
        })
    // await summarizer.ready;
    // const summary = await summarizer.summarize(pageInfo);
    // console.log(summary, 'summary')
    // chrome.runtime.sendMessage({ name: 'summary', body: {summary} });

    //   res.send({
    //     message
    //   })
}

export default handler