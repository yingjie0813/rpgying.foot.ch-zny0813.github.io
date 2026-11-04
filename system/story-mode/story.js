/* ==========================================================================
   故事模式：章節與場景的播放
   --------------------------------------------------------------------------
   資料在 data/story-mode/（章節檔 + characters.js + index.js），這裡只負責「播放」：
     startStory()      開始故事模式（由 game.js 在選了「故事」難度後呼叫）
     bindStory()       綁定故事畫面上的按鈕（由 main.js 呼叫一次）
   播放流程：章節 → 場景 → 台詞（逐句打字）→ 選項 / next → 章節結束 → 下一章 / 回開始畫面
   ========================================================================== */

import { chapters } from "../../data/story-mode/index.js";
import { initialPlayerData, playerData } from "../../data/player.js";
import { state } from "../state.js";
import {
    startScreen, gameScreen, bossScreen, resultScreen,
    storyScreen, storyText, storyContent, storyOptions, storyNextButton, storyExitButton,
    storySaveButton, storyLoadButton, storySaveInfo,
    storyBanner, storyPanelHeading,
    storySpeakerCard, storySpeakerName, storySpeakerHeading,
    storySpeakerHpRow, storySpeakerHp, storySpeakerHpBar, storySpeakerHpFill,
    storySpeakerAtkDef, storySpeakerAtk, storySpeakerDef, playerNameInput
} from "../dom.js";
import { fmt, initialStatusData, updateStatusPanel } from "../status.js";
import { LEVEL_NUM } from "../progress.js";
import { applyPortrait } from "../portrait.js";
import { egg } from "../debug.js";
import { refreshDifficultyCards } from "../difficulty.js";
import { typeInto } from "./typewriter.js";
import { getSpeaker } from "./speaker.js";
import { checkRequire, applyConsequences } from "./condition.js";
import { validateChapters } from "./validate.js";
import { getEnding, recordEnding } from "./ending.js";
import { readSave, writeSave } from "./save.js";
import { makeFoe, snapshotPlayer, restorePlayer, applyFixedPlayer, startScriptedBattle, startFreeBattle } from "./battle.js";

let chapter = null;     /*目前章節*/
let scene = null;       /*目前場景（戰鬥、結局播放時是臨時組出來的場景物件）*/
let typer = null;       /*目前這句台詞的打字機控制器*/
let phase = "idle";     /*"line" 播台詞中｜"end" 章節／結局結束畫面｜"idle" 沒在播*/
let endAction = null;   /*"end" 畫面按下繼續時要做的事*/
let inBattle = false;   /*教學戰鬥播放中（這時不能存檔）*/
let inEnding = false;   /*結局播放中（這時不能存檔）*/
let validated = false;

/* ---------- 畫面小工具 ---------- */

/*把說話者的名字與數值畫到右上角的卡片。
  說話的是玩家：照「俠客資料」，一定顯示 HP / ATK / DEF。
  其他角色：照「頭目資料」，characters.js 有填 maxHp / atk / def 才顯示對應數值，沒填就只有頭像和名字。
  名字文字一變動，視覺層（ui/theme.js）就會重新放頭像。*/
function renderSpeaker(){
    const sp = state.storySpeaker;
    storyPanelHeading.textContent = sp ? sp.name : "故事";     /*對話框左上角的小標：目前說話的人*/
    if(!sp){
        storySpeakerCard.hidden = true;
        storySpeakerName.textContent = "";
        return;
    };
    const isHero = (sp === playerData);
    storySpeakerCard.hidden = false;
    storySpeakerCard.classList.toggle("is-hero", isHero);
    storySpeakerHeading.textContent = isHero ? "俠客資料" : "角色資料";
    storySpeakerName.textContent = sp.name;

    /*HP 長條與 ATK / DEF：角色資料有填才顯示，沒填就整列收起來（玩家說話時一定有）*/
    const hasHp = typeof sp.maxHp === "number" && sp.maxHp > 0;
    const hp = typeof sp.hp === "number" ? sp.hp : sp.maxHp;
    storySpeakerHpRow.hidden = !hasHp;
    storySpeakerHpBar.hidden = !hasHp;
    if(hasHp){
        storySpeakerHp.textContent = hp + " / " + sp.maxHp;
        storySpeakerHpFill.style.width = Math.max(0, Math.min(100, hp / sp.maxHp * 100)) + "%";
    };
    const hasAtk = typeof sp.atk === "number";
    const hasDef = typeof sp.def === "number";
    storySpeakerAtkDef.hidden = !(hasAtk || hasDef);
    storySpeakerAtk.textContent = hasAtk ? sp.atk : "-";
    storySpeakerDef.textContent = hasDef ? sp.def : "-";
};

