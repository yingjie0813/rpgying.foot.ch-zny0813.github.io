/* ==================== 視覺層讀取遊戲狀態（只讀，從不寫入） ==================== */

import { playerData, gameProgress } from "../data/player.js";
import { state } from "../system/state.js";
import { clamp } from "./helpers.js";

/*目前大關（1～10 循環，無盡模式超過 10 時從頭輪迴）*/
export const major = () => { const n = Math.max(1, Number(gameProgress.majorLevel) || 1); return ((n - 1) % 10) + 1; };
/*目前小關（1～10）*/
export const small = () => clamp(Number(gameProgress.smallLevel) || 1, 1, 10);
/*玩家資料*/
export const hero  = () => playerData;
/*目前的頭目（尚未出現時為 null）*/
export const boss  = () => state.currentBoss;
/*故事模式目前說話的角色（沒有人說話時為 null）*/
export const speaker = () => state.storySpeaker;
/*是否已通關*/
export const cleared = () => !!state.gameCleared;
