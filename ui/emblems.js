/* ==================== 頭像：印章頭像與人物頭像圖 ==================== */

import { sealEmblem } from "./ink-art.js";
import { $$, hash } from "./helpers.js";
import { hero, boss, speaker } from "./game-view.js";

/* 每個 .emblem-slot 先放印章，有頭像網址時再等圖片載入成功換上去。
   載入失敗就試備用圖（imgAlts），全部失敗就維持印章。 */
export function updateEmblems(){
    $$('.emblem-slot').forEach(slot => {
        const who = slot.dataset.who;
        const src = who === 'me' ? hero() : (who === 'speaker' ? speaker() : boss());
        const name = src && src.name ? String(src.name) : '';
        const img  = src && src.img ? String(src.img).trim() : '';
        const k = who + ':' + name + ':' + img;
        if(slot.dataset.k === k){ return; }
        slot.dataset.k = k;
        slot.innerHTML = '';
        if(!name){ return; }
        const seal = () => sealEmblem(Array.from(name)[0], hash(name) % 9);
        if(!img){ slot.innerHTML = seal(); return; }
        // 先顯示印章,圖片載入成功後再換成圖片(載入失敗就試備用圖,全部失敗就維持印章)
        slot.innerHTML = seal();
        const urls = [img].concat(Array.isArray(src.imgAlts) ? src.imgAlts.map(u => String(u).trim()).filter(Boolean) : []);
        const tryLoad = (i) => {
            if(i >= urls.length){ return; }
            const im = new Image();
            im.alt = '';
            im.referrerPolicy = 'no-referrer';
            im.onload = () => {
                if(slot.dataset.k !== k){ return; }
                const box = document.createElement('div');
                box.className = 'portrait';
                box.appendChild(im);
                slot.innerHTML = '';
                slot.appendChild(box);
            };
            im.onerror = () => { if(slot.dataset.k === k){ tryLoad(i + 1); } };
            im.src = urls[i];
        };
        tryLoad(0);
    });
}
