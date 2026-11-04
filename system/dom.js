/* ==================== DOM 元素 ==================== */
/* 所有要重複使用的畫面元素都在這裡查詢一次，其他模組直接 import。
   index.html 用 <script type="module">，會等頁面解析完才執行，所以這裡一定查得到元素。 */

/*遊戲畫面*/
export const gameScreen = document.querySelector(".game-screen");
export const bossScreen = document.querySelector(".boss-screen");
export const startScreen = document.querySelector(".start-screen");
export const resultScreen = document.querySelector(".result-screen");

/*開始遊戲按鈕*/
export const startScreenButton = document.querySelector("#start-screen-button");

/*關卡面板*/
export const nextLevelButton = document.querySelector("#next-level-button");

/*王關面板*/
export const battleLogContent = bossScreen.querySelector("#battle-log-content");

/*下一步和猜拳按鈕*/
export const choiceButtons = document.querySelectorAll(".battle-choice-buttons .battle-choice-button:not(#battle-next-button)");
export const nextButton = document.querySelector("#battle-next-button");
export const panelHeading = document.querySelector(".battle-controls .panel-heading");

/*開始畫面：取名字、骰子、難度卡片*/
export const playerNameInput = document.querySelector("#player-name-input");
export const randomNameButton = document.querySelector("#random-name-button");
export const difficultyCards = document.querySelectorAll(".difficulty-card");

/*故事模式畫面*/
export const storyScreen = document.querySelector(".story-screen");
export const storyText = document.querySelector("#story-text");
export const storyContent = document.querySelector("#story-content");
export const storyOptions = document.querySelector("#story-options");
export const storyNextButton = document.querySelector("#story-next-button");
export const storyExitButton = document.querySelector("#story-exit-button");
export const storySpeakerCard = document.querySelector("#story-speaker");
export const storySaveButton = document.querySelector("#story-save-button");
export const storyLoadButton = document.querySelector("#story-load-button");
export const storySaveInfo = document.querySelector("#story-save-info");
export const storyBanner = document.querySelector("#story-banner");
export const storyPanelHeading = document.querySelector("#story-panel-heading");
export const storySpeakerName = document.querySelector("#story-speaker-name");
export const storySpeakerHeading = document.querySelector("#story-speaker-heading");
export const storySpeakerHpRow = document.querySelector("#story-speaker-hp-row");
export const storySpeakerHp = document.querySelector("#story-speaker-hp");
export const storySpeakerHpBar = document.querySelector("#story-speaker-hp-bar");
export const storySpeakerHpFill = document.querySelector("#story-speaker-hp-fill");
export const storySpeakerAtkDef = document.querySelector("#story-speaker-atk-def");
export const storySpeakerAtk = document.querySelector("#story-speaker-atk");
export const storySpeakerDef = document.querySelector("#story-speaker-def");
