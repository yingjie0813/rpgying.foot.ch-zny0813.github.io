/* ==========================================================================
   theme.js —— 純視覺層(水墨暮色風格)

   原則:
   - 只「讀取」遊戲狀態(playerData、gameProgress、current_boss、battlePhase… 等),
     從不寫入,也不呼叫、不覆蓋 main.js / data.js / boss.js 的任何函式或變數。
   - 這支檔案壞掉或被移除,遊戲照樣可以玩,只是回到沒有裝飾的外觀。
   - 它做的事:
       1. 依畫面與大關切換暮色山水背景、飄落花瓣
       2. 為玩家 / 頭目放上印章頭像
       3. 把「第 n / 10 小關」畫成進度點、把大關名稱同步到上方橫幅
       4. 把事件結果裡的「| 生命 +10 |」文字轉成小徽章(文字內容不變)
       5. 王關對戰面板:依戰鬥階段顯示雙方出拳、勝負字樣、傷害飄字
   ========================================================================== */
(function(){
  'use strict';
  try{ init(); }
  catch(err){ console.warn('[theme.js] 視覺層未能啟動(不影響遊戲進行):', err); }

  function init(){
    const A = window.InkArt;
    if(!A){ return; }

    const $  = (s, el) => (el || document).querySelector(s);
    const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const hash = s => { let h = 2166136261; for(const c of String(s)){ h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

    const startScr = $('.start-screen');
    const gameScr  = $('.game-screen');
    const bossScr  = $('.boss-screen');
    const resultScr = $('.result-screen');
    const bg       = $('#bg');
    const petalsEl = $('#petals');

    /* ---------- 安全讀取遊戲狀態(只讀) ---------- */
    const major = () => { try{ const n = Math.max(1, Number(gameProgress.majorLevel) || 1); return ((n - 1) % 10) + 1; }catch(e){ return 1; } };
    const small = () => { try{ return clamp(Number(gameProgress.smallLevel) || 1, 1, 10); }catch(e){ return 1; } };
    const hero  = () => { try{ return playerData; }catch(e){ return null; } };
    const boss  = () => { try{ return (typeof current_boss !== 'undefined') ? current_boss : null; }catch(e){ return null; } };
    const cleared = () => { try{ return (typeof game_cleared !== 'undefined') && !!game_cleared; }catch(e){ return false; } };


    /* =====================================================================
       1. 背景與花瓣
       ===================================================================== */
    const SCENES_SMALL = ['road','river','temple','market','bamboo','field','bridge','cliff','stones','summit'];
    const SCENES_BOSS  = ['arena1','arena1','arena1','arena2','arena2','arena2','arena3','arena3','arena3','arena3'];
    const PETAL = { title:'p', road:'p', river:'p', temple:'l', market:'p', field:'p', bridge:'p', summit:'p', end:'p' };

    let curSceneKey = '';

    // 花瓣使用自己的亂數,不呼叫 Math.random(),避免影響遊戲本身的隨機結果
    let petalSeed = 20260101;
    function setPetals(kind){
      petalsEl.innerHTML = '';
      if(!kind){ return; }
      const rnd = A.RNG(petalSeed++);
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

    function setScene(key, seed){
      const k = key + ':' + seed;
      if(k === curSceneKey){ return; }
      curSceneKey = k;
      const layer = document.createElement('div');
      layer.className = 'layer';
      layer.innerHTML = A.sceneSVG(key, seed);
      bg.appendChild(layer);
      requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
      setTimeout(() => { while(layer.previousElementSibling){ layer.previousElementSibling.remove(); } }, 1000);
      setPetals(PETAL[key] || null);
    }

    function pickScene(){
      const lv = major();
      if(resultScr && !resultScr.hidden){ return [resultScr.dataset.kind === 'clear' ? 'end' : 'endDark', 5]; }
      if(!bossScr.hidden){ return [SCENES_BOSS[lv - 1], lv]; }
      if(!gameScr.hidden){
        const h = hero();
        if(cleared()){ return ['end', 5]; }
        if(h && h.hp <= 0){ return ['endDark', 3]; }
        return [SCENES_SMALL[lv - 1], ((lv - 1) * 10 + small()) % 9 + 1];
      }
      return ['title', 1];
    }


    /* =====================================================================
       2. 頭像印章(玩家 / 頭目)
       ===================================================================== */
    function updateEmblems(){
      $$('.emblem-slot').forEach(slot => {
        const who = slot.dataset.who;
        const src = who === 'me' ? hero() : boss();
        const name = src && src.name ? String(src.name) : '';
        const img  = src && src.img ? String(src.img).trim() : '';
        const k = who + ':' + name + ':' + img;
        if(slot.dataset.k === k){ return; }
        slot.dataset.k = k;
        slot.innerHTML = '';
        if(!name){ return; }
        const seal = () => A.sealEmblem(Array.from(name)[0], hash(name) % 9);
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


    const DIFF_ART = {
      easy:    [['#cfe3c8', '#7fa88a'], 'tree',   3],
      normal:  [['#d9c7a0', '#a58a63'], 'pagoda', 5],
      hard:    [['#e3a98a', '#a2503c'], 'rocks',  7],
      endless: [['#4a3a6a', '#1c1530'], 'boat',   9]
    };
    $$('.difficulty-card').forEach(card => {
      const a = DIFF_ART[card.dataset.diff], slot = $('.difficulty-art', card);
      if(a && slot){ slot.innerHTML = A.inkMini(a[2], a[0], a[1]); }
    });


    /* =====================================================================
       3. 進度點與上方橫幅
       ===================================================================== */
    function updateProgress(){
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

    function updateBanners(){
      $$('.stage-banner').forEach(b => {
        const scr = b.closest('.game-screen, .boss-screen');
        if(!scr){ return; }
        const lv = $('.status-panel-level', scr), ty = $('.level-type', scr);
        if(!lv || !ty){ return; }
        const html = '<b>' + A.esc(lv.textContent) + '</b><i>·</i>' + A.esc(ty.textContent);
        if(b.dataset.h !== html){ b.dataset.h = html; b.innerHTML = html; }
      });
    }


    /* =====================================================================
       4. 事件結果:「| 生命 +10 |」→ 小徽章(顯示的字完全相同,只是換成徽章外觀)
       ===================================================================== */
    const STAT_RE = /\|\s*(最大生命|生命|攻擊|防禦)\s+([+-]\d+)\s*\|/g;
    function chipify(){
      const d = $('#event-description');
      if(!d){ return; }
      const html = d.innerHTML;
      if(html.indexOf('|') < 0){ return; }
      const out = html.replace(STAT_RE, (m, name, val) =>
        '<span class="chip ' + (val.charAt(0) === '-' ? 'down' : 'up') + '">' + name + ' ' + val + '</span>');
      if(out !== html){ d.innerHTML = out; }
    }


    /* =====================================================================
       5. 王關對戰面板
       ===================================================================== */
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

    const vsbox = $('#vsbox');
    const MOVE = { rock:0, scissors:1, paper:2 };

    function setPl(who, idx, cls){
      const p = $('#pl-' + who), n = $('#mv-' + who);
      p.className = 'plateau' + (idx == null ? ' q' : '') + (cls ? ' ' + cls : '');
      p.innerHTML = idx == null ? '？' : A.MOVE_ICON[idx];
      n.textContent = idx == null ? '' : A.MOVE_NAME[idx];
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

    let lastKey = '', snap = null, uid = 0;
    const ids = new WeakMap();
    const bossId = o => { if(!ids.has(o)){ ids.set(o, ++uid); } return ids.get(o); };

    function syncBattle(){
      if(bossScr.hidden){ return; }
      const b = boss(), h = hero();
      if(!b || !h){ return; }

      $('#vs-who-me').textContent  = h.name;
      $('#vs-who-foe').textContent = b.name;

      let ph, rd;
      try{ ph = battlePhase; rd = round; }catch(e){ return; }

      const key = bossId(b) + ':' + rd + ':' + ph;
      if(key === lastKey){ return; }
      lastKey = key;

      const flow = battle_flow;
      if(ph === flow[0] || ph === flow[1]){
        resetVS();
      }else if(ph === flow[2]){
        // 玩家已出拳,頭目出招中(此時不洩漏頭目出的是哪一拳)
        setPl('me', MOVE[playerChoice]);
        setPl('foe', null, 'shake');
        try{
          const move = b['招式'][bossChoice[0]][bossChoice[1]];
          // 招式有填「名稱」就直接顯示名稱;沒填(空字串或沒有此欄位)就維持原本的顯示方式:
          // 招式文字有時是短短的招式名稱、有時是一整句敘述;只有夠短時才顯示在面板上,完整文字仍在戰鬥紀錄裡
          const nm = (move && typeof move['名稱'] === 'string') ? move['名稱'].replace(/\{name\}/g, h.name).trim() : '';
          if(nm){
            $('#mv-foe').textContent = nm;
          }else{
            const mv = String(move['攻擊'])
              .replace(/\{name\}/g, h.name)
              .split(/<br\s*\/?>/i).map(t => t.replace(/<[^>]*>/g, '').trim()).filter(Boolean)[0] || '';
            $('#mv-foe').textContent = (mv && Array.from(mv).length <= 14) ? mv : '出招中…';
          }
        }catch(e){ $('#mv-foe').textContent = '出招中…'; }
        setVerdict('', '');
      }else if(ph === flow[3]){
        const r = battleResult;
        setPl('me',  MOVE[playerChoice], r === 'win'  ? 'win' : '');
        setPl('foe', MOVE[bossChoice[0]], r === 'lose' ? 'win' : '');
        if(r === 'win'){ setVerdict('勝', 'win'); }
        else if(r === 'lose'){ setVerdict('落敗', 'lose'); }
        else{ setVerdict('平手', 'tie'); }
        if(snap){
          const dFoe = snap.foe - b.hp, dMe = snap.me - h.hp;
          if(dFoe > 0){ floatDmg('-' + dFoe, 'foe'); }
          if(dMe > 0){ floatDmg('-' + dMe, 'me'); }
        }
      }else if(ph === flow[4]){
        if(battleEnding === 'win'){ setVerdict('勝利', 'big win'); }
        else if(battleEnding === 'lose'){ setVerdict('敗北', 'lose'); }
      }
      snap = { me: h.hp, foe: b.hp };
    }


    /* =====================================================================
       串接:有任何相關畫面變動就重新同步一次
       ===================================================================== */
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
    [startScr, gameScr, bossScr, resultScr].forEach(s => { if(s){ mo.observe(s, { attributes:true, attributeFilter:['hidden', 'data-kind'] }); } });
    const deep = { childList:true, characterData:true, subtree:true };
    $$('.current-level, .status-panel-level, .level-type, .status-panel-name, .hpText').forEach(el => mo.observe(el, deep));
    ['#boss-name', '#event-title', '#event-description', '#battle-log-content'].forEach(sel => {
      const el = $(sel);
      if(el){ mo.observe(el, deep); }
    });

    refresh();
  }
})();
