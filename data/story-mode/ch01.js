/* ==========================================================================
   故事章節資料：所有可用的屬性與值（每個章節檔的開頭都有同一份說明，方便查）
   --------------------------------------------------------------------------
   一個章節檔 = export const chXX = { ...章節欄位 }，在 index.js 的 chapters 陣列登記後才會被讀到。

   ■ 章節欄位
     id        章節代號，必填、不可重複，例如 "ch01"。跳轉章節時就是寫這個。
     title     章節名，必填。顯示在畫面正上方中間（只顯示章節名，不含「第幾章」）。
     start     第一個場景的 id，必填。
     scenes    場景集合，必填。key 是場景 id，內容見下方「場景欄位」。
     bg        （選填）整章背景，可被場景的 bg 蓋過。
               可用值：title road river temple inn arena1 market bamboo field
                       bridge arena2 cliff stones falls summit arena3 end endDark
               不寫 = "road"
     speed     （選填）整章的打字速度（每個字幾毫秒）。預設 40。0 = 立刻顯示。可被場景、台詞的 speed 蓋過。
     label     （選填）章節結束畫面上的「第X章」字樣，例如 "第五章"。不寫 = 依這章在 index.js 陣列的順序。
     next      （選填）這一章結束後去哪裡。不寫 = 接 index.js 陣列裡的下一章，最後一章結束就回開始畫面。
               值：另一章的 id（"ch05"）、"章節:場景"（"ch05:s3"）、"ending:結局id"，或 "end"（直接回開始畫面）。

   ■ 場景欄位（scenes 裡的每一個場景）
     lines     台詞陣列，依序播放。每句見下方「台詞欄位」。可以省略（例如只有選項的場景）。
     options   選項陣列。台詞全部播完後才出現；見下方「選項欄位」。有 options 時不會用 next。
     next      沒有選項時，播完去哪裡（見下方「前往哪裡」）。
     ending    播完後進入某個結局，值是結局 id（結局寫在 endings.js）。例如 ending: "睡著了"
     onVisit   第 N 次進入這個場景時改去別處。例如 onVisit: { 3: "ending:睡著了" }
               N 從 1 算起；進入次數存檔會一起記住。值的寫法同「前往哪裡」。
     bg        （選填）這個場景的背景，優先於章節的 bg。可用值同章節的 bg。
     speed     （選填）這個場景的打字速度。
     set       （選填）進入場景時記下旗標，例如 set: { 拿到劍: true }
     effect    （選填）進入場景時改變玩家數值，格式見下方「effect」。
     battle    戰鬥場景，見下方「戰鬥」。有 battle 的場景不用寫 lines。
     都沒有 options / next / ending / battle = 這一章結束。

   ■ 台詞欄位（lines 裡的每一句）
     who       說話的人，對應 characters.js 的名字；"{name}" = 玩家自己。不寫 = 右上角不顯示說話人。
     text      文字。可用 <br> 換行、{name} 代入玩家名字。要寫引號或換行時可用反引號 ` ` 包起來。
     speed     （選填）這句的打字速度。
     set / effect  （選填）這句顯示的同時記旗標、改數值（格式同場景）。

   ■ 選項欄位（options 裡的每一項）
     text      選項文字。
     next      選了之後去哪裡（見下方「前往哪裡」）。不寫 = 這一章結束。
     require   （選填）條件，不符合就不出現。可用：
                 flag: "旗標名" 或 ["旗標1","旗標2"]      有這些旗標（全部都有才算）
                 notFlag: "旗標名" 或 [...]                沒有這些旗標
                 atkAtLeast / defAtLeast / hpAtLeast / maxHpAtLeast: 數字   玩家數值至少多少
     set       （選填）選了之後記下旗標。例如 set: { 救了村民: true }
     effect    （選填）選了之後改變玩家數值，見下方。

   ■ effect（改變玩家數值，正負數都可以）
     maxHp: 10    最大生命 +10（最大生命變大不會自動補血）
     hp: 5        生命 +5
     hpPct: 20    生命 +最大生命的 20%（負數 = 扣血；無條件進位，至少 1 點）
     atk: 1       攻擊 +1
     def: 1       防禦 +1
     例：effect: { maxHp: 10, hpPct: 100, atk: 5, def: 5 }

   ■ 前往哪裡（next / onWin / onLose / onVisit / 選項的 next / 章節的 next 都用這個寫法）
     "s3"           同一章裡的場景 s3
     "ch05"         另一章（從那一章的 start 開始）
     "ch05:s3"      另一章的場景 s3
     "ending:xxx"   結局 xxx（寫在 endings.js）
     同一章裡有和章節 id 同名的場景時，優先當成場景。寫錯時瀏覽器主控台（F12）會警告。

   ■ 戰鬥（場景的 battle 欄位）兩種：
     【自由戰鬥】沒有 rounds：走正常的王關戰鬥流程（隨機出拳、正常傷害公式），敵人用 characters.js 的資料。
        battle: { foe: "山賊群", onWin: "s5", onLose: "s6" }
     【教學戰鬥】有 rounds：固定劇本，每一回合出什麼拳、結果如何都由你決定，在故事畫面播放。
        battle: { foe: "山賊群", rounds: [ {...}, {...} ], onWin: "s5", onLose: "s6" }
     共同欄位：
       foe        敵人，characters.js 裡的名字，必填。
       foeStats   （選填）這場戰鬥覆蓋敵人的數值，例如 { maxHp: 50, atk: 8, def: 5 }（也可覆蓋招式等其他欄位）
       player     （選填）"keep"（預設，沿用目前數值）或固定數值 { maxHp: 50, atk: 10, def: 10 }
                  給固定數值時，戰鬥結束後玩家數值會還原成戰鬥前。
       onWin      贏了去哪裡。不寫 = 這個場景的 next。
       onLose     輸了去哪裡。不寫 = 提示後重新打這場戰鬥。輸掉時玩家數值還原成戰鬥前。
     自由戰鬥的敵人一定要有 maxHp / atk / def（characters.js 或 foeStats），沒有的話暫時用 50 / 10 / 10。
     敵人的招式、preference 寫在 characters.js（格式同 data/bosses.js 的 招式、preference）；
     沒寫招式就用通用招式。
     rounds 每一回合的欄位（全部選填）：
       before     回合開始前的台詞陣列（格式同 lines）
       foeMove    這回合敵人固定出的招：{ 拳種: "rock"|"scissors"|"paper", 名稱, 運氣, 攻擊, 後果: [贏, 平, 輸] }
                  不寫 = 依敵人的 preference 與招式隨機（用 characters.js 的招式）
       allow      只准玩家出哪幾種拳，例如 ["rock"]。空陣列或不寫 = 三種都可以
       hint       顯示在敵人「運氣」文字下方的提示
       onWrong    玩家出了不允許的拳時播放的台詞陣列，播完要求重選
       result     強制結果："win" | "draw" | "lose"。不寫 = 照猜拳規則
       damage     強制傷害：{ toFoe: 10, toPlayer: 0 }。不寫 = 照傷害公式（敵人沒有 atk / def 就不扣）
       after      回合結束後的台詞陣列
     教學戰鬥播完所有回合 = 勝利（除非玩家血量歸零 = 輸）；中途敵人血量歸零也提前勝利。

   ■ 存檔：故事畫面左側有「存檔／讀檔」（一個欄位）。存的是進入目前場景那一刻的狀態，
          戰鬥、結局、章節結束畫面不能存檔。
   ========================================================================== */

