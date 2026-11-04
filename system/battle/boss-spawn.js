/* ==================== 頭目：強度成長與抽選 ==================== */

import { bossData } from "../../data/bosses.js";
import { difficultyConfig } from "../../data/difficulty.js";
import { gameProgress } from "../../data/player.js";
import { state } from "../state.js";

/* Boss 強度倍率計算
   生命：每大關 +120% 基礎值；攻擊：隨大關加速成長；防禦：每大關 +60%。
   生命與攻擊再乘上難度倍率（difficultyConfig 的 bossMult）。 */
function bossPowerScale(boss, majorLevel){

    // 大關數至少為 1
    const level = Math.max(1, majorLevel);
    const n = level - 1;

    // 計算成長倍率
    const hpMultiplier = 1 + n * 1.2;
    const atkMultiplier = 1 + n * 0.5 + n * n * 0.1;
    const defMultiplier = 1 + n * 0.6;

    // 難度倍率
    const diff = difficultyConfig[state.currentDifficulty] || difficultyConfig.normal;

    // 複製並回傳強化後的 Boss
    return {
        ...boss,
        maxHp: Math.round(boss.maxHp * hpMultiplier * diff.bossMult),
        atk: Math.round(boss.atk * atkMultiplier * diff.bossMult),
        def: Math.round(boss.def * defMultiplier)
    };
};


/* 抽選頭目：用牌堆輪流出場，打過的不會再出現，全部出過一輪才重新洗牌，
   且新一輪的第一位不會和上一位相同 */
export function randomBoss(){
    if(state.bossPool.length === 0){
        state.bossPool = bossData.map(function(_, i){ return i; });
        for(let i = state.bossPool.length - 1; i > 0; i--){
            const k = Math.floor(Math.random() * (i + 1));
            [state.bossPool[i], state.bossPool[k]] = [state.bossPool[k], state.bossPool[i]];
        };
        if(state.bossPool.length > 1 && state.bossPool[state.bossPool.length - 1] === state.lastBossIndex){
            [state.bossPool[0], state.bossPool[state.bossPool.length - 1]] = [state.bossPool[state.bossPool.length - 1], state.bossPool[0]];
        };
    };
    const tempIndex = state.bossPool.pop();
    state.lastBossIndex = tempIndex;

    // 取得抽中的 Boss 原始資料
    const selectedBoss = bossData[tempIndex];

    // 根據目前大關計算 Boss 強度
    const scaledBoss = bossPowerScale(
        selectedBoss,
        gameProgress.majorLevel
    );

    // 回傳強化後的 Boss，並將 HP 設為最大值
    return {
        ...scaledBoss,
        hp: scaledBoss.maxHp
    };
};