/*who 可以是角色名（characters.js 的 key）、"{name}"（玩家），戰鬥時也可以直接是敵人物件。
  教學戰鬥中，名字對得上敵人時用戰鬥中的敵人物件，右上角卡片才會顯示它的即時血量。*/
function setSpeaker(who){
    if(who === undefined || who === null || who === ""){
        state.storySpeaker = null;
    }else if(typeof who === "object"){
        state.storySpeaker = who;
    }else if(state.storyFoe && String(who).trim() === state.storyFoe.key){
        state.storySpeaker = state.storyFoe;
    }else{
        state.storySpeaker = getSpeaker(who, renderSpeaker);     /*頭像查到後再畫一次*/
    };
    renderSpeaker();
};

function showNextButton(label){
    storyNextButton.textContent = label || "繼續";
    storyNextButton.hidden = false;
};

function clearOptions(){
    storyOptions.innerHTML = "";
    storyOptions.hidden = true;
};

function chapterLabel(index){
    return chapter.label || ("第" + (LEVEL_NUM[index] || (index + 1)) + "章");     /*章節檔可用 label 自訂，例如 label: "第五章"*/
};

/*章節名：置中顯示在畫面最上方（只顯示章節名，不含「第 n 章」）*/
function updateChapterPanel(){
    storyBanner.textContent = "";
    const b = document.createElement("b");
    b.textContent = chapter.title;
    storyBanner.appendChild(b);
};

/* ---------- 開始與結束 ---------- */

export function startStory(){
    /*玩家資料：和一般模式一樣，用開始畫面的名字（沒填就用預設名字）*/
    initialStatusData();
    const playerName = playerNameInput.value.trim();
    playerData.name = playerName || initialPlayerData.name;
    playerData.imgAlts = [];
    applyPortrait(playerData, function(){ updateStatusPanel(storyScreen); });
    egg();
    updateStatusPanel(storyScreen);

    state.story.flags = {};
    state.story.visits = {};
    state.story.entry = null;
    state.storySpeaker = null;
    state.storyFoe = null;
    state.storyBattle = null;
    inBattle = false;
    inEnding = false;
    if(!validated){
        validated = true;
        validateChapters(chapters);
    };

    startScreen.hidden = true;
    gameScreen.hidden = true;
    bossScreen.hidden = true;
    resultScreen.hidden = true;
    storyScreen.hidden = false;

    setSaveInfo();
    startChapter(0);
};

function exitStory(){
    if(typer){ typer.cancel(); typer = null; };
    phase = "idle";
    endAction = null;
    inBattle = false;
    inEnding = false;
    state.storySpeaker = null;
    state.storyFoe = null;
    state.storyBattle = null;
    storyScreen.hidden = true;
    startScreen.hidden = false;
    refreshDifficultyCards();
};

/* ---------- 前往哪裡：場景、章節、結局 ---------- */
/* next / onWin / onLose / onVisit / 章節的 next 都可以寫：
     "s3"            同一章的場景
     "ch05"          另一章（從該章的 start 開始）
     "ch05:s3"       另一章的某個場景
     "ending:xxx"    結局（data/story-mode/endings.js）
   同一章裡有同名場景時，優先當成場景。 */

function findChapterIndex(id){
    for(let i = 0; i < chapters.length; i++){
        if(chapters[i].id === id){ return i; };
    };
    return -1;
};

function resolveTarget(target){
    const key = String(target).trim();
    if(key.indexOf("ending:") === 0){
        return { type: "ending", id: key.slice(7).trim() };
    };
    if(chapter && chapter.scenes[key]){
        return { type: "scene", chapterIndex: state.story.chapterIndex, sceneId: key };
    };
    const colon = key.indexOf(":");
    if(colon > 0){
        const ci = findChapterIndex(key.slice(0, colon));
        const sid = key.slice(colon + 1);
        if(ci >= 0 && chapters[ci].scenes[sid]){
            return { type: "scene", chapterIndex: ci, sceneId: sid };
        };
    };
    const ci = findChapterIndex(key);
    if(ci >= 0){
        return { type: "chapter", chapterIndex: ci };
    };
    return null;
};

