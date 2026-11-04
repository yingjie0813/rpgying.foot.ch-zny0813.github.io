/* ==================== 小關事件：抽選 ==================== */

import { eventData } from "../../data/events.js";
import { speEventData } from "../../data/special-events.js";
import { state } from "../state.js";

/*特殊事件判斷函數
  speEventData 的編號從 1 開始，eventData 的索引從 0 開始，所以 temp 對應的是 temp + 1。
  條件(cond)成立時，有 50% 機率換成特殊版；否則回傳 null，使用一般版。*/
function speEventCond(temp){
    const event = speEventData[temp + 1];
    if(!event || typeof event.cond !== "function" || !event.cond()){
        return null;
    };
    if(Math.random() >= 0.5){
        return null;
    };
    return event.spe_event;
};

/*小關隨機事件決定函數（牌堆抽完才重新洗牌，不重複抽取）*/
export function randomSmall(){
    if(state.eventPool.length === 0){
        state.eventPool = eventData.map(function(_, i){ return i; });
        for(let i = state.eventPool.length - 1; i > 0; i--){
            const k = Math.floor(Math.random() * (i + 1));
            [state.eventPool[i], state.eventPool[k]] = [state.eventPool[k], state.eventPool[i]];
        };
    };
    const temp = state.eventPool.pop();
    state.currentSmall = speEventCond(temp) || eventData[temp];
};
