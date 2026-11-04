/* ==================== 開始遊戲 ==================== */

import { initialPlayerData, playerData } from "../data/player.js";
import { battleFlow } from "../data/battle-flow.js";
import { state } from "./state.js";
import { startScreen, gameScreen, bossScreen, resultScreen, nextLevelButton, playerNameInput } from "./dom.js";
import { initialStatusData, updateStatusPanel } from "./status.js";
import { initialGameProgress, updateLevelStatus } from "./progress.js";
import { endlessUnlocked } from "./difficulty.js";
import { applyPortrait } from "./portrait.js";
import { egg } from "./debug.js";
import { difficultyConfig } from "../data/difficulty.js";
import { startStory } from "./story-mode/story.js";

/*開始遊戲*/
export function startGame() {
    /*選了「故事」難度：進入故事模式（system/story-mode/story.js），其餘照舊*/
    if(difficultyConfig[state.currentDifficulty] && difficultyConfig[state.currentDifficulty].story){
        startStory();
        return;
    };

    /*初始化關卡和玩家數據*/
    initialGameProgress()
    initialStatusData();

    /*無盡模式尚未開放時退回普通*/
    if(state.currentDifficulty === "endless" && !endlessUnlocked()){
        state.currentDifficulty = "normal";
    };
    state.bossPool = [];
    state.lastBossIndex = -1;
    state.defeatedBosses = [];
    state.defeatBy = "";
    resultScreen.hidden = true;

    /*宣告開始和遊戲畫面*/
    const playerName = playerNameInput.value.trim();

    playerData.name = playerName || initialPlayerData.name;
    playerData.imgAlts = [];
    applyPortrait(playerData, function(){ updateStatusPanel(gameScreen); updateStatusPanel(bossScreen); });

    /*重置事件面板與狀態（重新開始時避免殘留上一局內容）*/
    state.gameCleared = false;
    state.eventPool = [];
    state.battleEnding = null;
    state.battlePhase = battleFlow[0];
    state.tempLog = "";
    document.querySelector("#event-title").textContent = "旅途開始";
    document.querySelector("#event-description").textContent = "你背起行囊，踏入了這片風起雲湧的江湖。";
    document.querySelector("#temp-option-button").innerHTML = "";
    document.querySelector("#temp-option-button").hidden = true;
    nextLevelButton.textContent = "繼續前行";
    nextLevelButton.hidden = false;
    egg();

    updateStatusPanel(gameScreen);
    updateLevelStatus(gameScreen);
    startScreen.hidden = true;
    gameScreen.hidden = false;

};
