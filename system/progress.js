/* ==================== 關卡進度 ==================== */

import { gameProgress } from "../data/player.js";
import { gameScreen } from "./dom.js";

/*大關的中文數字（第一大關～第十大關）*/
export const LEVEL_NUM = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

/*初始化關卡進度*/
export function initialGameProgress(){
    const keys = Object.keys(gameProgress);
    keys.forEach(function(key){
        gameProgress[key] = 1;
    });
};

/*更新函數*/
export function updateLevelStatus(screen){
    /*更新大關*/
    const statusPanelLevel = screen.querySelector(".status-panel-level");

    statusPanelLevel.textContent = "第" + (LEVEL_NUM[gameProgress.majorLevel-1] || gameProgress.majorLevel) + "大關";
    /*更新小關*/
    screen.querySelector(".current-level").textContent = gameProgress.smallLevel;
};

/*推進關卡*/
export function nextLevel(){
    gameProgress.smallLevel += 1;
    updateLevelStatus(gameScreen);
};
