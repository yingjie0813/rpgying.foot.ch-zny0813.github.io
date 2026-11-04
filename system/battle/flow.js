/* ==================== 戰鬥流程 ==================== */
/* 一回合的進度由 data/battle-flow.js 的 battleFlow 決定（共 5 個階段）：
     [0] boss_intro     頭目介紹
     [1] battle_choose  頭目顯示預兆（運氣）／玩家選拳
     [2] battle_action  頭目出招（顯示招式的「攻擊」文字）
     [3] battle_result  顯示後果與血量變化
     [4] consequence    判定勝負或進入下一回合
   pushPhase() 把進度往前推一格，detPhase() 依目前進度做事。 */

import { battleFlow } from "../../data/battle-flow.js";
import { playerData } from "../../data/player.js";
import { state } from "../state.js";
import { gameScreen, bossScreen, storyScreen, battleLogContent } from "../dom.js";
import { fmt, updateStatusPanel } from "../status.js";
import { updateLevelStatus } from "../progress.js";
import { applyPortrait } from "../portrait.js";
import { randomBoss } from "./boss-spawn.js";
import { randomBossChoice, judgeRps } from "./rps.js";
import { calculateDamage } from "./damage.js";
import { updateBossStatus, swBattleButton, scrollBattleLog } from "./battle-ui.js";

/*點擊檢測到第十關使用*/
export function startBossEvent(){
    /*重設戰鬥資料*/
    state.battlePhase = battleFlow[0];
    state.playerChoice = null;
    state.battleResult = null;
    state.bossChoice = ["", ""];
    state.battleEnding = null;
    state.tempLog = "";
    state.round = 1;
    battleLogContent.innerHTML = "";
    /*切換畫面*/
    gameScreen.hidden = true;
    bossScreen.hidden = false;
    /*選擇boss*/
    state.currentBoss = randomBoss();
    applyPortrait(state.currentBoss, function(){ updateBossStatus(bossScreen); });
    /*更新畫面數據*/
    updateBossStatus(bossScreen);
    updateStatusPanel(bossScreen);
    updateLevelStatus(bossScreen);
    swBattleButton(true)
    state.tempLog += `------------------------------ 第${state.round}回合------------------------------<br>`;
    battleLogContent.innerHTML = state.tempLog;
    scrollBattleLog()

    detPhase(); /*進入自我介紹*/
};

/*故事模式的「自由戰鬥」：和 startBossEvent 一樣的戰鬥流程，只是敵人由故事指定（foe 是整理好的敵人物件，
  格式與 bossData 的一筆相同），結束後由 state.storyBattle.onEnd 交回故事。title 顯示在上方橫幅。*/
export function startStoryBattle(foe, title){
    state.battlePhase = battleFlow[0];
    state.playerChoice = null;
    state.battleResult = null;
    state.bossChoice = ["", ""];
    state.battleEnding = null;
    state.tempLog = "";
    state.round = 1;
    battleLogContent.innerHTML = "";
    storyScreen.hidden = true;
    gameScreen.hidden = true;
    bossScreen.hidden = false;
    state.currentBoss = foe;
    applyPortrait(state.currentBoss, function(){ updateBossStatus(bossScreen); });
    updateBossStatus(bossScreen);
    updateStatusPanel(bossScreen);
    bossScreen.querySelector(".status-panel-level").textContent = title || "戰鬥";
    bossScreen.querySelector(".level-type").textContent = "戰鬥";
    swBattleButton(true);
    state.tempLog += `------------------------------ 第${state.round}回合------------------------------<br>`;
    battleLogContent.innerHTML = state.tempLog;
    scrollBattleLog();

    detPhase();
};

/*目前這回合頭目選中的那一招（bossData 裡 招式[拳種][招式名] 的物件）*/
function currentMove(){
    return state.currentBoss.招式[state.bossChoice[0]][state.bossChoice[1]];
};

/*[0] boss介紹/bossData.description*/
function phaseIntro(){
    swBattleButton(true);

    state.tempLog += `${fmt(state.currentBoss.description)}<br>`;
    battleLogContent.innerHTML = state.tempLog;
};

