/* ==================== 章節資料檢查（寫文本時的小幫手） ==================== */
/* 只在瀏覽器主控台（F12 → Console）印出警告，不影響遊戲。檢查：
   1. start 場景存在　2. 所有 next / onWin / onLose / onVisit / 選項 next / 章節 next 指向的地方存在
      （只認：本章場景 "s3"、章節 "ch05"、跨章場景 "ch05.s3"、結局 "ending:結局id"）
   3. 從 start 走不到的場景（孤兒場景，常常是 next 寫錯）
   4. who 沒有寫在 characters.js　5. ending 指到不存在的結局
   6. 戰鬥的敵人（foe）沒有寫在 characters.js，或自由戰鬥的敵人缺 maxHp / atk / def */

import { characters } from "../../data/story-mode/characters.js";
import { endings } from "../../data/story-mode/endings.js";

function whoName(who){
    return String(who == null ? "" : who).trim();
};

/*場景裡所有「會前往別處」的寫法，回傳 [{ target, where }]*/
function targetsOf(scene){
    const list = [];
    if(scene.next){ list.push({ target: scene.next, where: "next" }); };
    if(scene.ending){ list.push({ target: "ending:" + scene.ending, where: "ending" }); };
    if(scene.onVisit){
        Object.keys(scene.onVisit).forEach(function(n){
            list.push({ target: scene.onVisit[n], where: "onVisit[" + n + "]" });
        });
    };
    (scene.options || []).forEach(function(o, i){
        if(o.next){ list.push({ target: o.next, where: "選項 " + (i + 1) + " 的 next" }); };
    });
    if(scene.battle){
        if(scene.battle.onWin){ list.push({ target: scene.battle.onWin, where: "battle.onWin" }); };
        if(scene.battle.onLose){ list.push({ target: scene.battle.onLose, where: "battle.onLose" }); };
    };
    return list;
};

