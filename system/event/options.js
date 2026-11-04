/* ==================== 小關事件：顯示描述與選項 ==================== */

import { playerData } from "../../data/player.js";
import { state } from "../state.js";
import { gameScreen, nextLevelButton } from "../dom.js";
import { updateStatusPanel } from "../status.js";

/*顯示小關描述*/
export function showCurrentSmall(){
    const eventTitle = document.querySelector("#event-title");
    const eventDescription = document.querySelector("#event-description");

    eventTitle.innerHTML = state.currentSmall.title;
    eventDescription.innerHTML = state.currentSmall.description;
};

/*套用選項的效果到玩家數值（故事模式的選項也共用這個）*/
export function applyOptionEffect(option, keys){
    /*hpPct：以「套用本選項前」的最大生命為基準的百分比，回血／扣血都無條件進位（至少 1 點）*/
    const baseMaxHp = playerData.maxHp;
    for(let i=0; i<keys.length; i++){
        if(keys[i] === "hpPct"){
            const pct = option.effect.hpPct;
            const amount = Math.ceil(baseMaxHp * Math.abs(pct) / 100);
            playerData.hp += pct < 0 ? -amount : amount;
        }else{
            playerData[keys[i]] += option.effect[keys[i]];
        };
    };
};

/*組出選擇後顯示的結果文字（結果敘述 + 數值變化徽章 + 死亡提示）*/
function buildResultText(option, keys){
    const statNames = { maxHp: "最大生命", hp: "生命", hpPct: "生命", atk: "攻擊", def: "防禦" };
    let tempText ="";
    tempText += `${option.result}<br><br>`;
    for(let i=0; i<keys.length; i++){
        const v = option.effect[keys[i]];
        if(v === 0){ continue; };
        tempText += `| ${statNames[keys[i]] || keys[i]} ${v > 0 ? "+" : ""}${v}${keys[i] === "hpPct" ? "%" : ""} |`;
    };
    if(playerData.hp <= 0){
        tempText += `<br><br>你再也撐不住，倒在了江湖路上……`;
        nextLevelButton.textContent = "江湖路盡";
    };
    return tempText;
};

/*顯示小關事件選項*/
export function showSmallOptions(){
    const tempOptionButton =document.querySelector("#temp-option-button");
    const eventDescription = document.querySelector("#event-description");
    nextLevelButton.hidden = true;
    tempOptionButton.innerHTML = "";

    state.currentSmall.options.forEach(function(option){
        tempOptionButton.hidden = false;
        const newButton = document.createElement("button");
        newButton.textContent = option.text;
        tempOptionButton.appendChild(newButton);
        newButton.classList.add("choice-button");
        newButton.addEventListener("click", function(){
            const keys = Object.keys(option.effect);
            applyOptionEffect(option, keys);
            updateStatusPanel(gameScreen);
            tempOptionButton.innerHTML = "";
            eventDescription.innerHTML = buildResultText(option, keys);
            nextLevelButton.hidden = false;
            tempOptionButton.hidden = true;
        });
    });
};