/*[1] boss顯示運氣(預兆)/玩家選擇猜拳按鈕*/
function phaseChoose(){

    /* 第一次抽選：根據 Boss 偏好決定出拳 */
    state.bossChoice[0] = randomBossChoice();

    /* 第二次抽選：從該拳種的招式中隨機選一招 */
    const moveNames = Object.keys(state.currentBoss.招式[state.bossChoice[0]]);
    state.bossChoice[1] = moveNames[
        Math.floor(Math.random() * moveNames.length)
    ];

    state.tempLog += `${fmt(currentMove().運氣)}<br>`;
    battleLogContent.innerHTML = state.tempLog;
    scrollBattleLog()

    swBattleButton(false);
};

/*[2] 實際判定猜拳結果/顯示招式.攻擊*/
function phaseAction(){
    state.tempLog += `${fmt(currentMove().攻擊)}<br>`;
    battleLogContent.innerHTML = state.tempLog;
    swBattleButton(true);
    scrollBattleLog()
};

/*[3] 顯示後果/血量變化*/
function phaseResult(){
    const resultOrder = ["win", "draw", "lose"];
    state.battleResult = judgeRps(state.playerChoice, state.bossChoice[0]);
    const resultIndex = resultOrder.indexOf(state.battleResult);
    state.tempLog += `${fmt(currentMove().後果[resultIndex])}<br>`;
    state.tempLog += `${calculateDamage()}<br><br>`;
    battleLogContent.innerHTML = state.tempLog;
    swBattleButton(true);
    scrollBattleLog()
};

/*[4] 判定玩家死亡與否/boss死亡與否/決定勝利失敗或未勝負/推進關卡*/
function phaseConsequence(){

    /*先檢查玩家是否死亡*/
    if(playerData.hp <= 0){
        state.battleEnding = "lose";

        state.tempLog += `${fmt(state.currentBoss.defeatDescription)}<br>`;
        state.tempLog += `你已經失去戰鬥能力，這場戰鬥結束了。<br>`;

    }

    /*再檢查Boss是否死亡*/
    else if(state.currentBoss.hp <= 0){
        state.battleEnding = "win";

        state.tempLog += `${fmt(state.currentBoss.victoryDescription)}<br>`;
        state.tempLog += `你成功擊敗了 ${state.currentBoss.name}！<br>`;

    }

    /*雙方都還活著*/
    else{
        state.battleEnding = null;

        state.tempLog += `雙方仍有一戰之力，準備迎接下一回合！<br>`;
    };

    battleLogContent.innerHTML = state.tempLog;
    swBattleButton(true);
    scrollBattleLog()
    state.round += 1;
};

/*戰鬥進度檢測*/
export function detPhase(){
    switch(state.battlePhase){
        case battleFlow[0]: phaseIntro(); break;
        case battleFlow[1]: phaseChoose(); break;
        case battleFlow[2]: phaseAction(); break;
        case battleFlow[3]: phaseResult(); break;
        case battleFlow[4]: phaseConsequence(); break;
    };
};

/*戰鬥推進規則函數*/
export function pushPhase(){
    let indexBattlePhase = battleFlow.indexOf(state.battlePhase);
    if(state.battlePhase === battleFlow[4]){
        state.tempLog = `------------------------------ 第${state.round}回合------------------------------<br>`;
        battleLogContent.innerHTML = state.tempLog;
        scrollBattleLog()
    }else{
        state.tempLog += `------------------------------------------------------------<br>`;
        battleLogContent.innerHTML = state.tempLog;
    }
    if(indexBattlePhase < battleFlow.length - 1){
        indexBattlePhase += 1;
    }else if(indexBattlePhase === battleFlow.length - 1){
        indexBattlePhase = 1;
    }
    state.battlePhase = battleFlow[indexBattlePhase];
    scrollBattleLog()

    /*重新回到戰鬥判定*/
    detPhase();
};
