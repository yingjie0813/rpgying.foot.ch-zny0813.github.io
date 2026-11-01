/* ==================== DOM 元素與全域變數宣告 ==================== */

/*遊戲畫面*/
const game_screen = document.querySelector(".game-screen");
const boss_screen = document.querySelector(".boss-screen");
const start_screen = document.querySelector(".start-screen");

/*開始遊戲按鈕*/
const start_screen_button = document.querySelector("#start-screen-button");

/*關卡面板*/
let current_small = null;/*隨機小關通用變數*/
const next_level_button = document.querySelector("#next-level-button");

/*王關面板*/
let current_boss = null;
/*第幾回合*/
let round = "";
/*記錄戰鬥是否已經結束*/
let battleEnding = null;
/*目前戰鬥進度*/
let battlePhase = battle_flow[0];
/*記錄玩家與Boss本回合的出拳和招式*/
let playerChoice = null;
let battleResult = null;
let bossChoice = ["", ""];
const battle_log_content = boss_screen.querySelector("#battle-log-content");
let temp_log = "";
/*是否已通關全部大關*/
let game_cleared = false;
/*小關事件牌堆（不重複抽取）*/
let event_pool = [];

/*把文字中的 {name} 換成玩家名字*/
function fmt(text){
    return String(text).replaceAll("{name}", playerData.name);
};

/*傷害公式：攻擊越高越痛，防禦遞減式減傷，至少 1*/
function calc_dmg(atk, def){
    return Math.max(1, Math.round(atk * 100 / (100 + def * 5)));
};

/*下一步和猜拳按鈕*/
const choice_buttons = document.querySelectorAll(".battle-choice-buttons .battle-choice-button:not(#battle-next-button)");
const next_button = document.querySelector("#battle-next-button");
const panel_heading = document.querySelector(".battle-controls .panel-heading");


/* ==================== 玩家面板 ==================== */

/*初始化玩家數值*/
function initial_status_data(){
    const keys = Object.keys(initial_playerData);
    keys.forEach(function(key){
        playerData[key] = initial_playerData[key];
    });
};

/*更新玩家函數*/
function update_status_panel(screen){
    /*檢查有無數據溢出*/
    if(playerData.hp > playerData.maxHp){
        playerData.hp = playerData.maxHp;
    };
    if(playerData.hp <= 0){
        playerData.hp = 0;      /*等待增加死亡場景*/
    };
    if(playerData.atk <= 0){
        playerData.atk = 1;
    };
    if(playerData.def <= 0){
        playerData.def = 1;
    };
    /*更新數據*/
    screen.querySelector(".status-panel-name").textContent = playerData.name;
    let temp_text = playerData.hp + " / " + playerData.maxHp;
    const hp_per = playerData.hp / playerData.maxHp * 100;
    screen.querySelector(".hp-fill").style.width = hp_per + "%";    
    screen.querySelector(".hpText").textContent = temp_text;
    screen.querySelector(".atk").textContent = playerData.atk;
    screen.querySelector(".def").textContent = playerData.def;

};


/* ==================== 關卡以及小關面板 ==================== */

/*初始化關卡進度*/
function initial_gameProgress(){
    const keys = Object.keys(gameProgress);
    keys.forEach(function(key){
        gameProgress[key] = 1;
    });
};

/*更新函數*/
function update_level_status(screen){
    /*更新大關*/
    const level_num = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    const status_panel_level = screen.querySelector(".status-panel-level");

    status_panel_level.textContent = "第" + level_num[gameProgress.majorLevel-1] + "大關";
    /*更新小關*/
    screen.querySelector(".current-level").textContent = gameProgress.smallLevel;
};

/*推進關卡*/
function next_level(){
    gameProgress.smallLevel += 1;
    update_level_status(game_screen);
};

/*小關隨機事件決定函數*/
function random_small(){
    if(event_pool.length === 0){
        event_pool = eventData.map(function(_, i){ return i; });
        for(let i = event_pool.length - 1; i > 0; i--){
            const k = Math.floor(Math.random() * (i + 1));
            [event_pool[i], event_pool[k]] = [event_pool[k], event_pool[i]];
        };
    };
    current_small = eventData[event_pool.pop()];
};

