import { playerData } from "./player.js";


export const speEventData = {
    // 1. 江湖路倒：低血量時觸發
    1: {
        cond: function () {
            return playerData.hp <= 30;
        },
        spe_event: {
            title: "江湖路倒",
            description: "你睡著了，突然聽到一陣吵鬧的聲音!",
            options: [
                {
                    text: "朋友的電話",
                    result: "你接起電話，朋友聽聞你的慘況，決定派出江湖急救小隊！你獲得了大量補給。",
                    effect: { maxHp: 10, hpPct: 40, atk: 0, def: 3 }
                },
                {
                    text: "繼續裝睡",
                    result: "朋友以為你已經往生，開始討論你的遺產分配。你氣得直接坐起來，精神大振！",
                    effect: { maxHp: 5, hpPct: 20, atk: 3, def: 0 }
                }
            ]
        }
    },

    /* 2. 搶頭香聿縭用 */
    2:{
        cond: function(){return playerData.name === "聿縭";},     
        spe_event: 
        {
            title: "搶頭香",
            description: "剛好中午十二點半，正是聊天好時節!",
            options: [
                {
                    text: "輕戳一下",
                    result: "你成功登進江湖市集，連發四句話...手滑變成六句。...六連光!",
                    effect: { maxHp: 0, hpPct: 60, atk: 6, def: 0 }
                },
                {
                    text: "連戳兩下",
                    result: '大卡秒!等待心急如焚的三十秒，你來到市集大罵一聲"幹!"。馬兒的老婆們見證頭香是"幹"光!',
                    effect: { maxHp: 0, hpPct: 5, atk: 1, def: 0 }
                }
            ]
        }
    },

    // 3. 路遇老奶奶：防禦特別高
    3: {
        cond: function () {
            return playerData.def >= 20;
        },
        spe_event: {
            title: "路遇老奶奶",
            description: "過馬路時，你看見一個行動不便的老奶奶站在路中央，神色為難!",
            options: [
                {
                    text: "展示你的防禦力",
                    result: "你決定讓老奶奶看看自己的金鐘罩鐵布衫。老奶奶拿出拐杖，連敲三下，竟然完全沒有作用！她滿意地點點頭，傳授你真正的防身心法。",
                    effect: { maxHp: 5, hpPct: 10, atk: 0, def: 5 }
                },
                {
                    text: "扶她過馬路",
                    result: "老奶奶看見你如此強壯，認為你是練武奇才，送給你一顆強身靈丹。",
                    effect: { maxHp: 10, hpPct: 20, atk: 2, def: 0 }
                }
            ]
        }
    },

    // 4. 半夜偷菜賊：攻擊力高
    4: {
        cond: function () {
            return playerData.atk >= 20;
        },
        spe_event: {
            title: "半夜偷菜賊",
            description: "深夜，你隱約看見阿菜嬤的菜園裡有個鬼鬼祟祟的人影，你走近一看，發現沈非笑竟然在偷摘小白菜！此時你想著——",
            options: [
                {
                    text: "直接出手制止",
                    result: "你大喝一聲，一拳打在地上！沈非笑看了看你，又看了看滿地的碎石，默默放下白菜，決定改日再來。",
                    effect: { maxHp: 0, hpPct: 10, atk: 3, def: 0 }
                },
                {
                    text: "邀請他一起偷",
                    result: "沈非笑看見你的武功如此高強，決定尊稱你一聲菜園大師兄。兩人偷得不亦樂乎，最後被阿菜嬤一網打盡。",
                    effect: { maxHp: 5, hpPct: -8, atk: 5, def: 0 }
                }
            ]
        }
    },

    // 5. 鴨鴨出遊中：最大生命值高
    5: {
        cond: function () {
            return playerData.maxHp >= 150;
        },
        spe_event: {
            title: "鴨鴨出遊中",
            description: "你在湖邊賞景，聽到一陣哭聲。<br>你循聲望去，只見鴨梨桑在果樹下大哭，原來是因為自己太胖，吃不到樹上的果子。",
            options: [
                {
                    text: "讓鴨鴨站在你肩上",
                    result: "你穩如泰山地讓鴨梨桑爬上肩膀，成功摘下果子。鴨鴨驚呼：「泥是巨人嗎！」",
                    effect: { maxHp: 5, hpPct: 15, atk: 0, def: 3 }
                },
                {
                    text: "一起吃果子",
                    result: "你和鴨鴨吃到肚子圓滾滾，最後一起在湖邊睡著了。這是一場幸福的午睡。",
                    effect: { maxHp: 10, hpPct: 30, atk: 0, def: 0 }
                }
            ]
        }
    },

    // 6. 神秘的算命先生：剩餘血量很低
    6: {
        cond: function () {
            return playerData.hp <= playerData.maxHp * 0.25;
        },
        spe_event: {
            title: "神秘的算命先生",
            description: "路邊有位算命先生攔住你，仔細端詳你的面相後說：「少俠，我看你骨骼驚奇，必有奇遇！」",
            options: [
                {
                    text: "問問自己的壽命",
                    result: "算命先生沉默許久，掐指一算：「少俠，你近期恐怕有血光之災。」你指了指自己滿身的傷，他尷尬地送你一顆救命丹。",
                    effect: { maxHp: 5, hpPct: 50, atk: 0, def: 0 }
                },
                {
                    text: "請他改命",
                    result: "算命先生看著你的慘況，決定免費替你改命。從今以後，你將是命硬之人！",
                    effect: { maxHp: 15, hpPct: 30, atk: 0, def: 5 }
                }
            ]
        }
    },

    // 7. 武林大會：攻擊力遠高於防禦
    7: {
        cond: function () {
            return playerData.atk >= playerData.def + 10;
        },
        spe_event: {
            title: "武林大會",
            description: "附近正在舉辦武林大會，擂台上人聲鼎沸。你也忍不住想上去露兩手。",
            options: [
                {
                    text: "挑戰所有人",
                    result: "你一上擂台便連勝十場，觀眾紛紛高喊你的名字！最後連裁判都忍不住下場挑戰你。",
                    effect: { maxHp: 0, hpPct: -8, atk: 5, def: 0 }
                },
                {
                    text: "挑戰裁判",
                    result: "裁判原本想教訓你，卻發現你的攻擊力驚人，決定將自己的獨門攻擊招式傳授給你。",
                    effect: { maxHp: 0, hpPct: -4, atk: 3, def: 2 }
                }
            ]
        }
    },

    // 8. 迷路的商隊：防禦力遠高於攻擊
    8: {
        cond: function () {
            return playerData.def >= playerData.atk + 10;
        },
        spe_event: {
            title: "迷路的商隊",
            description: "山路旁有一支迷路的商隊，領隊焦急地向你求助。你決定——",
            options: [
                {
                    text: "當商隊的盾牌",
                    result: "你站在商隊前方，讓所有貨物都躲在你的身後。商隊順利抵達目的地，領隊感動得送你一大批藥材。",
                    effect: { maxHp: 10, hpPct: 20, atk: 0, def: 5 }
                },
                {
                    text: "當場表演鐵布衫",
                    result: "你讓商隊眾人輪流拿棍子敲你，結果所有棍子都斷了。商隊領隊決定聘請你當護衛。",
                    effect: { maxHp: 5, hpPct: 10, atk: 2, def: 3 }
                }
            ]
        }
    },

    // 9. 懸崖上的寶箱：最大生命值高
    9: {
        cond: function () {
            return playerData.maxHp >= 150;
        },
        spe_event: {
            title: "懸崖上的寶箱",
            description: "你在懸崖邊發現一個閃閃發光的寶箱，似乎只要伸手就能拿到，但腳下的石頭看起來不太穩固。",
            options: [
                {
                    text: "直接跳下去",
                    result: "你仗著自己身強體壯，直接跳下懸崖！落地後毫髮無傷，還發現寶箱旁邊有一個隱藏的寶箱。",
                    effect: { maxHp: 5, hpPct: 20, atk: 3, def: 2 }
                },
                {
                    text: "用身體撞開寶箱",
                    result: "寶箱被你一撞直接飛出三丈遠，裡面掉出大量丹藥。原來這是傳說中的暴力開箱法！",
                    effect: { maxHp: 10, hpPct: 30, atk: 2, def: 0 }
                }
            ]
        }
    },

    // 10. 酒館風波：攻擊力極高
    10: {
        cond: function () {
            return playerData.atk >= 25;
        },
        spe_event: {
            title: "酒館風波",
            description: "你來到一間熱鬧的酒館，卻看見兩名武林人士正在爭吵，似乎下一秒就要動手。",
            options: [
                {
                    text: "讓他們見識你的拳頭",
                    result: "你只用一拳便讓整間酒館安靜下來。眾人看著破掉的牆壁，決定和平解決糾紛。",
                    effect: { maxHp: 5, hpPct: -4, atk: 5, def: 2 }
                },
                {
                    text: "要求他們一起拜師",
                    result: "兩人看見你的實力後，立刻跪地拜師。你莫名其妙成了酒館武術教練。",
                    effect: { maxHp: 0, hpPct: 10, atk: 3, def: 3 }
                }
            ]
        }
    },

    // 11. 林中奇遇：血量接近滿值
    11: {
        cond: function () {
            return playerData.hp >= playerData.maxHp * 0.9;
        },
        spe_event: {
            title: "林中奇遇",
            description: "你在森林中迷路，突然聽見草叢傳來奇怪的聲響。撥開樹枝後，你發現一隻受傷的小狐狸。",
            options: [
                {
                    text: "和狐狸一起探險",
                    result: "小狐狸看見你精神飽滿，決定帶你前往森林深處。你們找到一處靈泉，還發現了狐狸的秘密寶藏。",
                    effect: { maxHp: 5, hpPct: 10, atk: 2, def: 2 }
                },
                {
                    text: "請狐狸教你武功",
                    result: "狐狸竟然是修行百年的靈獸！牠看你身體健康，決定傳授你一套獨門身法。",
                    effect: { maxHp: 0, hpPct: 0, atk: 3, def: 3 }
                }
            ]
        }
    },

    // 12. 真假武林秘笈：攻擊力很低
    12: {
        cond: function () {
            return playerData.atk <= 5;
        },
        spe_event: {
            title: "真假武林秘笈",
            description: "街邊攤販正在販售一本傳說中的絕世武功秘籍，封面還寫著「練成即可天下無敵」！",
            options: [
                {
                    text: "這本書我一定要買",
                    result: "你翻開秘籍，發現第一頁寫著：「攻擊力不足者，請從基本功開始。」你照著練習，終於掌握了攻擊技巧。",
                    effect: { maxHp: 0, hpPct: -4, atk: 8, def: 0 }
                },
                {
                    text: "請攤販親自示範",
                    result: "攤販發現你的攻擊力實在太低，決定親自教你。他示範一拳，結果把自己閃到腰了。",
                    effect: { maxHp: 5, hpPct: 10, atk: 5, def: 2 }
                }
            ]
        }
    },

    // 13. 暴雨來襲：瀕臨死亡
    13: {
        cond: function () {
            return playerData.hp <= 20;
        },
        spe_event: {
            title: "暴雨來襲",
            description: "天空突然烏雲密布，沒多久便下起傾盆大雨。你必須趕快找地方避雨！",
            options: [
                {
                    text: "尋找傳說中的避雨亭",
                    result: "你冒著大雨跌跌撞撞，終於找到一座神奇的避雨亭。亭中有一位神醫，見你快不行了，立刻替你療傷。",
                    effect: { maxHp: 10, hpPct: 50, atk: 0, def: 0 }
                },
                {
                    text: "向老天爺求救",
                    result: "一道閃電劈在你旁邊，竟然劈出了一顆千年靈芝！你吃下後瞬間恢復了不少體力。",
                    effect: { maxHp: 5, hpPct: 40, atk: 2, def: 2 }
                }
            ]
        }
    },

    // 14. 神秘藥商：最大生命值非常高
    14: {
        cond: function () {
            return playerData.maxHp >= 200;
        },
        spe_event: {
            title: "神秘藥商",
            description: "一名戴著斗笠的藥商攔住你，拿出幾瓶顏色詭異的藥水，聲稱能夠改善你的體質。",
            options: [
                {
                    text: "喝下巨人藥水",
                    result: "藥商看見你強壯的體格，拿出了一瓶特製的巨人藥水。喝下後，你感覺自己更加強健了。",
                    effect: { maxHp: 20, hpPct: 30, atk: 0, def: 2 }
                },
                {
                    text: "要求藥商再加一瓶",
                    result: "藥商看你體質驚人，竟然直接把整箱藥水送給你。你喝得太開心，差點忘記自己還在旅途中。",
                    effect: { maxHp: 15, hpPct: 50, atk: 2, def: 2 }
                }
            ]
        }
    },

    // 15. 深山練武：防禦力高
    15: {
        cond: function () {
            return playerData.def >= 20;
        },
        spe_event: {
            title: "深山練武",
            description: "你來到一座幽靜的深山，發現一位白髮老者正在練習拳法。他看見你後，笑著問：「年輕人，想學點什麼嗎？」",
            options: [
                {
                    text: "展示你的防禦心法",
                    result: "老者看見你運氣護體，驚訝地發現你的防禦竟然已經超越自己。他決定傳授你失傳已久的護體神功。",
                    effect: { maxHp: 10, hpPct: 10, atk: 0, def: 5 }
                },
                {
                    text: "向老者請教更高境界",
                    result: "老者欣慰地點點頭，告訴你：「真正的防禦，不是挨打，而是讓敵人打不到你。」你豁然開朗。",
                    effect: { maxHp: 0, hpPct: 10, atk: 3, def: 3 }
                }
            ]
        }
    },

    // 16. 蟲新潮流：聿縭專屬
    16: {
        cond: function () {
            return playerData.name === "聿縭";
        },
        spe_event: {
            title: "蟲新潮流",
            description: "那是一處橙子園，漫山遍野花花綠綠、歡聲笑語，好不快災。你會?",
            options: [
                {
                    text: "加入黑水刀客",
                    result: "你與段天成一起橫掃千軍，毛毛蟲見狀紛紛投降。段天成大喊：「這才是真正的刀客！」",
                    effect: { maxHp: 10, hpPct: 20, atk: 8, def: 0 }
                },
                {
                    text: "加入鴨梨衫大",
                    result: "鴨梨桑看見你來了，立刻送上全套衣服。你穿得像一顆移動的橙子，防禦力大幅提升。",
                    effect: { maxHp: 10, hpPct: 10, atk: 0, def: 8 }
                },
                {
                    text: "加入非橙勿擾",
                    result: "你一坐下，後排的神秘人物立刻眨了眨眼：「(ゝω・)☆」你發現自己似乎被選中了。",
                    effect: { maxHp: 10, hpPct: 20, atk: 5, def: 5 }
                }
            ]
        }
    },

    // 17. 你的丹爐被人偷吃了：攻擊力高
    17: {
        cond: function () {
            return playerData.atk >= 30;
        },
        spe_event: {
            title: "你的丹爐被人偷吃了!",
            description: "你打開丹爐，發現一個不認識的人吃了你的丹爐！",
            options: [
                {
                    text: "直接一拳打爆丹爐",
                    result: "你一拳打下去，丹爐瞬間裂開，裡面的仙丹全部飛了出來。偷吃的人嚇得把仙丹全部還給你。",
                    effect: { maxHp: 10, hpPct: 30, atk: 3, def: 0 }
                },
                {
                    text: "逼他交出所有存貨",
                    result: "對方看見你的拳頭，立刻交出珍藏多年的仙丹。你成功獲得大量補給。",
                    effect: { maxHp: 5, hpPct: 40, atk: 5, def: 0 }
                }
            ]
        }
    },

    // 18. 雨靜在市集路倒了：低血量
    18: {
        cond: function () {
            return playerData.hp <= 30;
        },
        spe_event: {
            title: "雨靜在市集路倒了!",
            description: "你在市集水裡，看見昏迷不醒的雨靜！",
            options: [
                {
                    text: "一起躺下",
                    result: "你也因為體力不支倒在旁邊。雨靜睜開眼睛，看見你後默默幫你蓋上被子。兩人一起睡了個好覺。",
                    effect: { maxHp: 5, hpPct: 40, atk: 0, def: 3 }
                },
                {
                    text: "請雨靜救命",
                    result: "雨靜原本還在裝睡，聽到你快不行了，立刻起身替你療傷。原來他一直都有在注意你。",
                    effect: { maxHp: 10, hpPct: 50, atk: 2, def: 2 }
                }
            ]
        }
    },

    // 19. 江湖第一攻：特定玩家名稱
    19: {
        cond: function () {
            return playerData.name === "打工仔";
        },
        spe_event: {
            title: "《江湖第一攻》!",
            description: "誰才是江湖最帥氣、最攻、最英俊瀟灑風流倜儻的人呢？",
            options: [
                {
                    text: "打工仔",
                    result: "全場突然陷入一片沉默。你自信滿滿地站上擂台，結果老虎看了你一眼：「嗯……至少勇氣可嘉。」",
                    effect: { maxHp: 0, hpPct: 0, atk: 5, def: 5 }
                },
                {
                    text: "聿縭",
                    result: "你大聲喊出聿縭的名字！老虎立刻點頭認可，還送你一份獎勵。",
                    effect: { maxHp: 10, hpPct: 30, atk: 5, def: 5 }
                }
            ]
        }
    }
};