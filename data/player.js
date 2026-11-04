/* ==================== 玩家與關卡進度資料 ==================== */
/* 這裡的物件會在遊戲中被直接修改（例如 playerData.hp），
   所有模組 import 到的都是同一個物件，所以改動會互相看得到。 */

/* ==================== 玩家初始資料 ==================== */

export const initialPlayerData = {
    name: "無名氏",
    maxHp: 100,
    hp: 100,
    atk: 10,
    def: 10,
    img: ""     /* 俠客頭像網址;留空就顯示印章頭像 */
};
export const playerData = {
    name: "無名氏",
    maxHp: 100,
    hp: 100,
    atk: 10,
    def: 10,
    img: ""
};

/* ==================== 關卡進度資料 ==================== */
/*當前關卡*/
export const gameProgress = {
    majorLevel: 1,
    smallLevel: 1
};
