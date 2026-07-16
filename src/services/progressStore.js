const KEY='wegojob_progress_v4';
export function loadProgress(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}}
export function markCompleted(id){const p={...loadProgress(),[id]:true};localStorage.setItem(KEY,JSON.stringify(p));return p}
export function clearProgress(){localStorage.removeItem(KEY)}
export function progressPercent(){
 const required=['personal','bank','zus','confidentiality','ppk','photos'];
 const p=loadProgress();
 return Math.round(required.filter(x=>p[x]).length/required.length*100);
}