/*顯示小關描述*/
function show_current_small(){
    const event_title = document.querySelector("#event-title");
    const event_description = document.querySelector("#event-description");

    event_title.innerHTML = current_small.title;
    event_description.innerHTML = current_small.description;
};

/*顯示小關事件選項*/
function show_small_options(){
    const temp_option_button =document.querySelector("#temp-option-button");
    const event_description = document.querySelector("#event-description");
    next_level_button.hidden = true;
    temp_option_button.innerHTML = "";

    current_small.options.forEach(function(option){
        temp_option_button.hidden = false;
        const new_button = document.createElement("button");
        new_button.textContent = option.text;
        temp_option_button.appendChild(new_button);
        new_button.classList.add("choice-button");
        new_button.addEventListener("click", function(){
            const keys = Object.keys(option.effect);
            for(let i=0; i<keys.length; i++){
                playerData[keys[i]] += option.effect[keys[i]];
            }; 
            update_status_panel(game_screen);
            temp_option_button.innerHTML = "";
            const stat_names = { maxHp: "最大生命", hp: "生命", atk: "攻擊", def: "防禦" };
            let temp_text ="";
            temp_text += `${option.result}<br><br>`;
            for(let i=0; i<keys.length; i++){
                const v = option.effect[keys[i]];
                if(v === 0){ continue; };
                temp_text += `| ${stat_names[keys[i]] || keys[i]} ${v > 0 ? "+" : ""}${v} |`;
            };
            if(playerData.hp <= 0){
                temp_text += `<br><br>你再也撐不住，倒在了江湖路上……`;
                next_level_button.textContent = "江湖路盡";
            };
            event_description.innerHTML = temp_text;
            next_level_button.hidden = false;
            temp_option_button.hidden = true;
        });
    });
};

/*開始小關/整合關卡函數*/
function start_small_event(){
    random_small();
    show_current_small();
    show_small_options();
};


/* ==================== Boss 資料與面板 ==================== */


/* Boss 強度倍率計算 */
function boss_power_scale(boss, majorLevel){

    // 大關數至少為 1
    const level = Math.max(1, majorLevel);

    // 計算成長倍率
    const hpMultiplier = 1 + (level - 1) * 0.5;
    const atkMultiplier = 1 + (level - 1) * 0.2;
    const defMultiplier = 1 + (level - 1) * 0.2;

    // 複製並回傳強化後的 Boss
    return {
        ...boss,
        maxHp: Math.round(boss.maxHp * hpMultiplier),
        atk: Math.round(boss.atk * atkMultiplier),
        def: Math.round(boss.def * defMultiplier)
    };
};



function random_boss(){
    const temp_randnum = Math.floor(Math.random() * bossData.length);

    // 取得抽中的 Boss 原始資料
    const selectedBoss = bossData[temp_randnum];

    // 根據目前大關計算 Boss 強度
    const scaledBoss = boss_power_scale(
        selectedBoss,
        gameProgress.majorLevel
    );

    // 回傳強化後的 Boss，並將 HP 設為最大值
    return {
        ...scaledBoss,
        hp: scaledBoss.maxHp
    };
};


/*跟新boss數據*/
function update_boss_status(screen){
    /*檢查有無數據溢出*/
    if(current_boss.hp > current_boss.maxHp){
        current_boss.hp = current_boss.maxHp;
    };
    if(current_boss.hp <= 0){
        current_boss.hp = 0;      /*後續製作獲勝函數*/
    };
    /*更新數據*/
    screen.querySelector("#boss-name").textContent = current_boss.name;
    let temp_text = current_boss.hp + " / " + current_boss.maxHp;
    const hp_per = current_boss.hp / current_boss.maxHp * 100;
    screen.querySelector("#boss-hp-fill").style.width = hp_per + "%";    
    screen.querySelector("#boss-hpText").textContent = temp_text;
    screen.querySelector("#boss-atk").textContent = current_boss.atk;
    screen.querySelector("#boss-def").textContent = current_boss.def;

};


/* ==================== 戰鬥計算與判斷 ==================== */

