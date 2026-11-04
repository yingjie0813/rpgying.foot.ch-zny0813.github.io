/* ==================== 傷害計算 ==================== */

import { playerData } from "../../data/player.js";
import { state } from "../state.js";
import { bossScreen } from "../dom.js";
import { updateStatusPanel } from "../status.js";
import { updateBossStatus } from "./battle-ui.js";

/*傷害公式：攻擊越高越痛，防禦遞減式減傷，至少 1*/
export function calcDmg(atk, def){
    return Math.max(1, Math.round(atk * 100 / (100 + def*0.5)- (def*0.5)));
};

/*攻擊防禦計算，贏單打／輸被打／平手互打（雙方各自受傷）*/
export function calculateDamage(){

    let battleLog = "";
    const boss = state.currentBoss;

    // 玩家勝利：玩家攻擊 Boss
    if(state.battleResult === "win"){
        let damage = calcDmg(playerData.atk, boss.def);
        boss.hp -= damage;

        battleLog = `${playerData.name}對 ${boss.name} 造成了 ${damage} 點傷害！`;
    }

    // 平手：比較雙方攻擊對彼此造成的傷害
    else if(state.battleResult === "draw"){
        let playerDamage = calcDmg(playerData.atk, boss.def);
        let bossDamage = calcDmg(boss.atk, playerData.def);

        boss.hp -= playerDamage;
        playerData.hp -= bossDamage;
        battleLog = `雙方平手，${playerData.name}對 ${boss.name} 造成了 ${playerDamage} 點傷害！<br>${boss.name} 對${playerData.name}造成了 ${bossDamage} 點傷害！`;
    }

    // 玩家落敗：Boss 攻擊玩家
    else if(state.battleResult === "lose"){
        let damage = calcDmg(boss.atk, playerData.def);
        playerData.hp -= damage;

        battleLog = `${boss.name} 對${playerData.name}造成了 ${damage} 點傷害！`;
    }

    // 避免玩家血量低於 0
    playerData.hp = Math.max(0, playerData.hp);

    // 更新畫面
    updateBossStatus(bossScreen);
    updateStatusPanel(bossScreen);

    return battleLog;
};
