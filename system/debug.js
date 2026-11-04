/* ==================== 彩蛋 ==================== */

import { playerData } from "../data/player.js";

/*彩蛋設定*/
export function egg(){
    if(playerData.name === "蛋中小煥"){
        playerData.maxHp = 896;
        playerData.hp = 896;
        playerData.atk = 223;
        playerData.def = 114;
        alert("劍王來了!")
    };
};
