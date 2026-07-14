const KEY='wegojob_onboarding_v2';
export function loadOnboarding(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}}
export function saveOnboarding(data){const merged={...loadOnboarding(),...data};localStorage.setItem(KEY,JSON.stringify(merged));return merged}