export const ch01 = {
    id: "ch01",
    title: "初入江湖",
    start: "s1",
    scenes: {
            s1: {
                lines: [
                    { who: "系統消息", text: "申請角色加入演出<br>江湖，是一個以人物角色為主體組成的作品與遊戲" },
                    { who: "系統消息", text: "角色密碼<br>(請勿包含& < > ' / 這些特殊符號;但可中文)" },
                    { who: "系統消息", text: "角色人物名稱<br>(請取符合江湖原創精神,且武俠古風格名稱易通過審核)" },
                    { who: "系統消息", text: "角色類型<br>" }

                ],
                options: [
                    { text: "平均型", next: "s2", effect: { maxHp: 10, hpPct: 100, atk: 5, def: 5 }  },
                    { text: "攻擊型", next: "s2", effect: { maxHp: 10, hpPct: 100, atk: 10, def: 0 } },
                    { text: "防禦型", next: "s2", effect: { maxHp: 10, hpPct: 100, atk: 0, def: 10 } }
                ],                
            },
            s2: {
                lines: [
                    { who: "系統消息", text: "我已確實閱讀並同意在任何條件情況下都遵守<span herf=\"https://www.vw.idv.tw/Rule.asp\">[遊戲規範條文約定]</span>"},
                ],
                next: "s3"
            },
            s3: {
                lines: [
                    { who: "系統消息", text: "闖蕩江湖-聊天練功" }
                ],
                options: [
                    { text: "一般登入", next: "s5" },
                    { text: "蒙面登入(50等)", next: "s4" }
                ]
            },            
            s4: {
                lines: [
                    { who: "系統消息", text: "-- 要蒙面需等級50以上!!您目前條件不足! --" }
                ],
                next: "s3"
            },
            s5: {
                lines: [
                    { who: "蘇止戈", text: `
                        呦 是新人嗎?戈來也。<br>旁邊這是梳子，是我妹。<br>
                        就讓戈教你江湖必須的生存知識吧。<br>
                        (推不存在的眼鏡)` },
                    { who: "旁白", text: `
                        一輛大運隨著急煞聲駛來，只見一道白色弧線畫出。<br>
                        大運的車門打開，上面走下的一位叼著菸的...老乞丐?<br>
                        他一下來就抓著你的肩膀自顧自地開始說...` },
                    { who: "旁白", text: `
                        「戈一定會回來的~~~」<br>
                        老乞丐碎嘴的同時，你依稀可以聽見遠方的傳來的喊聲，還有一道優美的白光。<br>
                        化作流星一閃而逝。` },
                    { who: "{name}", text: "你不禁尋思剛剛登入的是武俠遊戲，這畫風是不是不太對。" },
                    { who: "老乞丐", text: "帥哥，請留步！<br>不得了！不得了！<br>你有一道靈光從天靈蓋噴出來，你知道嗎？" }
                ],
                next: "s6"
            },
            s6: {
                lines: [
                    { who: "老乞丐", text: "帥哥，請留步！<br>不得了！不得了！<br>你有一道靈光從天靈蓋噴出來，你知道嗎？" },
                    { who: "老乞丐", text: "年紀輕輕的，就有一身橫練的筋骨…<br>簡直是百年一見的練武奇材！<br>如果有一天讓你打通任督二脈，<br>那你還不飛天啊！" },
                    { who: "老乞丐", text: "正所謂，我不入地獄，誰入地獄。<br>警惡懲奸，維護世界和平這任務<br>就交給你了，好不好？" }
                ],
                next: "s7"
            },
            s7: {
                lines: [
                    { who: "老乞丐", text: "(點頭了點頭)<br>這些都是江湖夢秘笈<br>你我有緣，就收你十塊錢，傳授給你吧！" }
                ],
                options: [
                    { text: "《如來神掌》", next: "s7a" },
                    { text: "《千手神拳》", next: "s7a" },
                    { text: "《降龍十八掌》", next: "s7a" },
                    { text: "《九陽神功》", next: "s7a" },
                    { text: "《野球拳》", next: "s7c" }
                ]
            },
            s7a: {
                lines: [
                    { who: "老乞丐", text: "(手臂爆起青筋，抓得很緊，秘笈紋絲不動。)" }
                ],
                options: [
                    { text: "《如來神掌》", next: "s7b" },
                    { text: "《千手神拳》", next: "s7b" },
                    { text: "《降龍十八掌》", next: "s7b" },
                    { text: "《九陽神功》", next: "s7b" },
                    { text: "《野球拳》", next: "s7c" }
                ]
            },
            s7b: {
                lines: [
                    { who: "老乞丐", text: "年輕人脾氣不要太倔，小心吃大虧。" }
                ],
                options: [
                    { text: "《如來神掌》", next: "s7a" },
                    { text: "《千手神拳》", next: "s7a" },
                    { text: "《降龍十八掌》", next: "s7a" },
                    { text: "《九陽神功》", next: "s7a" },
                    { text: "《野球拳》", next: "s7c" }
                ]
            },
            s7c: {
                lines: [
                    { who: "{name}", text: "野球拳?我以為是如來神掌。" },
                    { who: "老乞丐", text: "阿，你不知道阿。江湖rpg禁止抄襲，如來神掌這本秘笈不能用的啦。<br>1991的條款、運氣方式...年輕人，你還有得學呢。<br>我要去尋找下一個有緣人了!" },
                    { who: "老乞丐", text: "秘笈收了也需要修練，你就先熟悉野球拳的使用方式吧。<br>小女...我是說，小爺!我在下一站外等你...。幹，卡秒了。<br>走你!(乞丐如同閃現一般消失了)" }
                ]
            }
        }
    };
