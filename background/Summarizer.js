class Summarizer{
    constructor(){
        this.summarizer = null
        this.waiting=false;
        this.waitlist=[];
        this.ready=this.init();
    }
    async init(){
        const options = {
            sharedContext: 'This is a scientific article',
            type: 'key-points',
            format: 'markdown',
            length: 'short',
          };
          
          const available = (await self.ai.summarizer.capabilities()).available;
          let summarizer;
          if (available === 'no') {
            // The Summarizer API isn't usable.
            return;
          }
          if (available === 'readily') {
            // The Summarizer API can be used immediately .
            summarizer = await self.ai.summarizer.create(options);
          } else {
            // The Summarizer API can be used after the model is downloaded.
            summarizer = await self.ai.summarizer.create(options);
            summarizer.addEventListener('downloadprogress', (e) => {
              console.log(e.loaded, e.total);
            });
            await summarizer.ready;
          }
          this.summarizer = summarizer
    }
    async summarize(text){
        if(this.waiting){
            // if(this.waitlist.length==0){
            //     this.waitlist.push(text);
            // }else if(text!=this.waitlist[this.waitlist.length-1]){
            //     this.waitlist.push(text);
            // }
            return ;
        }
        const ans=await this.summarizer.summarize(text)
        this.waiting=false;
        // if(this.waitlist.length>0){
        //     this.waiting=true;
        //     const next=this.waitlist.shift();
        //     this.summarize(next);
        // }
        return ans;
    }    
}

const summarizer=new Summarizer();
export {
    summarizer
} 