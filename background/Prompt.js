class Prompt {
    constructor(systemPrompt) {
        this.systemPrompt=systemPrompt;
        this.session = null;
        this.waitlist = [];
        this.waiting = false;
        this.ready = this.init();
    }
    async init() {
        if (!('aiOriginTrial' in chrome)) {
            //   showResponse('Error: chrome.aiOriginTrial not supported in this browser');
            console.log('Error: chrome.aiOriginTrial not supported in this browser');
            return;
        }
        const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
        console.log('Prompt Model default:', defaults);
        if (defaults.available !== 'readily') {
            //   showResponse(
            //     `Model not yet available (current state: "${defaults.available}")`
            //   );
            console.log('Model not yet available (current state: "${defaults.available}")');
            return Promise.reject('Model not yet available');
        }
        const session = await ai.languageModel.create({
            systemPrompt: this.systemPrompt
        });
        chrome.aiChat = session;
        this.session = session;
    }
    async call(command) {
        // console.log("start clone")
        const freshSession = await this.session.clone();
        // console.log("end clone")
        if (this.waiting) {
            // if(this.waitlist.length==0){
            //     this.waitlist.push(command);
            // }else if(command!=this.waitlist[this.waitlist.length-1]){
            //     this.waitlist.push(command);

            // }
            return;
        }
        const ans = await freshSession.prompt(command);
        this.waiting = false;
        // if(this.waitlist.length>0){
        //     this.waiting=true;
        //     const next=this.waitlist.shift();
        //     this.call(next);
        // }
        return ans;
    }

}
const prompt = new Prompt("You are a master of Computer Science and good at extract technical skills from content");

const memePrompt=new Prompt("You are good at telling jokes and memes about technical terms");
export {
    prompt,memePrompt
}