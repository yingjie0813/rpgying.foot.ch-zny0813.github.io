/* ==================== 進度點與上方橫幅 ==================== */

import { esc } from "./ink-art.js";
import { $, $$ } from "./helpers.js";
import { small } from "./game-view.js";

/*把「第 n / 10 小關」畫成十個進度點*/
export function updateProgress(){
    const cur = small();
    $$('.prog-nodes').forEach(ol => {
        if(!ol.children.length){
            for(let i = 1; i <= 10; i++){
                const li = document.createElement('li');
                if(i === 10){ li.className = 'boss'; }
                li.appendChild(document.createElement('i'));
                ol.appendChild(li);
            }
        }
        Array.from(ol.children).forEach((li, idx) => {
            const n = idx + 1;
            li.classList.toggle('done', n < cur);
            li.classList.toggle('cur', n === cur);
        });
    });
}

/*把大關名稱與關卡類型同步到上方橫幅*/
export function updateBanners(){
    $$('.stage-banner').forEach(b => {
        const scr = b.closest('.game-screen, .boss-screen');
        if(!scr){ return; }
        const lv = $('.status-panel-level', scr), ty = $('.level-type', scr);
        if(!lv || !ty){ return; }
        const html = '<b>' + esc(lv.textContent) + '</b><i>·</i>' + esc(ty.textContent);
        if(b.dataset.h !== html){ b.dataset.h = html; b.innerHTML = html; }
    });
}
