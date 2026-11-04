/* ==================== 戰鬥結果：勝利與死亡 ==================== */

import { battleFlow } from "../../data/battle-flow.js";
import { difficultyConfig } from "../../data/difficulty.js";
import { playerData, gameProgress } from "../../data/player.js";
import { state } from "../state.js";
import { gameScreen, bossScreen, nextLevelButton } from "../dom.js";
import { updateStatusPanel } from "../status.js";
import { updateLevelStatus } from "../progress.js";
import { unlockEndless } from "../difficulty.js";
import { showResult } from "../result.js";
import { startSmallEvent } from "../event/small-event.js";

/*玩家勝利：進入下一大關*/
export function victory(){

    /*記錄擊敗的頭目*/
    state.defeatedBosses.push(state.currentBoss.name);

    /*通關最後一大關：進入結局（無盡模式沒有終點，會繼續往下打）*/
    if(gameProgress.majorLevel >= 10 && !difficultyConfig[state.currentDifficulty].endless){
        state.gameCleared = true;
        unlockEndless();
        state.battleEnding = null;
        state.battlePhase = battleFlow[0];
        state.tempLog = "";
        bossScreen.hidden = true;
        gameScreen.hidden = false;
        updateStatusPanel(gameScreen);
        document.querySelector("#event-title").innerHTML = "江湖傳說";
        document.querySelector("#event-description").innerHTML =
            `十大關，十位強敵，盡數倒在你的拳下。<br>${playerData.name}的名字，從此在江湖中流傳。<br><br>—— 全劇終 ——`;
        document.querySelector("#temp-option-button").hidden = true;
        nextLevelButton.textContent = "回到江湖入口";
        nextLevelButton.hidden = false;
        return;
    };

    /*推進大關，回到第一小關*/
    gameProgress.majorLevel += 1;
    gameProgress.smallLevel = 1;

    /*清除戰鬥結束狀態*/
    state.battleEnding = null;
    state.battlePhase = battleFlow[0];
    state.tempLog = "";

    /*切換畫面*/
    bossScreen.hidden = true;
    gameScreen.hidden = false;

    /*更新玩家與關卡面板*/
    updateStatusPanel(gameScreen);
    updateLevelStatus(gameScreen);

    /*準備下一大關的小關事件*/
    startSmallEvent();
};


/*玩家死亡：進入結算畫面*/
export function defeat(){

    /*記下倒下的原因（頭目戰或小關事件）*/
    if(!bossScreen.hidden && state.currentBoss){
        state.defeatBy = state.currentBoss.name;
    }else if(state.currentSmall){
        state.defeatBy = state.currentSmall.title;
    }else{
        state.defeatBy = "";
    };

    /*清除戰鬥資料*/
    state.battleEnding = null;
    state.battlePhase = battleFlow[0];
    state.tempLog = "";

    /*顯示結算畫面*/
    showResult("lose");
};
