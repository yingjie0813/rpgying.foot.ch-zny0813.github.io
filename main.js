/* ==========================================================================
   main.js —— 程式進入點
   只負責「組裝」：把各模組接起來並啟動，遊戲的規則都在 system/ 與 data/。

   資料夾說明：
     data/    純資料（事件、特殊事件、頭目、難度、戰鬥流程、玩家、人物頭像對照表）
     system/  遊戲規則與流程（狀態、事件、戰鬥、難度、結算、按鈕與鍵盤、故事模式）
     ui/      純視覺層（水墨背景、頭像、對戰面板…），只讀取狀態，不改遊戲資料
   ========================================================================== */

import { bindControls } from "./system/controls.js";
import { bindInput } from "./system/input.js";
import { initDifficultyCards } from "./system/difficulty.js";
import { bindStory } from "./system/story-mode/story.js";
import { initTheme } from "./ui/theme.js";

bindControls();         /*按鈕事件*/
bindInput();            /*骰子取名與鍵盤快捷鍵*/
bindStory();            /*故事模式的按鈕*/
initDifficultyCards();  /*難度卡片*/
initTheme();            /*視覺層（最後啟動；壞掉也不影響遊戲進行）*/
