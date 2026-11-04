/* ==================== 故事模式存檔（一個欄位） ==================== */
/* 存在瀏覽器 localStorage；不允許儲存時，至少在這次開啟期間有效。
   存的是「進入某個場景那一刻」的狀態：章節、場景、玩家數值與名字、旗標、場景進入次數。
   讀檔時從該場景的開頭重新播放。 */

const KEY = "jianghu_yeqiu_story_save";     /*key 不可隨意更動，否則舊存檔會失效*/
let memory = null;

export function readSave(){
    try{
        const raw = localStorage.getItem(KEY);
        if(raw){
            const data = JSON.parse(raw);
            if(data && data.v === 1){ return data; };
        };
    }catch(e){};
    return memory;
};

export function writeSave(data){
    memory = data;
    try{
        localStorage.setItem(KEY, JSON.stringify(data));
    }catch(e){};
};
