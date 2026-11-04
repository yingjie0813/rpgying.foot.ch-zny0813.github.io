/* ==================== 骰子與鍵盤快捷鍵 ==================== */

import { PORTRAITS } from "../data/portraits.js";
import { bossScreen, storyScreen, nextLevelButton, nextButton, storyNextButton, randomNameButton, playerNameInput } from "./dom.js";

/*骰子按鈕：從人物誌對照表（data/portraits.js）純隨機抽一個名字填進輸入框（可能重複）*/
function bindRandomName(){
    randomNameButton.addEventListener("click", function(){
        const maxLen = Number(playerNameInput.getAttribute("maxlength")) || 9;
        const names = Object.keys(PORTRAITS || {}).filter(function(name){
            return Array.from(name).length <= maxLen;
        });
        if(names.length === 0){ return; };
        playerNameInput.value = names[Math.floor(Math.random() * names.length)];
        /*小動畫：重新觸發旋轉*/
        randomNameButton.classList.remove("rolling");
        void randomNameButton.offsetWidth;
        randomNameButton.classList.add("rolling");
    });
    randomNameButton.addEventListener("animationend", function(){
        randomNameButton.classList.remove("rolling");
    });
};

/* 鍵盤快捷鍵
   數字鍵：選事件選項（1、2、3…）；王關時 1 / 2 / 3 = 石頭 / 剪刀 / 布。
   Enter：按下目前畫面上的「繼續」按鈕。 */

function keyVisible(el){
    return !!el && !el.hidden && el.offsetParent !== null;
};

function bindKeyboard(){
    document.addEventListener("keydown", function(e){
        if(e.repeat || e.ctrlKey || e.metaKey || e.altKey){
            return;
        };
        const tag = e.target && e.target.tagName;
        if(tag === "INPUT" || tag === "TEXTAREA"){
            return;
        };

        /*Enter：繼續*/
        if(e.key === "Enter"){
            const continueButtons = [
                nextLevelButton,
                nextButton,
                storyNextButton,
                document.querySelector("#result-again-button")
            ];
            const target = continueButtons.find(keyVisible);
            if(target){
                e.preventDefault();
                target.click();
            };
            return;
        };

        /*數字鍵*/
        if(/^[1-9]$/.test(e.key)){
            const n = Number(e.key);
            const rps = ["rock", "scissors", "paper"];
            const rpsButton = document.querySelector("#" + rps[n - 1]);
            if(n <= 3 && keyVisible(rpsButton) && !bossScreen.hidden){
                e.preventDefault();
                rpsButton.click();
                return;
            };
            const inStory = !!storyScreen && !storyScreen.hidden;
            const options = document.querySelectorAll(inStory ? "#story-options .choice-button" : "#temp-option-button .choice-button");
            if(options[n - 1] && keyVisible(options[n - 1])){
                e.preventDefault();
                options[n - 1].click();
            };
        };
    });
};

export function bindInput(){
    bindRandomName();
    bindKeyboard();
};
