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
      // content:document.body.innerText
    }
  }).then(res=>{
    if(res.ok==true){
      showTip()
    }
  })
}
reportPageInfo()
// 防抖函数
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 监听 title 变化的回调函数
function onTitleChange() {
  console.log('Title changed to:', document.title);
  reportPageInfo();
}

// 创建 MutationObserver 来监听 title 的变化
const observer = new MutationObserver(debounce(() => {
  onTitleChange();
}, 5000)); // 5000 毫秒防抖

// 观察 title 标签的变化
observer.observe(document.querySelector('title'), {
  childList: true, // 监听子节点的变化
});


function showTip(){
  // 创建气泡消息元素
const bubble = document.createElement('div');
bubble.textContent = "You are learning something new!";
bubble.style.position = 'fixed';
bubble.style.bottom = '20px';
bubble.style.right = '20px';
bubble.style.padding = '15px';
bubble.style.backgroundColor = '#4CAF50'; // 背景色
bubble.style.color = 'white'; // 文字颜色
bubble.style.fontSize = '16px';
bubble.style.fontWeight = 'bold';
bubble.style.borderRadius = '25px';
bubble.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
bubble.style.zIndex = '9999'; // 确保气泡消息在页面最上层
bubble.style.transition = 'opacity 0.5s ease'; // 添加淡出效果

// 将气泡消息添加到页面
document.body.appendChild(bubble);

// 设置气泡消息显示时间（3秒后消失）
setTimeout(() => {
  bubble.style.opacity = 0; // 设置透明度为0来实现淡出效果
  setTimeout(() => {
    document.body.removeChild(bubble); // 彻底移除气泡消息
  }, 500); // 等待动画完成后移除元素
}, 3000);

}