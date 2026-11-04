/* ==================== 難度選擇與無盡解鎖 ==================== */

import { difficultyConfig } from "../data/difficulty.js";
import { state } from "./state.js";
import { difficultyCards } from "./dom.js";
import { endingProgress } from "./story-mode/ending.js";

/*通關過一次就把這個旗標存在瀏覽器（localStorage）裡，下次開啟還在。key 不可隨意更動，否則舊紀錄會失效*/
const ENDLESS_KEY = "jianghu_yeqiu_endless_unlocked";
let endlessMemory = false;     /*瀏覽器不允許儲存時，至少在這次開啟期間有效*/

export function endlessUnlocked(){
    try{
        return localStorage.getItem(ENDLESS_KEY) === "1" || endlessMemory;
    }catch(e){
        return endlessMemory;
    };
};

/*通關一次（任何難度）就開放無盡*/
export function unlockEndless(){
    state.endlessJustUnlocked = !endlessUnlocked();
    endlessMemory = true;
    try{
        localStorage.setItem(ENDLESS_KEY, "1");
    }catch(e){};
};

/*依目前難度與解鎖狀態重畫四張難度卡片*/
export function refreshDifficultyCards(){
    const unlocked = endlessUnlocked();
    if(state.currentDifficulty === "endless" && !unlocked){
        state.currentDifficulty = "normal";
    };
    difficultyCards.forEach(function(card){
        const key = card.dataset.diff;
        const locked = (key === "endless" && !unlocked);
        card.classList.toggle("locked", locked);
        card.setAttribute("aria-disabled", String(locked));
        card.setAttribute("aria-checked", String(key === state.currentDifficulty));
        card.querySelector(".difficulty-desc").textContent =
            locked ? difficultyConfig[key].lockedDesc : difficultyConfig[key].desc;
        if(key === "story"){     /*故事卡片多顯示結局達成數*/
            const p = endingProgress();
            if(p.total > 0){
                card.querySelector(".difficulty-desc").textContent += "（結局 " + p.got + "/" + p.total + "）";
            };
        };
    });
};

/*綁定難度卡片點擊，並畫出初始狀態*/
export function initDifficultyCards(){
    difficultyCards.forEach(function(card){
        card.addEventListener("click", function(){
            if(card.classList.contains("locked")){
                return;
            };
            state.currentDifficulty = card.dataset.diff;
            refreshDifficultyCards();
        });
    });

    refreshDifficultyCards();
};
