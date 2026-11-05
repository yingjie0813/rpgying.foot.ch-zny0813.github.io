# 江湖野球（重構版）

遊戲內容、規則、數值、畫面都與重構前完全相同；只是把程式碼改成 ES 模組（`import` / `export`），依用途分資料夾。

## 怎麼開啟

ES 模組不能用「雙擊 index.html」(file://) 開啟，請用 VS Code 的 **Live Server**：
在 `重構版` 資料夾裡對 `index.html` 按右鍵 → *Open with Live Server*。
上傳到 GitHub Pages 也可以直接用（整個資料夾一起上傳）。

## 資料夾結構

```
重構版/
├─ index.html            頁面（只載入 main.js 一支腳本）
├─ main.js               進入點：只負責把各模組組裝起來
├─ css/                  樣式（與舊版相同）
├─ data/                 純資料，不含流程
│   ├─ player.js           玩家初始資料、玩家資料、關卡進度
│   ├─ difficulty.js       四種難度的設定
│   ├─ battle-flow.js      戰鬥五個階段的名稱
│   ├─ events.js           小關事件（eventData）
│   ├─ special-events.js   特殊事件（speEventData，含觸發條件 cond）
│   ├─ bosses.js           頭目資料（bossData）
│   ├─ portraits.js        人物頭像對照表（要加圖就改這支）
│   └─ story-mode/         故事模式的文本資料（開頭都有「所有可用屬性與值」的說明）
│       ├─ index.js          章節總表（預設章節順序）
│       ├─ ch01.js ch02.js …  章節（場景、台詞、選項、戰鬥）
│       ├─ characters.js     角色（頭像、數值、招式）
│       └─ endings.js        結局
├─ system/               遊戲規則與流程
│   ├─ state.js            會變動的遊戲狀態（原本散落的全域變數，集中成 state 物件）
│   ├─ dom.js              要用到的畫面元素
│   ├─ game.js             開始遊戲
│   ├─ status.js           玩家數值面板、{name} 替換
│   ├─ progress.js         關卡進度與大關/小關顯示
│   ├─ difficulty.js       難度卡片、無盡模式解鎖（localStorage）
│   ├─ result.js           結算畫面
│   ├─ portrait.js         依名字查頭像、套用頭像
│   ├─ debug.js            彩蛋（蛋中小煥）
│   ├─ controls.js         按鈕事件綁定
│   ├─ input.js            骰子取名、鍵盤快捷鍵
│   ├─ event/              小關事件：draw（抽選）、options（顯示與選項效果）、small-event（整合）
│   ├─ story-mode/         故事模式引擎：story（播放）、battle（教學／自由戰鬥）、ending（結局記錄）、
│   │                        save（存檔）、typewriter（逐字顯示）、speaker、condition、validate（寫文本時的檢查）
│   └─ battle/             王關：boss-spawn（強度與抽選）、rps（出拳與勝負）、damage（傷害）、
│                          flow（戰鬥流程）、outcome（勝利/死亡）、battle-ui（面板與按鈕）
└─ ui/                   純視覺層（只讀取狀態，不改遊戲資料；壞掉遊戲照樣能玩）
    ├─ theme.js            入口，負責串接
    ├─ background.js       水墨背景與花瓣
    ├─ emblems.js          印章頭像／人物頭像
    ├─ progress-nodes.js   進度點與上方橫幅
    ├─ chips.js            事件結果的數值徽章
    ├─ vs-panel.js         王關對戰面板
    ├─ difficulty-art.js   難度卡片小圖
    ├─ ink-art.js          水墨美術素材（山水、圖示、印章）
    ├─ game-view.js、helpers.js   視覺層用的讀取工具
    └─ scene-image.js      場景圖片函數（目前遊戲沒用到，保留備用）
```

## 常見修改要去哪裡

| 想改的東西 | 檔案 |
|---|---|
| 新增／修改小關事件 | `data/events.js`、`data/special-events.js` |
| 新增／修改頭目與招式 | `data/bosses.js` |
| 難度倍率 | `data/difficulty.js` |
| 玩家初始數值 | `data/player.js` |
| 加人物頭像 | `data/portraits.js` |
| 寫故事（章節、台詞、選項、戰鬥） | `data/story-mode/chXX.js`（開頭有完整說明） |
| 故事角色與敵人的數值、招式 | `data/story-mode/characters.js` |
| 結局 | `data/story-mode/endings.js` |
| 故事存檔／結局記錄的位置 | 瀏覽器 localStorage：`jianghu_yeqiu_story_save`、`jianghu_yeqiu_story_endings` |
| 傷害公式 | `system/battle/damage.js` 的 `calcDmg` |
| 頭目強度成長 | `system/battle/boss-spawn.js` 的 `bossPowerScale` |
| 彩蛋 | `system/debug.js` |

## 命名對照（snake_case → camelCase）

資料欄位（`招式`、`名稱`、`hpPct`、`maxHp`、`preference`…）、HTML 的 id／class、CSS、localStorage 的 key 都**沒有**改名。
只有 JavaScript 的變數與函式名稱改成駝峰：

- 全域變數 → `state.xxx`：`current_small`→`state.currentSmall`、`current_boss`→`state.currentBoss`、`battlePhase`、`playerChoice`、`battleResult`、`bossChoice`、`temp_log`→`state.tempLog`、`game_cleared`→`state.gameCleared`、`event_pool`→`state.eventPool`、`current_difficulty`→`state.currentDifficulty`、`boss_pool`→`state.bossPool`、`last_boss_index`→`state.lastBossIndex`、`defeated_bosses`→`state.defeatedBosses`、`defeat_by`→`state.defeatBy`、`endless_just_unlocked`→`state.endlessJustUnlocked`
- 資料：`initial_playerData`→`initialPlayerData`、`difficulty_config`→`difficultyConfig`、`battle_flow`→`battleFlow`、`spe_eventData`→`speEventData`
- 函式：`calc_dmg`→`calcDmg`、`apply_portrait`→`applyPortrait`、`update_status_panel`→`updateStatusPanel`、`update_level_status`→`updateLevelStatus`、`next_level`→`nextLevel`、`random_small`→`randomSmall`、`show_small_options`→`showSmallOptions`、`start_small_event`→`startSmallEvent`、`random_boss`→`randomBoss`、`update_boss_status`→`updateBossStatus`、`random_boss_choice`→`randomBossChoice`、`judge_rps`→`judgeRps`、`calculate_damage`→`calculateDamage`、`start_boss_event`→`startBossEvent`、`det_phase`→`detPhase`、`push_phase`→`pushPhase`、`start_game`→`startGame`、`sw_battle_button`→`swBattleButton`、`scroll_battle_log`→`scrollBattleLog`、`endless_unlocked`→`endlessUnlocked`、`unlock_endless`→`unlockEndless`、`refresh_difficulty_cards`→`refreshDifficultyCards`、`show_result`→`showResult`
- 函式內部的中文區域變數（`拳種列表`、`權重列表`、`權重總和`、`招式列表`、`臨時勝負`）改成英文：`moveTypes`、`weights`、`totalWeight`、`moveNames`、`resultOrder`／`resultIndex`
- 常數維持全大寫：`ENDLESS_KEY`、`PORTRAITS`、`LEVEL_NUM`
