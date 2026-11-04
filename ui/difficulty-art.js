/* ==================== 難度卡片的水墨小圖 ==================== */

import { inkMini } from "./ink-art.js";
import { $, $$ } from "./helpers.js";

const DIFF_ART = {
    story:   [['#c8d4e6', '#6d82a8'], 'pagoda', 2],
    easy:    [['#cfe3c8', '#7fa88a'], 'tree',   3],
    normal:  [['#d9c7a0', '#a58a63'], 'pagoda', 5],
    hard:    [['#e3a98a', '#a2503c'], 'rocks',  7],
    endless: [['#4a3a6a', '#1c1530'], 'boat',   9]
};

/*只需在啟動時畫一次*/
export function drawDifficultyArt(){
    $$('.difficulty-card').forEach(card => {
        const a = DIFF_ART[card.dataset.diff], slot = $('.difficulty-art', card);
        if(a && slot){ slot.innerHTML = inkMini(a[2], a[0], a[1]); }
    });
}
