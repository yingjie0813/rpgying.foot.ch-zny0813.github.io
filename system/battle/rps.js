/* ==================== 猜拳：頭目出拳抽選與勝負判斷 ==================== */

import { state } from "../state.js";

/* 根據 Boss 出拳偏好抽選拳種 */
export function randomBossChoice(){

    // 取得 Boss 能使用的拳種
    const moveTypes = Object.keys(state.currentBoss.招式);

    // 計算每種拳的權重
    const weights = moveTypes.map(function(moveType){
        return Math.max(0, Number(state.currentBoss.preference[moveType]) || 0);
    });

    // 計算所有權重的總和
    const totalWeight = weights.reduce(function(total, weight){
        return total + weight;
    }, 0);

    // 如果所有權重都是 0，就退回平均隨機
    if(totalWeight === 0){
        return moveTypes[
            Math.floor(Math.random() * moveTypes.length)
        ];
    };

    // 產生一個介於 0 到權重總和之間的隨機數
    let randomNum = Math.random() * totalWeight;

    // 依照權重依序判斷抽中了哪一拳
    for(let i = 0; i < moveTypes.length; i++){

        randomNum -= weights[i];

        if(randomNum < 0){
            return moveTypes[i];
        };
    };

    // 理論上不會執行到這裡，作為保險
    return moveTypes[moveTypes.length - 1];
};


/*猜拳勝負判斷*/
export function judgeRps(player, boss){
    if(player === boss){
        return "draw";
    };

    if(
        (player === "rock" && boss === "scissors") ||
        (player === "scissors" && boss === "paper") ||
        (player === "paper" && boss === "rock")
    ){
        return "win";
    };

    return "lose";
};
