/* ==================== 結算畫面（通關或倒下之後） ==================== */

import { difficultyConfig } from "../data/difficulty.js";
import { playerData, gameProgress } from "../data/player.js";
import { state } from "./state.js";
import { startScreen, gameScreen, bossScreen, resultScreen, storyScreen } from "./dom.js";
import { LEVEL_NUM } from "./progress.js";

/*kind："clear"（通關）或 "lose"（倒下）*/
export function showResult(kind){
    const cleared = (kind === "clear");
    const cfg = difficultyConfig[state.currentDifficulty];
    const big = gameProgress.majorLevel;
    const bigText = "第" + (LEVEL_NUM[big - 1] || big) + "大關";

    resultScreen.dataset.kind = kind;
    document.querySelector("#result-kicker").textContent = "難度：" + cfg.label;
    document.querySelector("#result-title").textContent = cleared ? "江湖傳說" : "江湖路盡";
    document.querySelector("#result-sub").textContent = cleared
        ? `${playerData.name}的名字，從此在江湖中流傳。`
        : "你再也撐不住，倒在了江湖路上……";

    /*統計列*/
    const rows = [];
    if(cleared){
        rows.push(["戰績", "十大關全數通過"]);
    }else{
        const where = !bossScreen.hidden || gameProgress.smallLevel >= 10
            ? "頭目戰" : "第 " + gameProgress.smallLevel + " 小關";
        rows.push(["抵達", bigText + "・" + where]);
        if(state.defeatBy){
            rows.push(["敗於", state.defeatBy]);
        };
    };
    rows.push(["擊敗頭目", state.defeatedBosses.length + " 位"]);
    rows.push(["最終數值", `HP ${playerData.hp} / ${playerData.maxHp}　ATK ${playerData.atk}　DEF ${playerData.def}`]);
    if(cleared && state.endlessJustUnlocked){
        rows.push(["新解鎖", "無盡模式"]);
    };

    const dl = document.querySelector("#result-rows");
    dl.innerHTML = "";
    rows.forEach(function(row){
        const dt = document.createElement("dt");
        dt.textContent = row[0];
        const dd = document.createElement("dd");
        dd.textContent = row[1];
        dl.appendChild(dt);
        dl.appendChild(dd);
    });

    /*擊敗的頭目名單*/
    const names = document.querySelector("#result-bosses");
    names.innerHTML = "";
    state.defeatedBosses.forEach(function(name){
        const chip = document.createElement("span");
        chip.textContent = name;
        names.appendChild(chip);
    });
    names.hidden = state.defeatedBosses.length === 0;

    state.endlessJustUnlocked = false;
    startScreen.hidden = true;
    gameScreen.hidden = true;
    bossScreen.hidden = true;
    resultScreen.hidden = false;
    document.querySelector("#result-again-button").focus({ preventScroll: true });
};

/*故事模式的結局總結面板（沿用結算畫面）。
  info：{ id, ending, isNew, progress:{got,total}, friends:[名字], defeated:[名字] }
  顯示順序：標題（ending.title）、評語（ending.comment）、交好的人、擊敗、（ending.rows 自訂列）、最終數值、結局收集。
  標題與評語直接取自 endings.js；交好的人 = endings.js 的 friends 對照旗標算出來的；擊敗 = 這一局打贏的戰鬥敵人。*/
export function showStoryEnding(info){
    const ending = info.ending;
    const list = function(arr){ return arr && arr.length ? arr.join("、") : "無"; };
    resultScreen.dataset.kind = "ending";
    document.querySelector("#result-kicker").textContent = "故事模式";
    document.querySelector("#result-title").textContent = ending.title || info.id;
    document.querySelector("#result-sub").textContent = ending.summary || "";

    const rows = [];
    rows.push(["評語", ending.comment ? String(ending.comment) : "—"]);
    rows.push(["交好的人", list(info.friends)]);
    rows.push(["擊敗", list(info.defeated)]);
    (ending.rows || []).forEach(function(row){ rows.push(row); });
    rows.push(["最終數值", `HP ${playerData.hp} / ${playerData.maxHp}　ATK ${playerData.atk}　DEF ${playerData.def}`]);
    if(info.progress && info.progress.total > 0){
        rows.push(["結局收集", info.progress.got + " / " + info.progress.total + (info.isNew ? "　新結局達成！" : "")]);
    };

    const dl = document.querySelector("#result-rows");
    dl.innerHTML = "";
    rows.forEach(function(row){
        const dt = document.createElement("dt");
        dt.textContent = row[0];
        const dd = document.createElement("dd");
        dd.textContent = row[1];
        dl.appendChild(dt);
        dl.appendChild(dd);
    });
    const names = document.querySelector("#result-bosses");
    names.innerHTML = "";
    names.hidden = true;

    startScreen.hidden = true;
    gameScreen.hidden = true;
    bossScreen.hidden = true;
    storyScreen.hidden = true;
    resultScreen.hidden = false;
    document.querySelector("#result-again-button").focus({ preventScroll: true });
};
