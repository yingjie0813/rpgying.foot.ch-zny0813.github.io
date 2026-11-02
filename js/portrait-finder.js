/* ==========================================================================
   portrait-finder.js — 依名字查頭像網址(查 portraits.js 對照表)
   --------------------------------------------------------------------------
   需要先載入 portraits.js(內容是 window.PORTRAITS = { "名字": 圖片, ... }),
   再載入這支檔案。每個角色的「圖片」可以寫成:
     單一網址   "沈非笑": "https://.../24171.jpeg"
     多張網址   "沈非笑": ["https://.../24171.jpeg", "https://.../第二張.jpeg"]

   用法(都回傳 Promise):
     const url  = await findPortrait("沈非笑");    // 隨機給一張網址;找不到 → null
     const urls = await findPortraits("沈非笑");   // 全部網址的陣列;找不到 → []
     也可以寫 找圖("沈非笑")、找全部圖("沈非笑")

   規則:
     - 名字完全相符才算找到(前後空白會先去掉)。
     - 空字串、不是字串的值會被略過;對照表沒載入或名字不在表裡,一律回傳
       null / [],不會丟錯。
     - findPortrait 每次呼叫都重新隨機抽;遊戲每局只呼叫一次,所以同一局內頭像不變。
   ========================================================================== */
(function(root){
    "use strict";

    /*取出某個名字的所有有效網址(去空白、去重複)*/
    function listFor(name){
        const key = String(name == null ? "" : name).trim();
        const table = root.PORTRAITS;
        if(!key || !table || typeof table !== "object"){ return []; }
        if(!Object.prototype.hasOwnProperty.call(table, key)){ return []; }
        const raw = table[key];
        const arr = Array.isArray(raw) ? raw : [raw];
        const out = [];
        arr.forEach(function(u){
            if(typeof u !== "string"){ return; }
            const s = u.trim();
            if(s && out.indexOf(s) < 0){ out.push(s); }
        });
        return out;
    }

    function findPortraits(name){
        return Promise.resolve(listFor(name));
    }

    function findPortrait(name){
        const list = listFor(name);
        return Promise.resolve(list.length ? list[Math.floor(Math.random() * list.length)] : null);
    }

    root.findPortrait = findPortrait;
    root.findPortraits = findPortraits;
    root.找圖 = findPortrait;
    root.找全部圖 = findPortraits;
})(typeof window !== "undefined" ? window : globalThis);
