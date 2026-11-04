/* ==================== 玩家面板 ==================== */

import { playerData, initialPlayerData } from "../data/player.js";

/*把文字中的 {name} 換成玩家名字*/
export function fmt(text){
    return String(text).replaceAll("{name}", playerData.name);
};

/*初始化玩家數值*/
export function initialStatusData(){
    const keys = Object.keys(initialPlayerData);
    keys.forEach(function(key){
        playerData[key] = initialPlayerData[key];
    });
};

/*更新玩家函數*/
export function updateStatusPanel(screen){
    /*檢查有無數據溢出*/
    if(playerData.hp > playerData.maxHp){
        playerData.hp = playerData.maxHp;
    };
    if(playerData.hp <= 0){
        playerData.hp = 0;      /*等待增加死亡場景*/
    };
    if(playerData.atk <= 0){
        playerData.atk = 1;
    };
    if(playerData.def <= 0){
        playerData.def = 1;
    };
    /*更新數據*/
    screen.querySelector(".status-panel-name").textContent = playerData.name;
    let tempText = playerData.hp + " / " + playerData.maxHp;
    const hpPer = playerData.hp / playerData.maxHp * 100;
    screen.querySelector(".hp-fill").style.width = hpPer + "%";    
    screen.querySelector(".hpText").textContent = tempText;
    screen.querySelector(".atk").textContent = playerData.atk;
    screen.querySelector(".def").textContent = playerData.def;

};
