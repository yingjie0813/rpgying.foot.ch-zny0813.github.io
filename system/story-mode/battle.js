/* ==================== 故事模式的戰鬥 ==================== */
/* 兩種戰鬥（章節檔裡場景的 battle 欄位，格式見章節檔開頭的說明）：
   1. 教學戰鬥（有 rounds）：固定劇本，在故事畫面裡一回合一回合播放（startScriptedBattle）
   2. 自由戰鬥（沒有 rounds）：走正常的王關戰鬥流程（startFreeBattle → system/battle/flow.js）
   敵人資料來自 characters.js（數值、招式、preference 格式與 bossData 相同），battle.foeStats 可覆蓋。
   這個檔案不 import story.js（避免循環），需要的功能由 story.js 用 api 參數傳進來：
     api.play(sceneLike)   播一段臨時場景 { lines, options?, then? }
     api.done(result)      戰鬥結束，result = "win" | "lose" */

import { playerData } from "../../data/player.js";
import { state } from "../state.js";
import { fmt } from "../status.js";
import { applyPortrait } from "../portrait.js";
import { getSpeaker } from "./speaker.js";
import { randomBossChoice, judgeRps } from "../battle/rps.js";
import { calcDmg } from "../battle/damage.js";
import { startStoryBattle } from "../battle/flow.js";
import { bossScreen, storyScreen } from "../dom.js";
import { battleFlow } from "../../data/battle-flow.js";

const RPS_LABEL = { rock: "石頭", scissors: "剪刀", paper: "布" };
const RPS_ORDER = ["rock", "scissors", "paper"];
const RESULT_ORDER = ["win", "draw", "lose"];

function isNum(v){ return typeof v === "number" && !isNaN(v); };

/*通用招式：角色沒寫招式時使用，讓戰鬥至少能進行*/
function defaultMoves(name){
    const make = function(){
        return {
            招式一: {
                名稱: "出手",
                運氣: `${name}擺開架勢，蓄勢待發。`,
                攻擊: `${name}出手了！`,
                後果: [`你化解了${name}的攻勢。`, `雙方招式相撞，各自退了一步。`, `你被${name}擊中！`]
            }
        };
    };
    return { rock: make(), scissors: make(), paper: make() };
};

/*把 characters.js 的角色（＋ battle.foeStats）整理成戰鬥用的敵人物件（格式同 bossData 的一筆）*/
export function makeFoe(b){
    const base = getSpeaker(b.foe, function(){});
    const foe = Object.assign({}, base, b.foeStats || {});
    foe.key = b.foe;
    foe.name = foe.name || b.foe;
    foe.imgAlts = [];
    foe.img = base.img || "";
    if(isNum(foe.maxHp)){
        foe.hp = isNum(foe.hp) ? Math.min(foe.hp, foe.maxHp) : foe.maxHp;
    };
    if(!foe.招式){ foe.招式 = defaultMoves(foe.name); };
    if(!foe.preference){
        foe.preference = {};
        Object.keys(foe.招式).forEach(function(t){ foe.preference[t] = 1; });
    };
    foe.description = foe.intro || `${foe.name}擋在你面前，戰鬥一觸即發。`;
    foe.victoryDescription = foe.victoryDescription || `${foe.name}倒下了。`;
    foe.defeatDescription = foe.defeatDescription || `${foe.name}擊倒了你。`;
    applyPortrait(foe, function(){});
    return foe;
};

/* ---------- 玩家數值的備份與還原 ---------- */

export function snapshotPlayer(){
    const copy = Object.assign({}, playerData);
    delete copy.imgAlts;
    return copy;
};

export function restorePlayer(snap){
    Object.assign(playerData, snap);
};

/* battle.player：省略或 "keep" = 沿用目前數值；物件 = 戰鬥期間改用這組固定數值 */
export function applyFixedPlayer(b){
    if(b.player && b.player !== "keep" && typeof b.player === "object"){
        Object.assign(playerData, b.player);
        if(!isNum(b.player.hp)){ playerData.hp = playerData.maxHp; };
        return true;
    };
    return false;
};

/* ---------- 自由戰鬥（走正常王關流程） ---------- */

export function startFreeBattle(b, foe, api, title){
    /*正常王關流程要求敵人一定有數值，沒填的補預設（validate.js 會在主控台提醒）*/
    if(!isNum(foe.maxHp)){ foe.maxHp = 50; foe.hp = 50; };
    if(!isNum(foe.atk)){ foe.atk = 10; };
    if(!isNum(foe.def)){ foe.def = 10; };
    state.storyBattle = {
        onEnd: function(result){
            state.battleEnding = null;
            state.battlePhase = battleFlow[0];
            state.tempLog = "";
            state.currentBoss = null;
            bossScreen.hidden = true;
            storyScreen.hidden = false;
            api.done(result);
        }
    };
    startStoryBattle(foe, title);
};

