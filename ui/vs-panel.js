/* ==================== 王關對戰面板 ==================== */
/* 依戰鬥階段顯示雙方出拳、勝負字樣、傷害飄字。只讀取 state，不改動遊戲資料。 */

import { MOVE_ICON, MOVE_NAME } from "./ink-art.js";
import { $ } from "./helpers.js";
import { hero, boss } from "./game-view.js";
import { state } from "../system/state.js";
import { battleFlow } from "../data/battle-flow.js";
import { bossScreen } from "../system/dom.js";

const MOVE = { rock:0, scissors:1, paper:2 };

let vsbox = null;

/*建立面板的 HTML（啟動時呼叫一次）*/
export function initVsPanel(){
    const vsHost = $('#vs-overlay');
    vsHost.innerHTML =
        '<div class="vsbox" id="vsbox">' +
          '<div class="vs-row">' +
            '<div class="vs-slot"><span class="vs-who" id="vs-who-me"></span><div class="plateau q" id="pl-me">？</div><div class="mv" id="mv-me"></div></div>' +
            '<div class="vs-mid">VS</div>' +
            '<div class="vs-slot"><span class="vs-who" id="vs-who-foe"></span><div class="plateau q" id="pl-foe">？</div><div class="mv" id="mv-foe"></div></div>' +
          '</div>' +
          '<div class="verdict" id="verdict"></div>' +
        '</div>';

    vsbox = $('#vsbox');
}

function setPl(who, idx, cls){
    const p = $('#pl-' + who), n = $('#mv-' + who);
    p.className = 'plateau' + (idx == null ? ' q' : '') + (cls ? ' ' + cls : '');
    p.innerHTML = idx == null ? '？' : MOVE_ICON[idx];
    n.textContent = idx == null ? '' : MOVE_NAME[idx];
}
function setVerdict(text, cls){
    const v = $('#verdict');
    v.className = 'verdict';
    v.textContent = text || '';
    if(text){
        void v.offsetWidth;                       // 重新觸發彈出動畫
        v.className = 'verdict ' + cls + ' pop';
    }
}
function floatDmg(text, side){
    const d = document.createElement('div');
    d.className = 'dmgfloat ' + side;
    d.textContent = text;
    vsbox.appendChild(d);
    setTimeout(() => d.remove(), 1300);
}
function resetVS(){ setPl('me', null); setPl('foe', null); setVerdict('', ''); }

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
    if(nm){ $('#mv-foe').textContent = nm; }
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
            $('#mv-foe').textContent = nm;
        }else{
            const mv = String(b['招式'][state.bossChoice[0]][state.bossChoice[1]]['攻擊'])
                .replace(/\{name\}/g, h.name)
                .split(/<br\s*\/?>/i).map(t => t.replace(/<[^>]*>/g, '').trim()).filter(Boolean)[0] || '';
            $('#mv-foe').textContent = (mv && Array.from(mv).length <= 14) ? mv : '出招中…';
        }
    }catch(e){ $('#mv-foe').textContent = '出招中…'; }
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

    $('#vs-who-me').textContent  = h.name;
    $('#vs-who-foe').textContent = b.name;

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