function go(target){
    const r = resolveTarget(target);
    if(!r){
        console.warn("[故事 " + (chapter ? chapter.id : "?") + "] 找不到要前往的地方：" + target + "，章節提前結束");
        endChapter();
    }else if(r.type === "ending"){
        playEnding(r.id);
    }else if(r.type === "chapter"){
        startChapter(r.chapterIndex);
    }else if(r.chapterIndex !== state.story.chapterIndex){
        startChapter(r.chapterIndex, r.sceneId);
    }else{
        showScene(r.sceneId);
    };
};

/* ---------- 章節與場景 ---------- */

function startChapter(index, sceneId){
    chapter = chapters[index];
    if(!chapter){
        exitStory();
        return;
    };
    state.story.chapterIndex = index;
    state.story.chapterId = chapter.id;
    updateChapterPanel();
    showScene(sceneId || chapter.start);
};

/*進入場景那一刻的狀態（存檔用）*/
function captureEntry(){
    return {
        player: snapshotPlayer(),
        flags: JSON.parse(JSON.stringify(state.story.flags)),
        visits: JSON.parse(JSON.stringify(state.story.visits))
    };
};

function showScene(id){
    const found = chapter.scenes[id];
    if(!found){
        console.warn("[故事 " + chapter.id + "] 找不到場景：" + id + "，章節提前結束");
        endChapter();
        return;
    };
    inBattle = false;
    state.story.sceneId = id;
    state.story.entry = captureEntry();

    /*onVisit：第 N 次進入這個場景時改去別處*/
    const key = chapter.id + "/" + id;
    const count = (state.story.visits[key] || 0) + 1;
    state.story.visits[key] = count;
    if(found.onVisit && found.onVisit[count] !== undefined){
        go(found.onVisit[count]);
        return;
    };

    scene = found;
    state.story.bg = scene.bg || chapter.bg || "road";
    applyConsequences(scene);
    renderSpeaker();

    if(scene.battle){
        runBattle(scene.battle);
        return;
    };
    showLine(0);
};

/*播一段臨時組出來的場景（戰鬥與結局使用）：{ lines, options?, then? }*/
function playDynamic(obj){
    scene = obj;
    showLine(0);
};

/*顯示第 index 句；超過最後一句就進入「句子播完之後」的處理*/
function showLine(index){
    const lines = scene.lines || [];
    if(index >= lines.length){
        afterLines();
        return;
    };
    state.story.lineIndex = index;
    const line = lines[index];

    /*這句可以帶 set / effect（和場景、選項一樣）；戰鬥內部另用 run*/
    if(line.set || line.effect){ applyConsequences(line); };
    if(typeof line.run === "function"){
        line.run();
        updateStatusPanel(storyScreen);
    };

    phase = "line";
    clearOptions();
    showNextButton("繼續");
    setSpeaker(line.who);
    storyText.classList.remove("done", "more");
    if(typer){ typer.cancel(); };
    const speed = line.speed !== undefined ? line.speed : (scene.speed !== undefined ? scene.speed : chapter.speed);
    typer = typeInto(storyText, fmt(line.text), { speed: speed, onDone: onLineTyped });
};

/*這一句已經完整顯示：如果是場景最後一句且有選項，這時才出現選項*/
function onLineTyped(){
    const lines = scene.lines || [];
    const isLast = state.story.lineIndex >= lines.length - 1;
    storyText.classList.add("done");
    if(isLast && scene.options){
        showOptions();
    }else{
        storyText.classList.add("more");
    };
};

/*場景的台詞都播完（或根本沒有台詞）：選項 → then（戰鬥內部用）→ ending → next → 章節結束*/
function afterLines(){
    if(scene.options){
        showOptions();
    }else if(typeof scene.then === "function"){
        scene.then();
    }else if(scene.ending){
        playEnding(scene.ending);
    }else if(scene.next){
        go(scene.next);
    }else{
        endChapter();
    };
};

