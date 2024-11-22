export {}
import {storage} from "./db.js"
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
console.log('BG script running')
async function init(){
    await storage.ready;
    await Promise.all(['labels','keywords'].map(async (key)=>{(await storage.get(key)!=null||await storage.set(key,[]))}))
}
init();
// async function initDefault(){
//     await storage.set("WebRTC", ["Web Development", "WebRTC"])
//     await storage.set("ReactJS", ["Web Development"])
//     await storage.set("SpringBoot", ["Java", "Backend Development"])
//     await storage.set("Docker", ["Cloud", "Containization"])
//     await storage.set("Kubernates", ["Cloud"])
//     await storage.set("path track", ["Computer Graphic"])
//     await storage.set("labels", ["Computer Graphic","Web Development","Java","Backend Development","Cloud","Containization"])
//     await storage.set("Computer Graphic", ["path track"])
//     await storage.set("Backend Development", ["SpringBoot"])
//     await storage.set("Java", ["SpringBoot"])
//     await storage.set("Cloud", ["Docker","Kubernates"])
//     await storage.set("Containization", ["Docker"])
//     await storage.set("Web Development", ["ReactJS","WebRTC"])
// }
// initDefault()