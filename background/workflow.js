import { prompt, memePrompt } from './prompt.js';
import { storage } from './db.js'
const extractKeyWords = async (summary) => {
    const command = `Your tasks are:
* Extract the technical skills from the title and url
* Return these tech skills as an array of strings. No more extra explaination is needed.
* Ensure the list is concise and contains no more than 2 items. No need to include generic terms like "computer" or "technology." 
* If no clear technical concepts are mentioned, return an empty array.
* Your answer should only contain English chracaters and spaces.
Example Output:
["WebGPU","Machine Learning"]
Here is a summary of a computer technical summary title and url:
[${summary}]
return the array of keywords.
`
    await prompt.ready;
    let ansStr = await prompt.call(command);
    ansStr=ansStr.toLowerCase();
    let res = [];
    const match = ansStr.match(/\[.*?\]/);
    if (match) {
        try {
            res = JSON.parse(match[0])

        } catch (error) {
            res = []
        }
    }
    console.log("result extract", res);
    return res;
}
const recapRelationship = async (keywords) => {
    await storage.ready;
    if (!keywords || keywords.length == 0) {
        return
    }
    const labels = await storage.get('labels') || [];
    const existedKeywords = await storage.get('keywords') || [];
    keywords = keywords.filter((keyword) => !existedKeywords.includes(keyword));
    const command = `Given an array of computer science keywords and an array of concept labels, construct a JSON object where:  

Example Output JSON:  
{
    "WehGL": ["Graphics","Web Development"],#No longer than 2
    "Redis": ["Database"],# Create a new label if no match
    "TensorFlow": ["Artificial Intelligence"] 
}  

1. Each keyword serves as a key.  Only handle the keywords that are specific tech skills, for example, "WebGL" or "TensorFlow"
2. If a keyword is a concept and not a tech skill, do not handle it, for example, "networking" or "algorithms"
3. If no label matches a keyword, generate a new, concise label that logically describes the keyword based on its context.  
If not sure about some keywords, don't set it in the final object
The value of JSON can't longer than 2 items.
* Your answer should only contain English chracaters and spaces.

Your task:
Input keywords: [${keywords}]  
Input labels: [${labels}]  
Return JSON only.  
`
console.log(command)
    let ansStr = await prompt.call(command);
    ansStr=ansStr.toLowerCase();
    let table = {};
    try {
        table = JSON.parse(ansStr);
    } catch (e) {
        table = null
    }
    console.log("table relationship", table);
    for (let key in table) {
        if (table[key] && Array.isArray(table[key]) && table[key].length != 0) {
            table[key] = table[key].map((label) => label);
            storage.set(key, table[key]);
            for (let label of table[key]) {
                if (label == key) {
                    continue;
                }
                if (!labels.includes(label)) {
                    labels.push(label)
                    await storage.set(label, []);
                }
                let c = await storage.get(label);
                c.push(key);
                await storage.set(label, c);
            }
            existedKeywords.push(key);
        }
    }
    await storage.set('labels', labels)

    await storage.set('keywords', existedKeywords);
}

async function genTechMeme(tech) {
    await memePrompt.ready;
    const command = `Given a tech term as input, please return a plain text of a joke, meme, or roast the learner about it. The response should be joke/meme/roast-only, with no additional text or explanation.
For example:
tech term :[parallel computation]
return:
"Parallel computation is like a group project: everyone works at the same time, but there's always one thread doing all the heavy lifting while another is stuck waiting on locks."

your task:
input:[${tech}]

`
    const ans = await memePrompt.call(command);
    return ans;
}

export {
    extractKeyWords,
    recapRelationship,
    genTechMeme
}