/* 根據 Boss 出拳偏好抽選拳種 */
function random_boss_choice(){

    // 取得 Boss 能使用的拳種
    const 拳種列表 = Object.keys(current_boss.招式);

    // 計算每種拳的權重
    const 權重列表 = 拳種列表.map(function(拳種){
        return Math.max(0, Number(current_boss.preference[拳種]) || 0);
    });

    // 計算所有權重的總和
    const 權重總和 = 權重列表.reduce(function(total, weight){
        return total + weight;
    }, 0);

    // 如果所有權重都是 0，就退回平均隨機
    if(權重總和 === 0){
        return 拳種列表[
            Math.floor(Math.random() * 拳種列表.length)
        ];
    };

    // 產生一個介於 0 到權重總和之間的隨機數
    let randomNum = Math.random() * 權重總和;

    // 依照權重依序判斷抽中了哪一拳
    for(let i = 0; i < 拳種列表.length; i++){

        randomNum -= 權重列表[i];

        if(randomNum < 0){
            return 拳種列表[i];
        };
    };

    // 理論上不會執行到這裡，作為保險
    return 拳種列表[拳種列表.length - 1];
};


/*猜拳勝負判斷*/
function judge_rps(player, boss){
    if(player === boss){
        return "draw";
    };

    if(
        (player === "rock" && boss === "scissors") ||
        (player === "scissors" && boss === "paper") ||
        (player === "paper" && boss === "rock")
    ){
        return "win";
    };

    return "lose";
};

/*攻擊防禦計算，贏單打/輸被打/平手互打*/
/*攻擊防禦計算，贏單打／輸被打／平手比較傷害*/
function calculate_damage(){

    let battle_log = "";

    // 玩家勝利：玩家攻擊 Boss
    if(battleResult === "win"){
        let damage = calc_dmg(playerData.atk, current_boss.def);
        current_boss.hp -= damage;

        battle_log = `${playerData.name}對 ${current_boss.name} 造成了 ${damage} 點傷害！`;
    }

    // 平手：比較雙方攻擊對彼此造成的傷害
    else if(battleResult === "draw"){
        let playerDamage = calc_dmg(playerData.atk, current_boss.def);
        let bossDamage = calc_dmg(current_boss.atk, playerData.def);

        if(playerDamage > bossDamage){
            current_boss.hp -= playerDamage;

            battle_log = `雙方平手，但${playerData.name}攻勢較強！${playerData.name}對 ${current_boss.name} 造成了 ${playerDamage} 點傷害！`;

        }else if(playerDamage < bossDamage){
            playerData.hp -= bossDamage;

            battle_log = `雙方平手，但 ${current_boss.name} 攻勢較強！${current_boss.name} 對${playerData.name}造成了 ${bossDamage} 點傷害！`;

        }else{
            battle_log = `雙方平手，攻防勢均力敵，沒有任何一方受到傷害！`;
        }
    }

    // 玩家落敗：Boss 攻擊玩家
    else if(battleResult === "lose"){
        let damage = calc_dmg(current_boss.atk, playerData.def);
        playerData.hp -= damage;

        battle_log = `${current_boss.name} 對${playerData.name}造成了 ${damage} 點傷害！`;
    }

    // 避免玩家血量低於 0
    playerData.hp = Math.max(0, playerData.hp);

    // 更新畫面
    update_boss_status(boss_screen);
    update_status_panel(boss_screen);

    return battle_log;
};


/* ==================== 戰鬥流程 ==================== */

/*玩家勝利：進入下一大關*/
function victory(){

    /*通關最後一大關：進入結局*/
    if(gameProgress.majorLevel >= 10){
        game_cleared = true;
        battleEnding = null;
        battlePhase = battle_flow[0];
        temp_log = "";
        boss_screen.hidden = true;
        game_screen.hidden = false;
        update_status_panel(game_screen);
        document.querySelector("#event-title").innerHTML = "江湖傳說";
        document.querySelector("#event-description").innerHTML =
            `十大關，十位強敵，盡數倒在你的拳下。<br>${playerData.name}的名字，從此在江湖中流傳。<br><br>—— 全劇終 ——`;
        document.querySelector("#temp-option-button").hidden = true;
        next_level_button.textContent = "回到江湖入口";
        next_level_button.hidden = false;
        return;
    };

    /*推進大關，回到第一小關*/
    gameProgress.majorLevel += 1;
    gameProgress.smallLevel = 1;

    /*清除戰鬥結束狀態*/
    battleEnding = null;
    battlePhase = battle_flow[0];
    temp_log = "";

    /*切換畫面*/
    boss_screen.hidden = true;
    game_screen.hidden = false;

    /*更新玩家與關卡面板*/
    update_status_panel(game_screen);
    update_level_status(game_screen);

    /*準備下一大關的小關事件*/
    start_small_event();
};


