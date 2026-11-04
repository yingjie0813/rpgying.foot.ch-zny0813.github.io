/* ==================== 結局：資料查詢與「已達成」記錄 ==================== */
/* 結局內容在 data/story-mode/endings.js。這裡只負責查詢，以及把達成過的結局記在瀏覽器（localStorage）。
   瀏覽器不允許儲存時，至少在這次開啟期間有效。 */

import { endings } from "../../data/story-mode/endings.js";

const KEY = "jianghu_yeqiu_story_endings";     /*key 不可隨意更動，否則舊紀錄會失效*/
let memory = {};

export function getEnding(id){
    return Object.prototype.hasOwnProperty.call(endings, id) ? endings[id] : null;
};

function readAll(){
    try{
        const raw = localStorage.getItem(KEY);
        const data = raw ? JSON.parse(raw) : {};
        return Object.assign({}, data, memory);
    }catch(e){
        return Object.assign({}, memory);
    };
};

/*記錄達成了某結局；回傳 true 代表這是第一次達成*/
export function recordEnding(id){
    const all = readAll();
    const isNew = !all[id];
    memory[id] = memory[id] || Date.now();
    try{
        const saved = Object.assign({}, all, memory);
        localStorage.setItem(KEY, JSON.stringify(saved));
    }catch(e){};
    return isNew;
};

/*已達成幾個、總共幾個（只算還存在於 endings.js 的結局）*/
export function endingProgress(){
    const all = readAll();
    const ids = Object.keys(endings);
    const got = ids.filter(function(id){ return !!all[id]; }).length;
    return { got: got, total: ids.length };
};
