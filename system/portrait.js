/* ==================== 頭像功能 ==================== */
/* 依名字到人物誌對照表（data/portraits.js）找頭像網址。
   對照表每個角色的圖片可以寫成：
     單一網址   "沈非笑": "https://.../24171.jpeg"
     多張網址   "沈非笑": ["https://.../24171.jpeg", "https://.../第二張.jpeg"]
   規則：名字完全相符才算找到（前後空白會先去掉）；空字串、不是字串的值會被略過；
         名字不在表裡一律回傳 null / []，不會丟錯。 */

import { PORTRAITS } from "../data/portraits.js";

/*取出某個名字的所有有效網址(去空白、去重複)*/
function listFor(name){
    const key = String(name == null ? "" : name).trim();
    const table = PORTRAITS;
    if(!key || !table || typeof table !== "object"){ return []; }
    if(!Object.prototype.hasOwnProperty.call(table, key)){ return []; }
    const raw = table[key];
    const arr = Array.isArray(raw) ? raw : [raw];
    const out = [];
    arr.forEach(function(u){
        if(typeof u !== "string"){ return; }
        const s = u.trim();
        if(s && out.indexOf(s) < 0){ out.push(s); }
    });
    return out;
}

/*全部網址的陣列；找不到 → []（回傳 Promise）*/
export function findPortraits(name){
    return Promise.resolve(listFor(name));
}

/*隨機給一張網址；找不到 → null（回傳 Promise）*/
export function findPortrait(name){
    const list = listFor(name);
    return Promise.resolve(list.length ? list[Math.floor(Math.random() * list.length)] : null);
}

/*角色已經有 img 網址就沿用；沒有的話用名字查人物誌對照表（data/portraits.js）。
  對照表裡同一角色有多張圖時，隨機抽一張放進 img，其餘放進 imgAlts 當備用
  （抽中的圖載入失敗時，畫面會自動改用備用圖）。
  查不到就維持空字串，畫面會退回印章頭像。查到後呼叫 refresh 重畫畫面。*/
export function applyPortrait(person, refresh){
    if(!person || person.img){ return; };
    const name = person.name;
    findPortraits(name).then(function(list){
        if(!list.length || person.name !== name || person.img){ return; };
        const pick = Math.floor(Math.random() * list.length);
        person.img = list[pick];
        person.imgAlts = list.filter(function(_, i){ return i !== pick; });
        if(typeof refresh === "function"){ refresh(); };
    }).catch(function(){});
};