/*玩家死亡：回到開始畫面*/
function defeat(){

    /*清除戰鬥資料*/
    battleEnding = null;
    battlePhase = battle_flow[0];
    temp_log = "";

    /*切換畫面*/
    boss_screen.hidden = true;
    game_screen.hidden = true;
    start_screen.hidden = false;
};

/*點擊檢測到第十關使用*/
function start_boss_event(){
    /*重設戰鬥資料*/
    battlePhase = battle_flow[0];
    playerChoice = null;
    battleResult = null;
    bossChoice = ["", ""];
    battleEnding = null;
    temp_log = "";
    round = 1;
    battle_log_content.innerHTML = "";
    /*切換畫面*/
    game_screen.hidden = true;
    boss_screen.hidden = false;
    /*選擇boss*/
    current_boss = random_boss();
    /*更新畫面數據*/
    update_boss_status(boss_screen);
    update_status_panel(boss_screen);
    update_level_status(boss_screen);
    sw_battle_button(true)
    temp_log += `------------------------------ 第${round}回合------------------------------<br>`;
    battle_log_content.innerHTML = temp_log;
    scroll_battle_log()

    det_phase(); /*進入自我介紹*/
};

/*戰鬥進度檢測*/
function det_phase(){
    let 臨時勝負 = ["win", "draw", "lose"];
    switch(battlePhase){
        case battle_flow[0]:/*boss介紹/bossData.description*/
            sw_battle_button(true);

            temp_log += `${fmt(current_boss.description)}<br>`;
            battle_log_content.innerHTML = temp_log;
            break;
        case battle_flow[1]:/*boss顯示運氣(預兆)/玩家選擇猜拳按鈕*/

            /* 第一次抽選：根據 Boss 偏好決定出拳 */
            bossChoice[0] = random_boss_choice();

            /* 第二次抽選：從該拳種的招式中隨機選一招 */
            const 招式列表 = Object.keys(current_boss.招式[bossChoice[0]]);
            bossChoice[1] = 招式列表[
                Math.floor(Math.random() * 招式列表.length)
            ];

            temp_log += `${fmt(current_boss.招式[bossChoice[0]][bossChoice[1]].運氣)}<br>`;
            battle_log_content.innerHTML = temp_log;
            scroll_battle_log()

            sw_battle_button(false);
            break;
        case battle_flow[2]:/*實際判定猜拳結果/顯示招式.攻擊*/
            temp_log += `${fmt(current_boss.招式[bossChoice[0]][bossChoice[1]].攻擊)}<br>`;
            battle_log_content.innerHTML = temp_log;
            sw_battle_button(true);
            scroll_battle_log()
            break;
        case battle_flow[3]:
            /*顯示後果/血量變化*/
            battleResult = judge_rps(playerChoice, bossChoice[0]);
            臨時勝負 = 臨時勝負.indexOf(battleResult);
            temp_log += `${fmt(current_boss.招式[bossChoice[0]][bossChoice[1]].後果[臨時勝負])}<br>`;
            temp_log += `${calculate_damage()}<br><br>`;
            battle_log_content.innerHTML = temp_log;
            sw_battle_button(true);
            scroll_battle_log()
            break;
        case battle_flow[4]:
            /*判定玩家死亡與否/boss死亡與否/決定勝利失敗或未勝負/推進關卡*/

            /*先檢查玩家是否死亡*/
            if(playerData.hp <= 0){
                battleEnding = "lose";

                temp_log += `${fmt(current_boss.defeatDescription)}<br>`;
                temp_log += `你已經失去戰鬥能力，這場戰鬥結束了。<br>`;

            }

            /*再檢查Boss是否死亡*/
            else if(current_boss.hp <= 0){
                battleEnding = "win";

                temp_log += `${fmt(current_boss.victoryDescription)}<br>`;
                temp_log += `你成功擊敗了 ${current_boss.name}！<br>`;

            }

            /*雙方都還活著*/
            else{
                battleEnding = null;

                temp_log += `雙方仍有一戰之力，準備迎接下一回合！<br>`;
            };

            battle_log_content.innerHTML = temp_log;
            sw_battle_button(true);
            scroll_battle_log()
            round += 1;
            break;
    };
};

