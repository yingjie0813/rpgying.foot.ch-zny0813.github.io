/* ==========================================================================
   故事模式的結局資料
   --------------------------------------------------------------------------
   key 就是結局 id（英文、數字、中文都可以，不要重複）。
   在章節檔裡這樣指向結局：
     場景：      ending: "結局id"          這個場景的台詞播完後，直接進入該結局
     next/選項： next: "ending:結局id"     （前面要加 ending: ）
     onVisit：   onVisit: { 3: "ending:結局id" }   第 3 次進入這個場景時進入結局
     章節：      next: "ending:結局id"     這一章結束後進入結局
     戰鬥：      onWin / onLose: "ending:結局id"

   每個結局可用的欄位：
     title     結局名稱，必填。結局畫面會顯示「—— 結局：名稱 ——」
     kind      （選填）結局種類，只是顯示用的小字，例如 "好結局" "壞結局" "隱藏結局"
     bg        （選填）背景。可用：title road river temple inn arena1 market bamboo
               field bridge arena2 cliff stones falls summit arena3 end endDark
               不寫 = "end"
     lines     （選填）結局的台詞陣列，格式與場景的 lines 完全相同：
               { who: "旁白", text: "文字，可用 <br> 換行與 {name}" }
               who 要寫在 characters.js（"{name}" 是玩家自己）。
               每句還可以寫 set / effect（見章節檔開頭的說明）。
     之後想加欄位直接加，不會出錯。

   結局播完會顯示結局字樣並記錄「已達成」（存在瀏覽器 localStorage），回到開始畫面時，
   「故事」卡片會顯示「結局 已達成/總數」。總數 = 這個檔案裡結局的數量。
   ========================================================================== */

export const endings = {

    /* ↓ 範例結局：之後請改成自己的內容，或整段刪掉（刪掉後總數會跟著少一個） */
    "範例結局": {
        title: "（範例結局）",
        kind: "範例",
        bg: "end",
        lines: [
            { who: "旁白", text: "這是範例結局。請在 data/story-mode/endings.js 改成自己的內容。" }
        ]
    }

};
