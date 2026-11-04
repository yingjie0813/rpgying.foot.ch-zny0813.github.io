/* ==================== 條件判斷與選項效果 ==================== */
/* 選項（或場景）可以帶這些欄位，全部選填：
     require: { flag: "旗標名", notFlag: "旗標名", atkAtLeast: 20, defAtLeast: 20, hpAtLeast: 50, maxHpAtLeast: 150 }
              不符合條件的選項不會出現。flag / notFlag 也可以寫成陣列（全部符合才算）。
     set:     { 旗標名: true }       選了之後記下劇情旗標
     effect:  { maxHp: 10, hpPct: 20, atk: 1, def: 1 }   選了之後改玩家數值（格式與一般事件的 effect 相同） */

import { playerData } from "../../data/player.js";
import { state } from "../state.js";
import { storyScreen } from "../dom.js";
import { updateStatusPanel } from "../status.js";
import { applyOptionEffect } from "../event/options.js";

function asList(v){
    return Array.isArray(v) ? v : [v];
}

export function checkRequire(req){
    if(!req){ return true; };
    const flags = state.story.flags;
    if(req.flag !== undefined && !asList(req.flag).every(function(f){ return !!flags[f]; })){ return false; };
    if(req.notFlag !== undefined && asList(req.notFlag).some(function(f){ return !!flags[f]; })){ return false; };
    if(req.atkAtLeast !== undefined && playerData.atk < req.atkAtLeast){ return false; };
    if(req.defAtLeast !== undefined && playerData.def < req.defAtLeast){ return false; };
    if(req.hpAtLeast !== undefined && playerData.hp < req.hpAtLeast){ return false; };
    if(req.maxHpAtLeast !== undefined && playerData.maxHp < req.maxHpAtLeast){ return false; };
    return true;
};

/*套用 set（旗標）與 effect（數值）。target 可以是選項或場景*/
export function applyConsequences(target){
    if(target.set){
        Object.assign(state.story.flags, target.set);
    };
    if(target.effect){
        applyOptionEffect({ effect: target.effect }, Object.keys(target.effect));
        updateStatusPanel(storyScreen);
    };
};
