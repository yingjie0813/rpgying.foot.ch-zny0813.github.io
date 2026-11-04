/* ==================== 小關事件：整合 ==================== */

import { randomSmall } from "./draw.js";
import { showCurrentSmall, showSmallOptions } from "./options.js";

/*開始小關/整合關卡函數*/
export function startSmallEvent(){
    randomSmall();
    showCurrentSmall();
    showSmallOptions();
};
