/* ==================== 按鈕事件 ==================== */
/* 把畫面上各個按鈕接到對應的遊戲函數。由 main.js 呼叫一次 bindControls()。 */

import { playerData, gameProgress } from "../data/player.js";
import { state } from "./state.js";
import { startScreen, resultScreen, startScreenButton, nextLevelButton, nextButton, choiceButtons, playerNameInput } from "./dom.js";
import { startGame } from "./game.js";
import { nextLevel } from "./progress.js";
import { startSmallEvent } from "./event/small-event.js";
import { startBossEvent, pushPhase } from "./battle/flow.js";
import { victory, defeat } from "./battle/outcome.js";
import { showResult } from "./result.js";
import { refreshDifficultyCards } from "./difficulty.js";

export function bindControls(){

    /*啟動按鈕*/
    startScreenButton.addEventListener("click", startGame);
    playerNameInput.addEventListener("keydown", function(e){
        if(e.key === "Enter"){ startGame(); };
    });

    /*點擊繼續前進按鈕函數與執行*/
    nextLevelButton.addEventListener("click", function(){
        /*通關後回到開始畫面*/
        if(state.gameCleared){
            state.gameCleared = false;
            showResult("clear");
            return;
        };
        /*小關中死亡*/
        if(playerData.hp <= 0){
            defeat();
            return;
        };
        nextLevel();
        if  (gameProgress.smallLevel === 10){
            startBossEvent();
        }else{
            startSmallEvent();
        };
    });

    /*設定按鈕點擊*/
    nextButton.addEventListener("click", function(){
        /*故事模式的自由戰鬥：戰鬥結束後把結果交回故事（system/story-mode/battle.js）*/
        if(state.storyBattle && state.battleEnding){
            const onEnd = state.storyBattle.onEnd;
            state.storyBattle = null;
            onEnd(state.battleEnding);
            return;
        };
        if(state.battleEnding === "win"){
            victory();

        }else if(state.battleEnding === "lose"){
            defeat();

        }else{
            pushPhase();
        };
    });

    choiceButtons.forEach(function(button){
        button.addEventListener("click", function(){
            state.playerChoice = button.id;
            pushPhase();
        }); 
    });

    /*結算畫面：再來一局（沿用同樣的名字與難度）*/
    document.querySelector("#result-again-button").addEventListener("click", function(){
        startGame();
    });

    /*結算畫面：回到開始畫面*/
    document.querySelector("#result-home-button").addEventListener("click", function(){
        resultScreen.hidden = true;
        startScreen.hidden = false;
        refreshDifficultyCards();
    });
};
