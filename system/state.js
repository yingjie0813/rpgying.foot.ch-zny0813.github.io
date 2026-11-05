/* ==================== 遊戲狀態（會被改動的變數都集中在這裡） ==================== */
/* 原本散落在 main.js 最上方的全域 let 變數，現在全部放進同一個 state 物件。
   ES 模組 import 進來的變數不能被重新指定，但「物件的屬性」可以，
   所以任何模組都用 state.xxx = ... 讀寫，大家看到的永遠是同一份。 */

import { battleFlow } from "../data/battle-flow.js";

export const state = {
    /*小關*/
    currentSmall: null,         /*目前這一關的事件（隨機小關通用變數）*/
    eventPool: [],              /*小關事件牌堆（不重複抽取）*/

    /*王關*/
    currentBoss: null,          /*目前的頭目*/
    round: "",                  /*第幾回合*/
    battleEnding: null,         /*記錄戰鬥是否已經結束："win" / "lose" / null*/
    battlePhase: battleFlow[0], /*目前戰鬥進度*/
    playerChoice: null,         /*玩家本回合出拳（按鈕 id）*/
    battleResult: null,         /*本回合勝負："win" / "draw" / "lose"*/
    bossChoice: ["", ""],       /*頭目本回合的 [拳種, 招式]*/
    tempLog: "",                /*戰鬥紀錄文字*/
    bossPool: [],               /*頭目牌堆：打過的頭目不再出現，全部打過一輪才重新洗牌*/
    lastBossIndex: -1,

    /*整體進度*/
    gameCleared: false,         /*是否已通關全部大關*/
    currentDifficulty: "normal",/*目前難度（easy / normal / hard / endless，設定在 data/difficulty.js）*/
    defeatedBosses: [],         /*本局擊敗的頭目（結算畫面使用）*/
    defeatBy: "",               /*倒下的原因（結算畫面使用）*/
    endlessJustUnlocked: false, /*無盡模式是否在本次剛解鎖*/

    /*故事模式（system/story-mode/）*/
    story: {
        chapterIndex: 0,        /*目前章節在 chapters 陣列中的位置*/
        chapterId: "",          /*目前章節 id*/
        sceneId: "",            /*目前場景 id*/
        lineIndex: 0,           /*目前場景的第幾句台詞*/
        flags: {},              /*劇情旗標（選項的 set 會寫在這裡，require 會讀這裡）*/
        bg: "",                 /*目前背景場景名（ui/background.js 讀取）*/
        visits: {},             /*每個場景被進入過幾次（"章節id/場景id" → 次數，onVisit 使用）*/
        defeated: [],           /*這一局打贏過的戰鬥敵人名字（結局面板的「擊敗」用）*/
        entry: null             /*進入目前場景那一刻的玩家數值、旗標、次數、擊敗名單（存檔用）*/
    },
    storySpeaker: null,         /*目前說話的角色物件（右上角卡片用）*/
    storyBattle: null,          /*故事模式的「自由戰鬥」進行中時有值：{ onEnd(result) }，戰鬥結束時由 controls.js 呼叫*/
    storyFoe: null              /*故事模式戰鬥中的敵人物件（說話者名字對得上時，右上角卡片顯示它的即時血量）*/
};