function showOptions(){
    const available = scene.options.filter(function(option){ return checkRequire(option.require); });
    if(available.length === 0){
        console.warn("[故事 " + chapter.id + "] 場景 " + state.story.sceneId + " 沒有可選的選項");
        if(scene.next){ go(scene.next); }else{ endChapter(); };
        return;
    };
    storyNextButton.hidden = true;
    storyText.classList.remove("more");
    storyOptions.innerHTML = "";
    available.forEach(function(option){
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-button";
        button.textContent = fmt(option.text);
        button.addEventListener("click", function(){ chooseOption(option); });
        storyOptions.appendChild(button);
    });
    storyOptions.hidden = false;
};

function chooseOption(option){
    clearOptions();
    if(typeof option.run === "function"){     /*戰鬥內部的選項*/
        option.run();
        return;
    };
    applyConsequences(option);
    renderSpeaker();
    if(option.next){
        go(option.next);
    }else{
        endChapter();
    };
};

/* ---------- 戰鬥 ---------- */

function runBattle(b){
    if(typer){ typer.cancel(); typer = null; };
    const home = scene;                       /*戰鬥場景本身（沒寫 onWin 時用它的 next）*/
    const snap = snapshotPlayer();
    const fixed = applyFixedPlayer(b);
    if(fixed){ updateStatusPanel(storyScreen); };
    const foe = makeFoe(b);

    const api = {
        play: playDynamic,
        done: function(result){
            inBattle = false;
            state.storyFoe = null;
            if(fixed || result === "lose"){ restorePlayer(snap); };     /*固定數值的戰鬥、輸掉的戰鬥：還原成戰鬥前的樣子*/
            updateStatusPanel(storyScreen);
            const target = result === "win" ? (b.onWin || home.next) : b.onLose;
            if(target){
                go(target);
            }else if(result === "lose"){
                /*沒寫 onLose：提示後重打*/
                scene = home;
                playDynamic({
                    lines: [{ who: "系統消息", text: "你倒下了……戰鬥重新開始。" }],
                    then: function(){ runBattle(b); }
                });
            }else{
                endChapter();
            };
        }
    };

    if(b.rounds && b.rounds.length){
        inBattle = true;
        startScriptedBattle(b, foe, api);
    }else{
        phase = "idle";
        startFreeBattle(b, foe, api, chapter.title);
    };
};

/* ---------- 章節結束與結局 ---------- */

function endChapter(){
    if(typer){ typer.cancel(); typer = null; };
    phase = "end";
    clearOptions();
    setSpeaker(null);
    storyText.classList.remove("more");
    storyText.classList.add("done");
    const index = state.story.chapterIndex;
    storyText.innerHTML = '<span class="story-end">—— ' + chapterLabel(index) + '　' + chapter.title + '　完 ——</span>';

    /*接哪一章：章節檔寫了 next 就照它（"end" = 回到開始畫面），沒寫就接陣列裡的下一章*/
    let label;
    if(chapter.next === "end"){
        endAction = exitStory;
        label = "回到開始畫面";
    }else if(chapter.next){
        const target = chapter.next;
        endAction = function(){ go(target); };
        label = String(target).indexOf("ending:") === 0 ? "繼續" : "進入下一章";
    }else if(chapters[index + 1]){
        endAction = function(){ startChapter(index + 1); };
        label = "進入下一章";
    }else{
        endAction = exitStory;
        label = "回到開始畫面";
    };
    showNextButton(label);
};

function playEnding(id){
    const ending = getEnding(id);
    if(!ending){
        console.warn("[故事] 找不到結局：" + id + "（請檢查 data/story-mode/endings.js）");
        endChapter();
        return;
    };
    if(typer){ typer.cancel(); typer = null; };
    inEnding = true;
    inBattle = false;
    state.story.bg = ending.bg || "end";
    storyBanner.innerHTML = "";
    const b = document.createElement("b");
    b.textContent = "結局";
    storyBanner.appendChild(b);
    playDynamic({
        lines: ending.lines || [],
        then: function(){ showEndingCard(id, ending); }
    });
};