/* ---------- 教學戰鬥（固定劇本，在故事畫面播放） ---------- */

/*這回合敵人的招式：回合有寫 foeMove 就用它，沒寫就用角色（foe）自己的招式與 preference 抽選*/
function resolveMove(round, foe){
    if(round.foeMove){
        const m = round.foeMove;
        return { type: m.拳種 || "rock", move: m };
    };
    const prev = state.currentBoss;
    state.currentBoss = foe;
    try{
        const type = randomBossChoice();
        const names = Object.keys(foe.招式[type]);
        return { type: type, move: foe.招式[type][names[Math.floor(Math.random() * names.length)]] };
    }finally{
        state.currentBoss = prev;
    };
};

/*算這回合的傷害，並回傳 { toFoe, toPlayer, text }（還沒套用）*/
function planDamage(round, result, foe){
    let toFoe = 0, toPlayer = 0;
    if(round.damage){
        toFoe = Number(round.damage.toFoe) || 0;
        toPlayer = Number(round.damage.toPlayer) || 0;
    }else{
        const hitFoe = isNum(foe.def) && isNum(foe.maxHp);
        const hitPlayer = isNum(foe.atk);
        if(result === "win" && hitFoe){
            toFoe = calcDmg(playerData.atk, foe.def);
        }else if(result === "draw"){
            if(hitFoe){ toFoe = calcDmg(playerData.atk, foe.def); };
            if(hitPlayer){ toPlayer = calcDmg(foe.atk, playerData.def); };
        }else if(result === "lose" && hitPlayer){
            toPlayer = calcDmg(foe.atk, playerData.def);
        };
    };
    const parts = [];
    if(toFoe > 0){ parts.push(`${playerData.name}對 ${foe.name} 造成了 ${toFoe} 點傷害！`); };
    if(toPlayer > 0){ parts.push(`${foe.name} 對${playerData.name}造成了 ${toPlayer} 點傷害！`); };
    return { toFoe: toFoe, toPlayer: toPlayer, text: parts.join("<br>") };
};

export function startScriptedBattle(b, foe, api){
    const rounds = b.rounds;
    let index = 0;
    state.storyFoe = foe;

    function finish(result){
        state.storyFoe = null;
        api.done(result);
    };

    function nextRound(){
        if(index >= rounds.length){ finish("win"); return; };
        const round = rounds[index];
        const mv = resolveMove(round, foe);
        if(round.before && round.before.length){
            api.play({ lines: round.before, then: function(){ choose(round, mv, false); } });
        }else{
            choose(round, mv, false);
        };
    };

    /*顯示敵人的「運氣」（預兆）與提示，然後讓玩家選拳*/
    function choose(round, mv, again){
        let text;
        if(again){
            text = round.hint || "（請重新選擇）";
        }else{
            text = fmt(mv.move.運氣 || `${foe.name}蓄勢待發。`);
            if(round.hint){ text += `<br><span class="story-hint">${round.hint}</span>`; };
        };
        api.play({
            lines: [{ who: foe, text: text }],
            options: RPS_ORDER.map(function(t){
                return { text: RPS_LABEL[t], run: function(){ pick(round, mv, t); } };
            })
        });
    };

    function pick(round, mv, type){
        const allow = round.allow;
        if(allow && allow.length && allow.indexOf(type) < 0){
            api.play({
                lines: round.onWrong && round.onWrong.length ? round.onWrong : [{ who: "系統消息", text: "這一招不對，再想想。" }],
                then: function(){ choose(round, mv, true); }
            });
            return;
        };
        const result = round.result || judgeRps(type, mv.type);
        const plan = planDamage(round, result, foe);
        const consequence = (mv.move.後果 || [])[RESULT_ORDER.indexOf(result)] || "";
        const lines = [
            { who: foe, text: fmt(mv.move.攻擊 || `${foe.name}出手了！`) },
            {
                who: foe,
                text: fmt(consequence) + (plan.text ? `<br><br>${plan.text}` : ""),
                run: function(){      /*這句顯示的同時才扣血*/
                    if(isNum(foe.maxHp)){ foe.hp = Math.max(0, (isNum(foe.hp) ? foe.hp : foe.maxHp) - plan.toFoe); };
                    playerData.hp = Math.max(0, playerData.hp - plan.toPlayer);
                }
            }
        ];
        (round.after || []).forEach(function(l){ lines.push(l); });
        api.play({ lines: lines, then: endRound });
    };

    function endRound(){
        index += 1;
        if(playerData.hp <= 0){ finish("lose"); }
        else if(isNum(foe.maxHp) && foe.hp <= 0){ finish("win"); }
        else{ nextRound(); };
    };

    nextRound();
};