/*戰鬥推進規則函數*/
function push_phase(){
    let index_battlePhase = battle_flow.indexOf(battlePhase);
    if(battlePhase === battle_flow[4]){
        temp_log = `------------------------------ 第${round}回合------------------------------<br>`;
        battle_log_content.innerHTML = temp_log;
        scroll_battle_log()
    }else{
        temp_log += `------------------------------------------------------------<br>`;
        battle_log_content.innerHTML = temp_log;
    }
    if(index_battlePhase < battle_flow.length - 1){
        index_battlePhase += 1;
    }else if(index_battlePhase === battle_flow.length - 1){
        index_battlePhase = 1;
    }
    battlePhase = battle_flow[index_battlePhase];
    scroll_battle_log()

    /*重新回到戰鬥判定*/
    det_phase();
};


/* ==================== 畫面與按鈕控制 ==================== */

/*開始遊戲*/
function start_game() {
    /*初始化關卡和玩家數據*/
    initial_gameProgress()
    initial_status_data();

    /*宣告開始和遊戲畫面*/
    const player_name=document.querySelector("#player-name-input").value.trim();

    playerData.name = player_name || initial_playerData.name;

    /*重置事件面板與狀態（重新開始時避免殘留上一局內容）*/
    game_cleared = false;
    event_pool = [];
    battleEnding = null;
    battlePhase = battle_flow[0];
    temp_log = "";
    document.querySelector("#event-title").textContent = "旅途開始";
    document.querySelector("#event-description").textContent = "你背起行囊，踏入了這片風起雲湧的江湖。";
    document.querySelector("#temp-option-button").innerHTML = "";
    document.querySelector("#temp-option-button").hidden = true;
    next_level_button.textContent = "繼續前行";
    next_level_button.hidden = false;

    update_status_panel(game_screen);
    update_level_status(game_screen);
    start_screen.hidden = true;
    game_screen.hidden = false;

};

/*下一步和猜拳按鈕切換*/
function sw_battle_button(tf){
    if(tf){     /*要，切換為繼續按鈕*/
        choice_buttons.forEach(function(button){
            button.hidden = true;   /*隱藏*/
        });
        next_button.hidden = false;
        panel_heading.textContent = "繼續";
    }else{      /*否，切換為猜拳按鈕*/
        choice_buttons.forEach(function(button){
            button.hidden = false;
        });
        next_button.hidden = true;
        panel_heading.textContent = "選擇招式";
    };
};

/*戰鬥紀錄自動捲動*/
function scroll_battle_log(){
    battle_log_content.scrollTo({
        top: battle_log_content.scrollHeight,
        behavior: "smooth"
    });
};


/* ==================== 事件監聽器 ==================== */

/*啟動按鈕*/
start_screen_button.addEventListener("click", start_game);
document.querySelector("#player-name-input").addEventListener("keydown", function(e){
    if(e.key === "Enter"){ start_game(); };
});

/*點擊繼續前進按鈕函數與執行*/
next_level_button.addEventListener("click", function(){
    /*通關後回到開始畫面*/
    if(game_cleared){
        game_cleared = false;
        game_screen.hidden = true;
        start_screen.hidden = false;
        return;
    };
    /*小關中死亡*/
    if(playerData.hp <= 0){
        defeat();
        return;
    };
    next_level();
    if  (gameProgress.smallLevel === 10){
        start_boss_event();
    }else{
        start_small_event();
    };
});

/*設定按鈕點擊*/
next_button.addEventListener("click", function(){
    if(battleEnding === "win"){
        victory();

    }else if(battleEnding === "lose"){
        defeat();

    }else{
        push_phase();
    };
});

choice_buttons.forEach(function(button){
    button.addEventListener("click", function(){
        playerChoice = button.id;
        push_phase();
    }); 
});

/*紀錄已經打過的王*/