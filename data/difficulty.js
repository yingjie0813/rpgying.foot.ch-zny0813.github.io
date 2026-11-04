
/* ==================== 難度設定 ==================== */
/* bossMult:頭目「最大生命」與「攻擊」的倍率(防禦不變)。普通 = 1,是基準強度。
   endless:true 表示沒有第十大關的終點,一直打到倒下為止。
   無盡模式需要先通關一次(任何難度)才會開放。 */
export const difficultyConfig = {
    story: {
        label: "故事",
        desc: "依序推進的主線劇情，以文本與教學為主",
        bossMult: 1,
        story: true     /* 選了這張卡片再按「踏入江湖」，會進入故事模式（system/story-mode/） */
    },
    easy: {
        label: "簡單",
        desc: "頭目較弱，適合先熟悉江湖",
        bossMult: 0.7
    },
    normal: {
        label: "普通",
        desc: "標準強度，看準頭目的出拳習慣",
        bossMult: 1
    },
    hard: {
        label: "困難",
        desc: "頭目更強，考驗選擇與判斷",
        bossMult: 1.4
    },
    endless: {
        label: "無盡",
        desc: "困難強度，沒有終點",
        lockedDesc: "通關一次後開放",
        bossMult: 1.4,
        endless: true
    }
};
