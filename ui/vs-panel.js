/* ==================== 王關對戰面板 ==================== */
/* 依戰鬥階段顯示雙方出拳、勝負字樣、傷害飄字。只讀取 state，不改動遊戲資料。 */

import { MOVE_ICON, MOVE_NAME } from "./ink-art.js";
import { $ } from "./helpers.js";
import { hero, boss } from "./game-view.js";
import { state } from "../system/state.js";
import { battleFlow } from "../data/battle-flow.js";
import { bossScreen } from "../system/dom.js";

const MOVE = { rock:0, scissors:1, paper:2 };

let vsbox = null, bossP = null, storyP = null;

/*面板的 HTML。每個零件用 data-r 標記，之後用 P(root) 在這個面板裡找，所以王關畫面和故事畫面可以各放一個*/
function vsHTML(ids){
    const id = n => ids ? ' id="' + n + '"' : '';
    return '<div class="vsbox"' + id('vsbox') + '>' +
          '<div class="vs-row">' +
            '<div class="vs-slot"><span class="vs-who"' + id('vs-who-me') + ' data-r="who-me"></span><div class="plateau q"' + id('pl-me') + ' data-r="pl-me">？</div><div class="mv"' + id('mv-me') + ' data-r="mv-me"></div></div>' +
            '<div class="vs-mid">VS</div>' +
            '<div class="vs-slot"><span class="vs-who"' + id('vs-who-foe') + ' data-r="who-foe"></span><div class="plateau q"' + id('pl-foe') + ' data-r="pl-foe">？</div><div class="mv"' + id('mv-foe') + ' data-r="mv-foe"></div></div>' +
          '</div>' +
          '<div class="verdict"' + id('verdict') + ' data-r="verdict"></div>' +
        '</div>';
}

/*取得某個面板（root = .vs-overlay）裡的零件*/
function P(root){
    const q = n => root.querySelector('[data-r="' + n + '"]');
    return { root, box: root.querySelector('.vsbox'), whoMe: q('who-me'), whoFoe: q('who-foe'), plMe: q('pl-me'), plFoe: q('pl-foe'), mvMe: q('mv-me'), mvFoe: q('mv-foe'), verdict: q('verdict') };
}

/*建立面板的 HTML（啟動時呼叫一次）：王關畫面一個，故事畫面一個（教學戰鬥用）*/
export function initVsPanel(){
    const vsHost = $('#vs-overlay');
    vsHost.innerHTML = vsHTML(true);
    vsbox = $('#vsbox');
    bossP = P(vsHost);

    const storyHost = $('#story-vs');
    if(storyHost){
        storyHost.innerHTML = vsHTML(false);
        storyP = P(storyHost);
    }
}

function setPl(who, idx, cls, pn){
    const o = pn || bossP;
    const p = who === 'me' ? o.plMe : o.plFoe, n = who === 'me' ? o.mvMe : o.mvFoe;
    p.className = 'plateau' + (idx == null ? ' q' : '') + (cls ? ' ' + cls : '');
    p.innerHTML = idx == null ? '？' : MOVE_ICON[idx];
    n.textContent = idx == null ? '' : MOVE_NAME[idx];
}
function setVerdict(text, cls, pn){
    const v = (pn || bossP).verdict;
    v.className = 'verdict';
    v.textContent = text || '';
    if(text){
        void v.offsetWidth;                       // 重新觸發彈出動畫
        v.className = 'verdict ' + cls + ' pop';
    }
}
function floatDmg(text, side, pn){
    const d = document.createElement('div');
    d.className = 'dmgfloat ' + side;
    d.textContent = text;
    (pn || bossP).box.appendChild(d);
    setTimeout(() => d.remove(), 1300);
}
function resetVS(pn){ setPl('me', null, '', pn); setPl('foe', null, '', pn); setVerdict('', '', pn); }

// 頭目這回合招式的「名稱」(bossData 招式裡的 名稱 欄位);沒填就回傳空字串
function foeMoveName(b, h){
    try{
        const move = b['招式'][state.bossChoice[0]][state.bossChoice[1]];
        return (move && typeof move['名稱'] === 'string') ? move['名稱'].replace(/\{name\}/g, h.name).trim() : '';
    }catch(e){ return ''; }
}

let lastKey = '', snap = null, uid = 0;
const ids = new WeakMap();
const bossId = o => { if(!ids.has(o)){ ids.set(o, ++uid); } return ids.get(o); };

/*[1] 頭目出現預兆、玩家選拳:招式名稱有填就先顯示出來(出拳仍保持「？」,不洩漏)*/
function showChoosePhase(b, h){
    resetVS();
    const nm = foeMoveName(b, h);
    if(nm){ bossP.mvFoe.textContent = nm; }
}