function showEndingCard(id, ending){
    if(typer){ typer.cancel(); typer = null; };
    phase = "end";
    clearOptions();
    setSpeaker(null);
    const isNew = recordEnding(id);
    storyText.classList.remove("more");
    storyText.classList.add("done");
    let html = '<span class="story-end">—— 結局：' + (ending.title || id) + ' ——</span>';
    if(ending.kind){ html += '<span class="story-end-sub">' + ending.kind + '</span>'; };
    if(isNew){ html += '<span class="story-end-sub">新結局達成！</span>'; };
    storyText.innerHTML = html;
    endAction = exitStory;
    showNextButton("回到開始畫面");
};

/* ---------- 存檔與讀檔（一個欄位） ---------- */

function twoDigits(n){ return String(n).padStart(2, "0"); };

function describeSave(data){
    const found = chapters[findChapterIndex(data.chapterId)];
    const d = new Date(data.savedAt);
    return (found ? found.title : data.chapterId) + "　" +
        twoDigits(d.getMonth() + 1) + "/" + twoDigits(d.getDate()) + " " + twoDigits(d.getHours()) + ":" + twoDigits(d.getMinutes());
};

function setSaveInfo(message){
    if(message){
        storySaveInfo.textContent = message;
        return;
    };
    const data = readSave();
    storySaveInfo.textContent = data ? "存檔：" + describeSave(data) : "尚無存檔";
};

function canSave(){
    return phase === "line" && !inBattle && !inEnding && !!state.story.entry;
};

function doSave(){
    if(!canSave()){
        setSaveInfo("此時不能存檔（戰鬥、結局與章節結束畫面）");
        return;
    };
    writeSave({
        v: 1,
        savedAt: Date.now(),
        chapterId: chapter.id,
        sceneId: state.story.sceneId,
        entry: state.story.entry
    });
    setSaveInfo("已存檔：" + describeSave(readSave()));
};

function doLoad(){
    const data = readSave();
    const ci = data ? findChapterIndex(data.chapterId) : -1;
    if(!data){ setSaveInfo("尚無存檔"); return; };
    if(ci < 0 || !chapters[ci].scenes[data.sceneId]){
        setSaveInfo("存檔的章節或場景已不存在，無法讀取");
        return;
    };
    if(typer){ typer.cancel(); typer = null; };
    inBattle = false;
    inEnding = false;
    state.storyFoe = null;
    state.storyBattle = null;
    const entry = data.entry || {};
    initialStatusData();
    Object.assign(playerData, entry.player || {});
    playerData.imgAlts = [];
    applyPortrait(playerData, function(){ updateStatusPanel(storyScreen); });
    state.story.flags = JSON.parse(JSON.stringify(entry.flags || {}));
    state.story.visits = JSON.parse(JSON.stringify(entry.visits || {}));
    state.storySpeaker = null;
    updateStatusPanel(storyScreen);
    startChapter(ci, data.sceneId);
    setSaveInfo("已讀取：" + describeSave(data));
};

/*需要確認的按鈕：第一次按變成「再按一次確認」，2.5 秒內再按才執行*/
function confirmButton(button, confirmText, needs, action){
    const idle = button.textContent;
    let timer = null;
    function disarm(){
        clearTimeout(timer);
        timer = null;
        button.textContent = idle;
    };
    button.addEventListener("click", function(){
        if(timer){
            disarm();
            action();
        }else if(needs()){
            button.textContent = confirmText;
            timer = setTimeout(disarm, 2500);
        }else{
            action();
        };
    });
};

/* ---------- 推進（繼續按鈕、點對話框、Enter 都走這裡） ---------- */

function advance(){
    if(phase === "end"){
        if(endAction){ endAction(); };
        return;
    };
    if(phase !== "line"){ return; };
    if(typer && typer.isTyping()){
        typer.skip();               /*先把整句顯示出來*/
        return;
    };
    const lines = scene.lines || [];
    if(state.story.lineIndex < lines.length - 1){
        showLine(state.story.lineIndex + 1);
    }else if(!scene.options){
        afterLines();
    };
};

export function bindStory(){
    storyNextButton.addEventListener("click", advance);
    storyContent.addEventListener("click", advance);
    storyExitButton.addEventListener("click", exitStory);
    confirmButton(storySaveButton, "覆蓋存檔？", function(){ return canSave() && !!readSave(); }, doSave);
    confirmButton(storyLoadButton, "放棄目前進度？", function(){ return !!readSave(); }, doLoad);
};