export function validateChapters(chapters){
    const problems = [];
    const seenIds = {};
    const byId = {};
    chapters.forEach(function(ch){ byId[ch.id] = ch; });

    /*解析 target：回傳 { kind: "scene", chapter, id } | { kind: "chapter", chapter } | { kind: "ending", id } | null*/
    function resolve(ch, target){
        const key = String(target).trim();
        if(key.indexOf("ending:") === 0){ return { kind: "ending", id: key.slice(7).trim() }; };
        if(ch.scenes && ch.scenes[key]){ return { kind: "scene", chapter: ch, id: key }; };
        const colon = key.search(/[.:]/);        /*跨章：章節id.場景id（寫成 : 也行）*/
        if(colon > 0){
            const other = byId[key.slice(0, colon)];
            const sid = key.slice(colon + 1);
            if(other && other.scenes && other.scenes[sid]){ return { kind: "scene", chapter: other, id: sid }; };
        };
        if(byId[key]){ return { kind: "chapter", chapter: byId[key] }; };
        return null;
    };

    const externalEntries = {};      /*被其他章節用 "章節:場景" 指到的場景，不算孤兒*/

    chapters.forEach(function(ch){
        const tag = "[故事 " + ch.id + "] ";
        if(seenIds[ch.id]){ problems.push(tag + "章節 id 重複：" + ch.id); };
        seenIds[ch.id] = true;

        const scenes = ch.scenes || {};
        if(!scenes[ch.start]){ problems.push(tag + "start 指到不存在的場景：" + ch.start); };

        if(ch.next && ch.next !== "end"){
            const r = resolve(ch, ch.next);
            if(!r){ problems.push(tag + "章節的 next 指到不存在的地方：" + ch.next); }
            else if(r.kind === "ending" && !endings[r.id]){ problems.push(tag + "章節的 next 指到不存在的結局：" + r.id); }
            else if(r.kind === "scene" && r.chapter !== ch){ externalEntries[r.chapter.id + "/" + r.id] = true; };
        };

        Object.keys(scenes).forEach(function(id){
            const scene = scenes[id];
            targetsOf(scene).forEach(function(t){
                const r = resolve(ch, t.target);
                if(!r){
                    const key = String(t.target).trim();
                    let hint = "";
                    if(endings[key]){ hint = "（這是結局 id，要寫成 ending:" + key + "）"; }
                    else{
                        const owners = chapters.filter(function(c){ return c.scenes && c.scenes[key]; });
                        if(owners.length){ hint = "（本章沒有這個場景；" + owners[0].id + " 有，跨章要寫 " + owners[0].id + "." + key + "）"; };
                    };
                    problems.push(tag + "場景 " + id + " 的 " + t.where + " 指到不存在的地方：" + t.target + hint);
                }else if(r.kind === "ending" && !endings[r.id]){
                    problems.push(tag + "場景 " + id + " 的 " + t.where + " 指到不存在的結局：" + r.id + "（請檢查 endings.js）");
                }else if(r.kind === "scene" && r.chapter !== ch){
                    externalEntries[r.chapter.id + "/" + r.id] = true;
                };
            });

            /*選項只認 text / next / run / set / effect / if；常見錯誤是把場景層級的 onVisit / ending 寫進選項*/
            (scene.options || []).forEach(function(o, i){
                ["onVisit", "ending", "battle", "options", "lines"].forEach(function(k){
                    if(o[k] !== undefined){
                        problems.push(tag + "場景 " + id + " 的選項 " + (i + 1) + " 裡寫了 " + k + "，選項不支援這個欄位（要寫在場景層級，例如 onVisit: { 3: \"ending:結局id\" }）");
                    };
                });
            });
            if(scene.onVisit){
                Object.keys(scene.onVisit).forEach(function(n){
                    if(!/^[1-9][0-9]*$/.test(n)){
                        problems.push(tag + "場景 " + id + " 的 onVisit 欄位「" + n + "」不是次數，要寫成 { 3: \"目標\" }（第 3 次進入）");
                    };
                });
            };

            (scene.lines || []).forEach(function(line, i){
                const who = whoName(line.who);
                if(who && who !== "{name}" && !characters[who]){
                    problems.push(tag + "場景 " + id + " 第 " + (i + 1) + " 句的說話者「" + who + "」沒有寫在 characters.js");
                };
            });

            if(scene.battle){
                const b = scene.battle;
                const foe = whoName(b.foe);
                if(!foe){
                    problems.push(tag + "場景 " + id + " 的 battle 沒有寫 foe（敵人）");
                }else if(!characters[foe]){
                    problems.push(tag + "場景 " + id + " 的敵人「" + foe + "」沒有寫在 characters.js");
                };
                const stats = Object.assign({}, characters[foe] || {}, b.foeStats || {});
                if(!(b.rounds && b.rounds.length)){
                    ["maxHp", "atk", "def"].forEach(function(k){
                        if(typeof stats[k] !== "number"){
                            problems.push(tag + "場景 " + id + " 是自由戰鬥，但敵人沒有 " + k + "（暫時用預設值）");
                        };
                    });
                }else{
                    b.rounds.forEach(function(r, i){
                        if(!r.foeMove && !(characters[foe] && characters[foe].招式)){
                            problems.push(tag + "場景 " + id + " 第 " + (i + 1) + " 回合沒有 foeMove，敵人也沒有招式（暫時用通用招式）");
                        };
                        (r.before || []).concat(r.after || [], r.onWrong || []).forEach(function(line, k){
                            const who = whoName(line.who);
                            if(who && who !== "{name}" && !characters[who]){
                                problems.push(tag + "場景 " + id + " 第 " + (i + 1) + " 回合的說話者「" + who + "」沒有寫在 characters.js");
                            };
                        });
                    });
                };
            };
        });

        /*從 start 開始走一遍（只在本章內走），找走不到的場景*/
        const reached = {};
        const queue = scenes[ch.start] ? [ch.start] : [];
        Object.keys(scenes).forEach(function(id){
            if(externalEntries[ch.id + "/" + id]){ queue.push(id); };
        });
        while(queue.length){
            const id = queue.shift();
            if(reached[id] || !scenes[id]){ continue; };
            reached[id] = true;
            targetsOf(scenes[id]).forEach(function(t){
                const r = resolve(ch, t.target);
                if(r && r.kind === "scene" && r.chapter === ch){ queue.push(r.id); };
            });
        };
        Object.keys(scenes).forEach(function(id){
            if(!reached[id]){ problems.push(tag + "場景 " + id + " 從 start 走不到（沒有任何場景指向它）"); };
        });
    });

    /*被其他章節用 "章節:場景" 指到的場景，需要在所有章節都檢查過後才知道，所以孤兒檢查要用最終結果。
      （上面是邊檢查邊收集，所以後面章節指向前面章節的情況可能漏掉；這裡把誤報的過濾掉）*/
    /*結局的 friends 用到的旗標，章節裡有沒有任何地方 set 過（寫錯旗標名稱的話，那個人永遠不會出現）*/
    const setFlags = {};
    const grab = function(obj){ if(obj && obj.set){ Object.keys(obj.set).forEach(function(k){ setFlags[k] = true; }); }; };
    chapters.forEach(function(ch){
        Object.keys(ch.scenes || {}).forEach(function(id){
            const sc = ch.scenes[id];
            grab(sc);
            (sc.lines || []).forEach(grab);
            (sc.options || []).forEach(grab);
            if(sc.battle){
                (sc.battle.rounds || []).forEach(function(r){
                    (r.before || []).concat(r.after || [], r.onWrong || []).forEach(grab);
                });
            };
        });
    });
    Object.keys(endings).forEach(function(eid){
        const fr = endings[eid].friends;
        if(!fr || typeof fr !== "object"){ return; };
        Object.keys(fr).forEach(function(name){
            (Array.isArray(fr[name]) ? fr[name] : [fr[name]]).forEach(function(flag){
                if(!setFlags[flag]){ problems.push("[結局 " + eid + "] friends 的「" + name + "」用到旗標「" + flag + "」，但章節裡沒有任何地方 set 過它（這個人永遠不會出現）"); };
            });
        });
    });

    const finalProblems = problems.filter(function(p){
        const m = p.match(/^\[故事 (\S+)\] 場景 (\S+) 從 start 走不到/);
        return !(m && externalEntries[m[1] + "/" + m[2]]);
    });

    finalProblems.forEach(function(p){ console.warn(p); });
    return finalProblems;
};
