/* ==================== 打字機效果 ==================== */
/* 把一段 HTML 文字一個字一個字顯示出來。
   <br>、<b> 這類標籤與 &amp; 這類字元實體不佔時間（整個一起出現），所以文本裡可以放 HTML。 */

export const DEFAULT_SPEED = 40;     /*每個字間隔幾毫秒（可在章節/場景/台詞用 speed 覆蓋）*/

const TOKEN_RE = /(<[^>]*>|&[#a-zA-Z0-9]+;)/;

/*拆成最小單位：{ s: 內容, visible: 是不是看得見的字 }*/
function toUnits(html){
    const units = [];
    String(html).split(TOKEN_RE).forEach(function(part){
        if(part === ""){ return; };
        if(part.charAt(0) === "<"){
            units.push({ s: part, visible: false });
        }else if(part.charAt(0) === "&" && TOKEN_RE.test(part)){
            units.push({ s: part, visible: true });
        }else{
            Array.from(part).forEach(function(ch){ units.push({ s: ch, visible: true }); });
        };
    });
    return units;
}

/*回傳控制器：skip() 立刻顯示整句、cancel() 停止、isTyping() 是否還在打字*/
export function typeInto(el, html, options){
    const opts = options || {};
    const units = toUnits(html);
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduce ? 0 : (typeof opts.speed === "number" ? opts.speed : DEFAULT_SPEED);

    let shown = 0;          /*已顯示到第幾個單位*/
    let timer = null;
    let typing = true;

    function render(){
        el.innerHTML = units.slice(0, shown).map(function(u){ return u.s; }).join("");
    };

    function finish(){
        clearTimeout(timer);
        timer = null;
        shown = units.length;
        render();
        if(typing){
            typing = false;
            if(typeof opts.onDone === "function"){ opts.onDone(); };
        };
    };

    function step(){
        /*吃掉開頭的標籤，再顯示一個字*/
        while(shown < units.length && !units[shown].visible){ shown += 1; };
        if(shown < units.length){ shown += 1; };
        /*後面如果只剩標籤（例如結尾的 </b>）就一起帶出來*/
        let rest = shown;
        while(rest < units.length && !units[rest].visible){ rest += 1; };
        if(rest >= units.length){ shown = units.length; };
        render();
        if(shown >= units.length){
            finish();
        }else{
            timer = setTimeout(step, speed);
        };
    };

    el.innerHTML = "";
    if(units.length === 0 || speed <= 0){
        finish();
    }else{
        step();
    };

    return {
        skip: finish,
        cancel: function(){ clearTimeout(timer); timer = null; typing = false; },
        isTyping: function(){ return typing; }
    };
};
