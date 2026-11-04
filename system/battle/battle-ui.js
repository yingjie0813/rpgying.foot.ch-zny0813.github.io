/* ==================== 王關畫面：頭目面板、按鈕切換、紀錄捲動 ==================== */

import { state } from "../state.js";
import { battleLogContent, choiceButtons, nextButton, panelHeading } from "../dom.js";

/*更新boss數據*/
export function updateBossStatus(screen){
    /*檢查有無數據溢出*/
    if(state.currentBoss.hp > state.currentBoss.maxHp){
        state.currentBoss.hp = state.currentBoss.maxHp;
    };
    if(state.currentBoss.hp <= 0){
        state.currentBoss.hp = 0;      /*後續製作獲勝函數*/
    };
    /*更新數據*/
    screen.querySelector("#boss-name").textContent = state.currentBoss.name;
    let tempText = state.currentBoss.hp + " / " + state.currentBoss.maxHp;
    const hpPer = state.currentBoss.hp / state.currentBoss.maxHp * 100;
    screen.querySelector("#boss-hp-fill").style.width = hpPer + "%";    
    screen.querySelector("#boss-hpText").textContent = tempText;
    screen.querySelector("#boss-atk").textContent = state.currentBoss.atk;
    screen.querySelector("#boss-def").textContent = state.currentBoss.def;

};

/*下一步和猜拳按鈕切換*/
export function swBattleButton(tf){
    if(tf){     /*要，切換為繼續按鈕*/
        choiceButtons.forEach(function(button){
            button.hidden = true;   /*隱藏*/
        });
        nextButton.hidden = false;
        panelHeading.textContent = "繼續";
    }else{      /*否，切換為猜拳按鈕*/
        choiceButtons.forEach(function(button){
            button.hidden = false;
        });
        nextButton.hidden = true;
        panelHeading.textContent = "選擇招式";
    };
};

/*戰鬥紀錄自動捲動*/
export function scrollBattleLog(){
    battleLogContent.scrollTo({
        top: battleLogContent.scrollHeight,
        behavior: "smooth"
    });
};
