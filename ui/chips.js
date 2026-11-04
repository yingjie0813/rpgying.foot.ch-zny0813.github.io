/* ==================== 事件結果：「| 生命 +10 |」→ 小徽章 ==================== */
/* 顯示的字完全相同，只是換成徽章外觀。 */

import { $ } from "./helpers.js";

const STAT_RE = /\|\s*(最大生命|生命|攻擊|防禦)\s+([+-]\d+%?)\s*\|/g;

export function chipify(){
    const d = $('#event-description');
    if(!d){ return; }
    const html = d.innerHTML;
    if(html.indexOf('|') < 0){ return; }
    const out = html.replace(STAT_RE, (m, name, val) =>
        '<span class="chip ' + (val.charAt(0) === '-' ? 'down' : 'up') + '">' + name + ' ' + val + '</span>');
    if(out !== html){ d.innerHTML = out; }
}
