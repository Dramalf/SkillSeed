import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"


export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],

}
const sleep = (s: number, unit = 1000) => new Promise(resolve => setTimeout(resolve, s * unit))
async function reportPageInfo() {
  await sleep(5);
  sendToBackground({
    name: "pageInfo",
    body: {
      
    }
  }).then(res=>{
    if(res.ok==true){
      showTip()
    }
  })
}
reportPageInfo()

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


function onTitleChange() {
  console.log('Title changed to:', document.title);
  reportPageInfo();
}


const observer = new MutationObserver(debounce(() => {
  onTitleChange();
}, 5000)); 


observer.observe(document.querySelector('title'), {
  childList: true, 
});


function showTip(){
  
const bubble = document.createElement('div');
bubble.textContent = "You are learning something new!";
bubble.style.position = 'fixed';
bubble.style.bottom = '20px';
bubble.style.right = '20px';
bubble.style.padding = '15px';
bubble.style.backgroundColor = '#4CAF50'; 
bubble.style.color = 'white'; 
bubble.style.fontSize = '16px';
bubble.style.fontWeight = 'bold';
bubble.style.borderRadius = '25px';
bubble.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
bubble.style.zIndex = '9999'; 
bubble.style.transition = 'opacity 0.5s ease'; 


document.body.appendChild(bubble);


setTimeout(() => {
  bubble.style.opacity = '0'; 
  setTimeout(() => {
    document.body.removeChild(bubble); 
  }, 500); 
}, 3000);

}