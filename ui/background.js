/* ==================== 背景與花瓣：依畫面與大關切換暮色山水 ==================== */

import { sceneSVG, RNG } from "./ink-art.js";
import { $ } from "./helpers.js";
import { major, small, hero, cleared } from "./game-view.js";
import { bossScreen, gameScreen, resultScreen, storyScreen } from "../system/dom.js";
import { state } from "../system/state.js";

const bg       = $('#bg');
const petalsEl = $('#petals');

const SCENES_SMALL = ['road','river','temple','market','bamboo','field','bridge','cliff','stones','summit'];
const SCENES_BOSS  = ['arena1','arena1','arena1','arena2','arena2','arena2','arena3','arena3','arena3','arena3'];
const PETAL = { title:'p', road:'p', river:'p', temple:'l', market:'p', field:'p', bridge:'p', summit:'p', end:'p' };

let curSceneKey = '';

// 花瓣使用自己的亂數,不呼叫 Math.random(),避免影響遊戲本身的隨機結果
let petalSeed = 20260101;
function setPetals(kind){
    petalsEl.innerHTML = '';
    if(!kind){ return; }
    const rnd = RNG(petalSeed++);
    for(let i = 0; i < 14; i++){
        const p = document.createElement('i');
        p.className = 'petal' + (kind === 'l' ? ' leaf' : '');
        p.style.left = (rnd() * 100) + '%';
        p.style.animationDuration = (9 + rnd() * 9) + 's';
        p.style.animationDelay = (-rnd() * 16) + 's';
        p.style.transform = 'scale(' + (.7 + rnd() * .7) + ')';
        petalsEl.appendChild(p);
    }
}

export function setScene(key, seed){
    const k = key + ':' + seed;
    if(k === curSceneKey){ return; }
    curSceneKey = k;
    const layer = document.createElement('div');
    layer.className = 'layer';
    layer.innerHTML = sceneSVG(key, seed);
    bg.appendChild(layer);
    requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
    setTimeout(() => { while(layer.previousElementSibling){ layer.previousElementSibling.remove(); } }, 1000);
    setPetals(PETAL[key] || null);
}

/*依目前畫面決定要用哪一張背景：回傳 [場景名, 種子]*/
export function pickScene(){
    const lv = major();
    if(resultScreen && !resultScreen.hidden){ return [resultScreen.dataset.kind === 'clear' ? 'end' : 'endDark', 5]; }
    if(storyScreen && !storyScreen.hidden){ return [state.story.bg || 'road', 1]; }   // 故事模式：背景由章節/場景的 bg 決定
    if(!bossScreen.hidden){ return [SCENES_BOSS[lv - 1], lv]; }
    if(!gameScreen.hidden){
        const h = hero();
        if(cleared()){ return ['end', 5]; }
        if(h && h.hp <= 0){ return ['endDark', 3]; }
        return [SCENES_SMALL[lv - 1], ((lv - 1) * 10 + small()) % 9 + 1];
    }
    return ['title', 1];
}
