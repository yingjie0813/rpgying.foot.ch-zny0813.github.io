/* ==========================================================================
   theme.js —— 純視覺層(水墨暮色風格)的入口

   原則:
   - 只「讀取」遊戲狀態(playerData、gameProgress、state…),從不寫入,
     也不呼叫、不覆蓋 system/ 裡的任何函式。
   - 這個資料夾(ui/)壞掉或被移除,遊戲照樣可以玩,只是回到沒有裝飾的外觀。
   - 它做的事(各自拆成獨立檔案):
       background.js      依畫面與大關切換暮色山水背景、飄落花瓣
       emblems.js         為玩家 / 頭目放上印章頭像或人物頭像
       progress-nodes.js  把「第 n / 10 小關」畫成進度點、把大關名稱同步到上方橫幅
       chips.js           把事件結果裡的「| 生命 +10 |」文字轉成小徽章(文字內容不變)
       vs-panel.js        王關對戰面板:雙方出拳、勝負字樣、傷害飄字
       difficulty-art.js  難度卡片的水墨小圖
   - 本檔負責「串接」:畫面一有相關變動(MutationObserver 偵測到),就把上面幾項重新同步一次。
   ========================================================================== */

import { $, $$ } from "./helpers.js";
import { setScene, pickScene } from "./background.js";
import { updateEmblems } from "./emblems.js";
import { drawDifficultyArt } from "./difficulty-art.js";
import { updateProgress, updateBanners } from "./progress-nodes.js";
import { chipify } from "./chips.js";
import { initVsPanel, syncBattle } from "./vs-panel.js";
import { startScreen, gameScreen, bossScreen, resultScreen, storyScreen } from "../system/dom.js";

function init(){
    drawDifficultyArt();
    initVsPanel();

    let queued = false;
    function refresh(){
        if(queued){ return; }
        queued = true;
        Promise.resolve().then(() => {
            queued = false;
            try{
                const s = pickScene();
                setScene(s[0], s[1]);
                updateEmblems();
                updateProgress();
                updateBanners();
                chipify();
                syncBattle();
            }catch(e){ console.warn('[theme.js]', e); }
        });
    }

    const mo = new MutationObserver(refresh);
    [startScreen, gameScreen, bossScreen, resultScreen, storyScreen].forEach(s => { if(s){ mo.observe(s, { attributes:true, attributeFilter:['hidden', 'data-kind'] }); } });
    const deep = { childList:true, characterData:true, subtree:true };
    $$('.current-level, .status-panel-level, .level-type, .status-panel-name, .hpText').forEach(el => mo.observe(el, deep));
    ['#boss-name', '#event-title', '#event-description', '#battle-log-content', '#story-speaker-name'].forEach(sel => {
        const el = $(sel);
        if(el){ mo.observe(el, deep); }
    });

    refresh();
}

export function initTheme(){
    try{ init(); }
    catch(err){ console.warn('[theme.js] 視覺層未能啟動(不影響遊戲進行):', err); }
}
