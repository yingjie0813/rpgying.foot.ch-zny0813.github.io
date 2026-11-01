/* ==================== 玩家初始資料 ==================== */

const initial_playerData = {
    name: "無名氏",
    maxHp: 100,
    hp: 100,
    atk: 10,
    def: 10
};
const playerData = {
    name: "無名氏",
    maxHp: 100,
    hp: 100,
    atk: 10,
    def: 10
};

/* ==================== 關卡進度資料 ==================== */
/*當前關卡*/
const gameProgress = {
    majorLevel: 1,
    smallLevel: 1
};
/*戰鬥流程*/
const battle_flow =[
    "boss_intro", 
    "battle_choose", 
    "battle_action", 
    "battle_result", 
    "consequence"
];



/* ==================== 小關事件 ==================== */


const eventData = [
    {/* 1. 江湖路倒 */
        title: "江湖路倒",
        description: "你睡著了，突然聽到一陣吵鬧的聲音!",
        options: [
            {
                text: "朋友的電話",
                result: "各方好友的奪命連環call，終於把你從反派敵無涯魔爪中吵醒。精神與體力都恢復了一些。",
                effect: { maxHp: 10, hp: 15, atk: 0, def: 0 }
            },
            {
                text: "大手一拍",
                result: "睡覺皇帝大，你一拍驚天地動鬼神。手機碎掉了QAQ，從此少了一個聯絡工具。",
                effect: { maxHp: 0, hp: 0, atk: -1, def: 0 }
            }
        ]
    },

    {/* 2. 搶頭香 */
        title: "搶頭香",
        description: "剛好中午十二點半，正是聊天好時節!",
        options: [
            {
                text: "輕戳一下",
                result: "你成功登進江湖市集，連發四句話。...當然沒有四連光，你又不是聿縭。",
                effect: { maxHp: 0, hp: 0, atk: -1, def: 0 }
            },
            {
                text: "連戳兩下",
                result: '大卡秒!等待心急如焚的三十秒，你來到市集大罵一聲"幹!"。頭香是"幹"光!',
                effect: { maxHp: 0, hp: 5, atk: 1, def: 0 }
            }
        ]
    },

    {/* 3. 路遇老奶奶 */
        title: "路遇老奶奶",
        description: "過馬路時，你看見一個行動不便的老奶奶站在路中央，神色為難!",
        options: [
            {
                text: "當沒看見",
                result: "一輛馬車為了閃避老奶奶，緊急轉向衝撞了你。你雖然沒做什麼，卻莫名其妙受了傷。",
                effect: { maxHp: 0, hp: -10, atk: 0, def: 0 }
            },
            {
                text: "扶她過馬路",
                result: "想不到老奶奶竟然是隱藏的富豪！她送了你一顆強身健體的靈丹。",
                effect: { maxHp: 5, hp: 10, atk: 2, def: 0 }
            },
            {
                text: "綁架老奶奶",
                result: "你決定綁架勒贖，想不到老奶奶突然拿出斧頭攻擊你！你倉皇逃跑，卻也從中學會了防身技巧。",
                effect: { maxHp: 0, hp: -15, atk: 0, def: 2 }
            }
        ]
    },

    {/* 4. 半夜偷菜賊 */
        title: "半夜偷菜賊",
        description: "深夜，你隱約看見阿菜嬤的菜園裡有個鬼鬼祟祟的人影，你走近一看，發現沈非笑竟然在偷摘小白菜！此時你想著——",
        options: [
            {
                text: "竟然不揪",
                result: `見狀，你躡手躡腳地走過去，輕拍大師肩膀，低聲道：「真是太不夠意思了！見者有份！」
                <br>
                沈非笑溫和一笑：「施主此言差矣，相見即是有緣，相逢即是造化。」
                <br>
                話音乍落，一道聲音幽幽從二人身後傳來。
                <br>
                「那接下來，誰被我逮到也是你們的造化！」
                <br>
                震怒的阿菜嬤拿掃帚一揮，打中了比較衰的你！`,
                effect: { maxHp: 0, hp: -10, atk: 0, def: -1 }
            },
            {
                text: "我要威脅他",
                result: `你連忙呼叫狗仔隊記錄下這一幕，拿著證據對沈非笑說：「給我江湖夢秘笈，否則就等著被揭發吧！」
                <br>
                沈非冷笑：「既然施主不肯聽勸，小僧亦無須再言。」
                <br>
                最終，你狼狽地逃離現場，雖然身受重傷，但你在被單方面毆打的過程中領悟了武學真理！`,
                effect: { maxHp: 0, hp: -20, atk: 5, def: 0 }
            },
            {
                text: "必須制止他",
                result: `「大師您身為佛門中人，怎能行盜竊之事？快放下這些白菜，隨我去吃宵夜吧——有炸雞喔！」
                <br>
                你試圖以理勸說、以德服人，甚至不惜以利相誘，終於成功制止沈非笑。
                <br>
                「……奇怪，出家人能吃肉嗎？」吃著美味的炸雞，你後知後覺地問道。
                <br>
                「施主，這是速食，沒問題的。」
                <br>
                吃完炸雞，你感覺精神與體力都更好了。`,
                effect: { maxHp: 5, hp: 10, atk: 0, def: 1 }
            },
            {
                text: "先去古佛寺",
                result: `眼下大師在偷菜，古佛寺的金佛無人看守，你當機立斷趕往古佛寺。
                <br>
                抵達後，你悄悄繞過某隻偷懶的掃地狐狸，面對難以獨力搬運的金佛，你決定用刀刮一點金箔下來，最終成功偷到了200元！
                <br>
                不過搬運金箔也讓你消耗了不少體力。`,
                effect: { maxHp: 5, hp: -5, atk: 1, def: 0 }
            }
        ]
    },

    {/* 5. 鴨鴨出遊中 */
        title: "鴨鴨出遊中",
        description: "你在湖邊賞景，聽到一陣哭聲。<br>你循聲望去，只見鴨梨桑在果樹下大哭，原來是因為自己太胖，吃不到樹上的果子。",
        options: [
            {
                text: "無情嘲笑",
                result: "鴨鴨委屈的大哭：「泥...壞人！」<br>只見他一個小助跑，奮力一躍，舉起沾滿了泥巴的小腳丫，使出一個飛踢，在你臉上留下一個鴨腳印。",
                effect: { maxHp: 0, hp: -5, atk: 0, def: 0 }
            },
            {
                text: "套布袋拐走",
                result: "鴨鴨在布袋裡不停掙扎，高喊著救命。<br>呼救聲引來附近的沈非笑注意，只見他眼神兇狠，二話不說便一掌拍飛了你。<br>「那是我的當歸！」",
                effect: { maxHp: 0, hp: -20, atk: 0, def: 0 }
            },
            {
                text: "溫柔安慰並且摘下果子",
                result: "鴨鴨開心地蹭了蹭你，用著閃閃發亮的眼睛看著你：「謝謝尼！窩還想要那邊的梨子，還有那邊的...」<br>你雖然有點累，但心情變好了。",
                effect: { maxHp: 5, hp: 10, atk: 0, def: 3 }
            }
        ]
    },

    // ==================== 以下為新增事件 ====================

    {/* 6. 神秘的算命先生 */
        title: "神秘的算命先生",
        description: "路邊有位算命先生攔住你，仔細端詳你的面相後說：「少俠，我看你骨骼驚奇，必有奇遇！」",
        options: [
            {
                text: "花錢求籤",
                result: "算命先生摸了摸鬍子，送你一本武學心得。你似乎對戰鬥有了新的領悟。",
                effect: { maxHp: 0, hp: 0, atk: 2, def: 0 }
            },
            {
                text: "請他吃飯",
                result: "算命先生感動不已，決定傳授你一套防身心法。",
                effect: { maxHp: 0, hp: 0, atk: 0, def: 5 }
            },
            {
                text: "直接逃跑",
                result: "算命先生大喊：「少俠，你命中注定有血光之災！」你跑得飛快，卻不小心跌了一跤。",
                effect: { maxHp: 0, hp: -10, atk: 0, def: 0 }
            }
        ]
    },

    {/* 7. 武林大會 */
        title: "武林大會",
        description: "附近正在舉辦武林大會，擂台上人聲鼎沸。你也忍不住想上去露兩手。",
        options: [
            {
                text: "報名參賽",
                result: "你一路過關斬將，雖然最後落敗，但在高手的指點下，攻擊技巧大幅進步。",
                effect: { maxHp: 0, hp: -15, atk: 5, def: 0 }
            },
            {
                text: "觀摩高手過招",
                result: "你仔細觀察每個人的出招與防守，逐漸掌握了防禦的訣竅。",
                effect: { maxHp: 0, hp: 0, atk: 0, def: 3 }
            },
            {
                text: "偷偷混進貴賓席",
                result: "你吃了不少免費點心，還順手拿走一瓶補氣藥酒。",
                effect: { maxHp: 5, hp: 30, atk: 1, def: 0 }
            }
        ]
    },

    {/* 8. 迷路的商隊 */
        title: "迷路的商隊",
        description: "山路旁有一支迷路的商隊，領隊焦急地向你求助。你決定——",
        options: [
            {
                text: "幫忙帶路",
                result: "商隊順利抵達目的地，領隊感激地送你一些珍貴藥材。",
                effect: { maxHp: 5, hp: 20, atk: 0, def: 0 }
            },
            {
                text: "收取帶路費",
                result: "你成功賺了一筆，但領隊認為你獅子大開口，臨走前狠狠推了你一把。",
                effect: { maxHp: 0, hp: -5, atk: 0, def: 2 }
            },
            {
                text: "趁亂偷東西",
                result: "你趁商隊忙亂時摸走了一本武學秘籍，卻被護衛發現，狼狽逃走。",
                effect: { maxHp: 0, hp: -15, atk: 3, def: 0 }
            }
        ]
    },

    {/* 9. 懸崖上的寶箱 */
        title: "懸崖上的寶箱",
        description: "你在懸崖邊發現一個閃閃發光的寶箱，似乎只要伸手就能拿到，但腳下的石頭看起來不太穩固。",
        options: [
            {
                text: "冒險攀爬",
                result: "你成功取得寶箱，裡面竟然有一顆珍貴的強身丹！",
                effect: { maxHp: 10, hp: 5, atk: 3, def: 0 }
            },
            {
                text: "用石頭敲開",
                result: "寶箱裡的機關突然啟動，雖然你受了傷，但也意外學到了如何破解機關。",
                effect: { maxHp: 0, hp: -10, atk: 0, def: 2 }
            },
            {
                text: "放棄離開",
                result: "你覺得小命比較重要，於是頭也不回地離開。安全第一！",
                effect: { maxHp: 0, hp: 15, atk: 0, def: 0 }
            }
        ]
    },

    {/* 10. 酒館風波 */
        title: "酒館風波",
        description: "你來到一間熱鬧的酒館，卻看見兩名武林人士正在爭吵，似乎下一秒就要動手。",
        options: [
            {
                text: "出面勸架",
                result: "兩人不但沒有打起來，還對你的勇氣表示敬佩，並傳授你一些防身技巧。",
                effect: { maxHp: 0, hp: -5, atk: 2, def: 2 }
            },
            {
                text: "加入混戰",
                result: "你莫名其妙成了眾人的共同敵人，最後被打得鼻青臉腫，卻也在混戰中學會了幾招。",
                effect: { maxHp: 10, hp: -20, atk: 5, def: 0 }
            },
            {
                text: "趁亂吃免費點心",
                result: "你趁大家打得不可開交時，把桌上的食物吃得一乾二淨。",
                effect: { maxHp: 5, hp: 10, atk: 0, def: 0 }
            }
        ]
    },

    {/* 11. 林中奇遇 */
        title: "林中奇遇",
        description: "你在森林中迷路，突然聽見草叢傳來奇怪的聲響。撥開樹枝後，你發現一隻受傷的小狐狸。",
        options: [
            {
                text: "幫狐狸包紮",
                result: "小狐狸感激地舔了舔你的手，隨後帶你找到一處靈泉。",
                effect: { maxHp: 5, hp: 35, atk: 0, def: 0 }
            },
            {
                text: "拿走狐狸的食物",
                result: "小狐狸生氣地咬了你一口，你只好狼狽逃跑。",
                effect: { maxHp: 0, hp: -10, atk: 0, def: 0 }
            },
            {
                text: "跟著狐狸走",
                result: "你跟著小狐狸來到一處隱密山洞，洞中石壁刻著古老的防身招式。",
                effect: { maxHp: 0, hp: 0, atk: 0, def: 3 }
            }
        ]
    },

    {/* 12. 真假武林秘笈 */
        title: "真假武林秘笈",
        description: "街邊攤販正在販售一本傳說中的絕世武功秘籍，封面還寫著「練成即可天下無敵」！",
        options: [
            {
                text: "花錢買下",
                result: "你滿懷期待地翻開秘籍，發現裡面竟然真的藏著幾招實用的攻擊技巧！",
                effect: { maxHp: 0, hp: -5, atk: 3, def: 0 }
            },
            {
                text: "要求試讀",
                result: "攤販勃然大怒，拿起書本就往你頭上敲。雖然有點痛，但你學會了如何防守頭部攻擊。",
                effect: { maxHp: 0, hp: -5, atk: 0, def: 2 }
            },
            {
                text: "揭穿騙局",
                result: "你發現秘籍其實是一本食譜，當場拆穿攤販的騙局。攤販氣急敗壞地追著你跑。",
                effect: { maxHp: 0, hp: -10, atk: 1, def: 0 }
            }
        ]
    },

    {/* 13. 暴雨來襲 */
        title: "暴雨來襲",
        description: "天空突然烏雲密布，沒多久便下起傾盆大雨。你必須趕快找地方避雨！",
        options: [
            {
                text: "躲進山洞",
                result: "你在山洞裡發現一處溫暖的泉水，泡過之後疲勞一掃而空。",
                effect: { maxHp: 0, hp: 20, atk: 0, def: 0 }
            },
            {
                text: "冒雨趕路",
                result: "你雖然成功抵達目的地，卻因為淋雨而感到身體不適。",
                effect: { maxHp: 0, hp: -15, atk: 0, def: 0 }
            },
            {
                text: "在樹下練功",
                result: "你趁著等待雨停的時間勤練武功，意外掌握了新的攻擊技巧。",
                effect: { maxHp: 0, hp: -5, atk: 2, def: 0 }
            }
        ]
    },

    {/* 14. 神秘藥商 */
        title: "神秘藥商",
        description: "一名戴著斗笠的藥商攔住你，拿出幾瓶顏色詭異的藥水，聲稱能夠改善你的體質。",
        options: [
            {
                text: "喝下紅色藥水",
                result: "一股熱流竄遍全身，你感覺體力與攻擊力都提升了！",
                effect: { maxHp: 5, hp: 10, atk: 1, def: 0 }
            },
            {
                text: "喝下藍色藥水",
                result: "藥水入口清涼，你的身體變得更加堅韌。",
                effect: { maxHp: 5, hp: 5, atk: 0, def: 2 }
            },
            {
                text: "拒絕服用",
                result: "你覺得來路不明的藥水還是別亂喝，於是禮貌地拒絕了藥商。",
                effect: { maxHp: 0, hp: 5, atk: 0, def: 0 }
            }
        ]
    },

    {/* 15. 深山練武 */
        title: "深山練武",
        description: "你來到一座幽靜的深山，發現一位白髮老者正在練習拳法。他看見你後，笑著問：「年輕人，想學點什麼嗎？」",
        options: [
            {
                text: "學習攻擊招式",
                result: "老者親自指點你的拳法，你經過一番苦練，終於掌握了更強大的攻擊技巧。",
                effect: { maxHp: 0, hp: -10, atk: 3, def: 0 }
            },
            {
                text: "學習防禦心法",
                result: "老者教你如何運氣護體，經過練習，你的防禦能力大幅提升。",
                effect: { maxHp: 0, hp: -10, atk: 0, def: 3 }
            },
            {
                text: "請教養生之道",
                result: "老者教你調整呼吸、調養身體。雖然沒有學到什麼厲害招式，但身體健康才是最重要的。",
                effect: { maxHp: 10, hp: 15, atk: 0, def: 0 }
            }
        ]
    },
    {/* 16. 蟲新潮流 */
        title: "蟲新潮流",
        description: "那是一處橙子園，漫山遍野花花綠綠、歡聲笑語，好不快災。你會?",
        options: [
            {
                text: "加入黑水刀客",
                result: "和段天成一起舞刀擊劍，你一個橫掃。<br>段天成:「小心，那是!」<br>被橫掃到的毛毛蟲爆汁了，是普通的...好像兩個差不多。",
                effect: { maxHp: 10, hp: 10, atk: 3, def: -5 }
            },
            {
                text: "加入鴨梨衫大",
                result: "你套上了一件又一件的衣服，「衫大!」",
                effect: { maxHp: 0, hp: 0, atk: 0, def: 6 }
            },
            {
                text: "加入非橙勿擾",
                result: "就叫你勿擾，看電影也記得關聲音呦。<br>後排座位上好像有甚麼眨了一下眼:「(ゝω・)☆」",
                effect: { maxHp: 0, hp: 0, atk: 0, def: 0 }
            }
        ]
    },

    {/* 17. 你的丹爐被人偷吃了 */
        title: "你的丹爐被人偷吃了!",
        description: "你打開丹爐，發現一個不認識的人吃了你的丹爐！",
        options: [
            {
                text: "相信他說：「我沒偷！」",
                result: "恭喜你成為睜眼瞎子！",
                effect: { maxHp: -10, hp: 0, atk: 0, def: 0 }
            },
            {
                text: "扶她過馬路",
                result: "祝他喝水嗆到，上廁所沒紙。",
                effect: { maxHp: 0, hp: 0, atk: 5, def: 0 }
            },
            {
                text: "爆破他",
                result: "他把仙丹還給你了，但他說不是他做的，他不會認的。",
                effect: { maxHp: 10, hp: 50, atk: 0, def: 0 }
            }
        ]
    },

    {/* 18. 雨靜在市集路倒了 */
        title: "雨靜在市集路倒了!",
        description: "你在市集水裡，看見昏迷不醒的雨靜！",
        options: [
            {
                text: "吻他",
                result: "雨靜其實一直醒著，但他希望你多親幾下。",
                effect: { maxHp: 10, hp: 10, atk: 10, def: 10 }
            },
            {
                text: "叫捕快",
                result: "雨靜睡醒回神，發現自己身在衙門，吃了好幾口難吃的食物。",
                effect: { maxHp: 0, hp: 50, atk: 0, def: 0 }
            },
            {
                text: "習以為常",
                result: "雨靜從小睡到大，他會好好活著的，不用擔心。",
                effect: { maxHp: 10, hp: 0, atk: 0, def: 5 }
            },
            {
                text: "輕輕敲醒他沉睡的心靈",
                result: "要敲他嗎？用榔頭吧！這個好使！",
                effect: { maxHp: 0, hp: 0, atk: 10, def: 0 }
            },
            {
                text: "幫他蓋被子",
                result: "雨靜一腳把被子踢開，你決定用麻繩把他捆起來！",
                effect: { maxHp: 0, hp: 0, atk: 3, def: 3 }
            }
        ]
    },
    {/* 19. 《江湖第一攻》 */
        title: "《江湖第一攻》!",
        description: "誰才是江湖最帥氣、最攻、最英俊瀟灑風流倜儻的人呢？",
        options: [
            {
                text: "聿縭",
                result: "你非常有眼光，獲得了老虎的肯定！",
                effect: { maxHp: 10, hp: 100, atk: 10, def: 10 }
            },
            {
                text: "打工仔",
                result: "確定嗎？你再想想。",
                effect: { maxHp: 0, hp: 0, atk: -5, def: 0 }
            },
            {
                text: "江南一朵嘎",
                result: "我們嘎總當然攻！",
                effect: { maxHp: 0, hp: 0, atk: 10, def: 0 }
            },
            {
                text: "葉詭",
                result: "小葉子受！",
                effect: { maxHp: 0, hp: 0, atk: 0, def: -5 }
            }
        ]
    }
];