/*[2] 玩家已出拳,頭目出招中(此時不洩漏頭目出的是哪一拳)*/
function showActionPhase(b, h){
    setPl('me', MOVE[state.playerChoice]);
    setPl('foe', null, 'shake');
    try{
        // 招式有填「名稱」就直接顯示名稱;沒填(空字串或沒有此欄位)就維持原本的顯示方式:
        // 招式文字有時是短短的招式名稱、有時是一整句敘述;只有夠短時才顯示在面板上,完整文字仍在戰鬥紀錄裡
        const nm = foeMoveName(b, h);
        if(nm){
            bossP.mvFoe.textContent = nm;
        }else{
            const mv = String(b['招式'][state.bossChoice[0]][state.bossChoice[1]]['攻擊'])
                .replace(/\{name\}/g, h.name)
                .split(/<br\s*\/?>/i).map(t => t.replace(/<[^>]*>/g, '').trim()).filter(Boolean)[0] || '';
            bossP.mvFoe.textContent = (mv && Array.from(mv).length <= 14) ? mv : '出招中…';
        }
    }catch(e){ bossP.mvFoe.textContent = '出招中…'; }
    setVerdict('', '');
}

/*[3] 顯示雙方出拳、勝負與傷害飄字*/
function showResultPhase(b, h){
    const r = state.battleResult;
    setPl('me',  MOVE[state.playerChoice], r === 'win'  ? 'win' : '');
    setPl('foe', MOVE[state.bossChoice[0]], r === 'lose' ? 'win' : '');
    if(r === 'win'){ setVerdict('勝', 'win'); }
    else if(r === 'lose'){ setVerdict('落敗', 'lose'); }
    else{ setVerdict('平手', 'tie'); }
    if(snap){
        const dFoe = snap.foe - b.hp, dMe = snap.me - h.hp;
        if(dFoe > 0){ floatDmg('-' + dFoe, 'foe'); }
        if(dMe > 0){ floatDmg('-' + dMe, 'me'); }
    }
}

/*[4] 戰鬥結束時顯示勝利／敗北*/
function showConsequencePhase(){
    if(state.battleEnding === 'win'){ setVerdict('勝利', 'big win'); }
    else if(state.battleEnding === 'lose'){ setVerdict('敗北', 'lose'); }
}

/*依目前戰鬥階段同步對戰面板*/
export function syncBattle(){
    if(bossScreen.hidden){ return; }
    const b = boss(), h = hero();
    if(!b || !h){ return; }

    bossP.whoMe.textContent  = h.name;
    bossP.whoFoe.textContent = b.name;

    const ph = state.battlePhase, rd = state.round;

    const key = bossId(b) + ':' + rd + ':' + ph;
    if(key === lastKey){ return; }
    lastKey = key;

    const flow = battleFlow;
    if(ph === flow[0]){
        resetVS();
    }else if(ph === flow[1]){
        showChoosePhase(b, h);
    }else if(ph === flow[2]){
        showActionPhase(b, h);
    }else if(ph === flow[3]){
        showResultPhase(b, h);
    }else if(ph === flow[4]){
        showConsequencePhase();
    }
    snap = { me: h.hp, foe: b.hp };
}

/* ==================== 故事模式教學戰鬥用的對戰面板（放在故事畫面中央） ==================== */
/* 由 system/story-mode/battle.js 依回合腳本一步一步呼叫；外觀與王關的對戰面板完全相同。 */
export const storyVs = {
    /*戰鬥開始：顯示面板與雙方名字*/
    open(meName, foeName){
        if(!storyP){ return; }
        storyP.whoMe.textContent = meName || '';
        storyP.whoFoe.textContent = foeName || '';
        resetVS(storyP);
        storyP.root.hidden = false;
    },
    /*敵人出現預兆、玩家選拳（招式名稱有就先顯示，出拳仍是「？」）*/
    choose(moveName){
        if(!storyP){ return; }
        resetVS(storyP);
        if(moveName){ storyP.mvFoe.textContent = moveName; }
    },
    /*玩家已出拳，敵人出招中（不洩漏敵人出哪一拳）*/
    action(myType, moveName){
        if(!storyP){ return; }
        setPl('me', MOVE[myType], '', storyP);
        setPl('foe', null, 'shake', storyP);
        storyP.mvFoe.textContent = moveName || '出招中…';
        setVerdict('', '', storyP);
    },
    /*顯示雙方出拳、勝負與傷害飄字*/
    result(myType, foeType, r, dmgToFoe, dmgToMe){
        if(!storyP){ return; }
        setPl('me', MOVE[myType], r === 'win' ? 'win' : '', storyP);
        setPl('foe', MOVE[foeType], r === 'lose' ? 'win' : '', storyP);
        if(r === 'win'){ setVerdict('勝', 'win', storyP); }
        else if(r === 'lose'){ setVerdict('落敗', 'lose', storyP); }
        else{ setVerdict('平手', 'tie', storyP); }
        if(dmgToFoe > 0){ floatDmg('-' + dmgToFoe, 'foe', storyP); }
        if(dmgToMe > 0){ floatDmg('-' + dmgToMe, 'me', storyP); }
    },
    /*關閉面板*/
    close(){
        if(!storyP){ return; }
        storyP.root.hidden = true;
        resetVS(storyP);
    }
};
