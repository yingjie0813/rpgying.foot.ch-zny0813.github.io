/* ==================== 說話者：把 who 變成角色物件 ==================== */

import { characters } from "../../data/story-mode/characters.js";
import { playerData } from "../../data/player.js";
import { applyPortrait } from "../portrait.js";

const cache = {};     /*角色名 → 角色物件（複製品，查到的頭像存在這裡，不會改到原始資料）*/

/* who：台詞裡的說話者。
   "{name}" 回傳玩家自己（playerData）；
   其他回傳 characters.js 裡的角色資料，img 留空會去 portraits.js 找，找不到就用印章頭像。
   onPortraitReady：頭像查到之後的回呼（用來讓畫面重畫）。 */
export function getSpeaker(who, onPortraitReady){
    const key = String(who == null ? "" : who).trim();
    if(key === "{name}"){
        return playerData;
    };
    if(!cache[key]){
        const base = characters[key] || {};
        cache[key] = { ...base, name: base.name || key, img: base.img || "", imgAlts: [] };
        applyPortrait(cache[key], onPortraitReady);
    };
    return cache[key];
};
