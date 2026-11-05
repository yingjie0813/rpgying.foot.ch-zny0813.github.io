/* 視覺素材:水墨山水、線稿圖示、印章頭像。
   程式碼取自遊戲A的 art.js(僅美術部分)。改成 ES 模組後,只有檔案最底下 export 的東西對外公開,
   其餘函數與常數都是這個檔案的私有內容,不會與其他模組的變數衝突。 */

/* ================= 山水場景（純程式生成，不含任何人物） ================= */
function RNG(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const r1=n=>Math.round(n*10)/10;
let _sid=0;

const PAL={
  dusk:{sky:['#4b3366','#c0566b','#f2904e','#f9cf86'],sun:[820,470,60,'#fff0c4'],ridges:['#7a5079','#63426b','#4d3556','#33253d'],haze:'#f6a074'},
  gold:{sky:['#3d2b58','#b4506a','#ee8548','#fbc77a'],sun:[420,450,64,'#fff0c4'],ridges:['#6f4a6f','#5a3d63','#46304f','#2e2234'],haze:'#f19a68'},
  rose:{sky:['#583a6e','#d0627a','#f59c62','#fbd99f'],sun:[1160,440,56,'#fff0c4'],ridges:['#81557e','#684570','#523859','#35263f'],haze:'#f7aa7e'},
  night:{sky:['#0f1330','#2a2655','#6a4a7d','#d98a78'],sun:[1180,210,38,'#f6f0d8'],ridges:['#3d3466','#2f2954','#241f42','#17142c'],haze:'#8a6aa0',moon:true},
  rain:{sky:['#3b4a58','#6c7f86','#a2aea6','#d4d0b8'],sun:[800,300,50,'#f0ecd0'],ridges:['#6c8186','#566d73','#42585e','#2c3d43'],haze:'#cfd5c4',sunc:'#f0ecd0',rain:true},
  fire:{sky:['#2b1830','#7a2d46','#d9582f','#f6b45e'],sun:[800,520,76,'#ffe3a0'],ridges:['#5d2d49','#4a2440','#371b34','#241126'],haze:'#e47a45'},
  dawn:{sky:['#34476b','#8a6f9a','#e79a85','#fbd7a4'],sun:[1000,520,48,'#fff3d2'],ridges:['#6d6a8e','#575679','#444363','#2d2c46'],haze:'#f0b7a0'},
  ash:{sky:['#161a28','#2f3550','#6a6074','#b79a8e'],sun:[1220,230,36,'#e9e3cf'],ridges:['#4a4a68','#3a3a58','#2c2b46','#1c1b30'],haze:'#8f879f',moon:true},
  amber:{sky:['#503161','#c25a61','#f0953f','#fad288'],sun:[680,460,62,'#fff0c4'],ridges:['#755068','#5f4059','#4b3248','#33232f'],haze:'#f3a35c'}
};
const SCN={
  title:{p:'dusk',feat:['falls','pagodaFar','sakura','lantern','pineR','petalsGround'],ground:'#2a1d24'},
  road:{p:'rose',feat:['falls','pineL','maple','stonepath'],ground:'#2b1e25'},
  river:{p:'gold',feat:['river','reeds','pineL'],ground:'#2a1d22'},
  temple:{p:'rose',feat:['falls','maple','temple','lantern2','stonepath'],ground:'#2d2025'},
  inn:{p:'night',feat:['stars','inn','pineR','lanterns'],ground:'#14102a'},
  arena1:{p:'dusk',feat:['mesa','cracks'],ground:'#3a2a2d',cracked:true},
  market:{p:'amber',feat:['market','lanterns','paifang'],ground:'#2d2027'},
  bamboo:{p:'rain',feat:['bamboo','rain'],ground:'#1f2c2c'},
  field:{p:'dusk',feat:['fence','ballfield','paifang'],ground:'#3a2b27'},
  bridge:{p:'dawn',feat:['river','bridge','pineL'],ground:'#252030'},
  arena2:{p:'fire',feat:['ballfield','paifang','cracks'],ground:'#3a2326',cracked:true},
  cliff:{p:'dawn',feat:['clouds','plank','pineR'],ground:'#262336'},
  stones:{p:'night',feat:['stars','steles','mist'],ground:'#151228'},
  falls:{p:'rain',feat:['bigfalls','mossrocks'],ground:'#1f2b2d'},
  summit:{p:'gold',feat:['ballfield','pineL','banner9'],ground:'#3a2b27'},
  arena3:{p:'fire',feat:['ballfield','banner9','cracks'],ground:'#3a2326',cracked:true},
  end:{p:'dusk',feat:['pagodaFar','lanterns','maple','stonepath'],ground:'#2b1e25'},
  bazaar:{p:'dusk',feat:['bazaar'],ground:'#2a1d24'},
  yamen:{p:'ash',feat:['yamen'],ground:'#17141d'},
  endDark:{p:'night',feat:['stars','steles','mist'],ground:'#151228'}
};

function ridgePath(r,base,amp,ph,rough){
  const pts=[];
  for(let x=-60;x<=1660;x+=48){
    const n=.55*Math.sin(x*.0042+ph)+.3*Math.sin(x*.0113+ph*2.3)+.22*(r()-.5)*rough;
    pts.push([x,base-amp*(.5+.5*n)]);
  }
  let d=`M-60 920 L${pts[0][0]} ${r1(pts[0][1])}`;
  for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i];d+=` Q${x0} ${r1(y0)} ${r1((x0+x1)/2)} ${r1((y0+y1)/2)}`}
  return d+' L1660 920 Z';
}
function tierRoof(w,h,c){return `<path d="M${-w} 0 Q${-w*.5} 0 0 ${-h} Q${w*.5} 0 ${w} 0 Q${w*.55} ${h*.18} 0 ${h*.1} Q${-w*.55} ${h*.18} ${-w} 0Z" fill="${c}"/>`}
function pagoda(x,y,s,c,glow){
  let g='',yy=0,w=44;
  for(let i=0;i<5;i++){
    const ww=w-i*5.5;
    g+=`<rect x="${-ww*.34}" y="${yy-24}" width="${ww*.68}" height="24" fill="${c}"/>`;
    if(glow)g+=`<rect x="-3" y="${yy-19}" width="6" height="10" fill="${glow}" opacity=".85"/>`;
    g+=`<g transform="translate(0 ${yy-22})">${tierRoof(ww*.78,16,c)}</g>`;
    yy-=34;
  }
  g+=`<rect x="-1.4" y="${yy-26}" width="2.8" height="30" fill="${c}"/><circle cx="0" cy="${yy-26}" r="3" fill="${c}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
function lantern(x,y,s,id){
  return `<g transform="translate(${x} ${y}) scale(${s})"><line x1="0" y1="-120" x2="0" y2="0" stroke="#2a160e" stroke-width="3"/>
  <circle cx="0" cy="34" r="62" fill="url(#lg${id})"/>
  <rect x="-16" y="-2" width="32" height="7" rx="2" fill="#2a160e"/>
  <ellipse cx="0" cy="34" rx="25" ry="31" fill="#e9852e"/><ellipse cx="0" cy="34" rx="25" ry="31" fill="url(#lf${id})"/>
  <path d="M-25 34 Q0 22 25 34 M-23 21 Q0 10 23 21 M-23 47 Q0 58 23 47" fill="none" stroke="#a63d14" stroke-width="2" opacity=".7"/>
  <rect x="-14" y="64" width="28" height="6" rx="2" fill="#2a160e"/>
  <path d="M0 70 V94 M-4 70 L-6 90 M4 70 L6 90" stroke="#c9482b" stroke-width="2.4" fill="none"/></g>`;
}
function blossom(r,x,y,len,ang,depth,col,out){
  const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
  out.push(`<path d="M${r1(x)} ${r1(y)} Q${r1((x+x2)/2+ (r()-.5)*20)} ${r1((y+y2)/2+(r()-.5)*20)} ${r1(x2)} ${r1(y2)}" stroke="#2a1713" stroke-width="${Math.max(1.5,depth*2.2)}" fill="none" stroke-linecap="round"/>`);
  if(depth<=0){
    for(let i=0;i<7;i++){const cx=x2+(r()-.5)*54,cy=y2+(r()-.5)*40;out.push(`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(7+r()*9)}" fill="${col[Math.floor(r()*col.length)]}" opacity=".92"/>`)}
    return;
  }
  const n=2+(r()>.55?1:0);
  for(let i=0;i<n;i++)blossom(r,x2,y2,len*(.62+r()*.15),ang+(r()-.5)*1.3,depth-1,col,out);
}
function leafSvg(x,y,s,rot,c){return `<path transform="translate(${r1(x)} ${r1(y)}) rotate(${rot}) scale(${s})" d="M0 -14 L4 -7 L11 -9 L8 -2 L15 2 L6 4 L7 12 L0 7 L-7 12 L-6 4 L-15 2 L-8 -2 L-11 -9 L-4 -7Z" fill="${c}"/>`}
function mapleBranch(r,flip){
  const o=[];blossom(r,0,0,150,.6,3,['transparent'],o);
  const body=o.filter(s=>s.startsWith('<path')).join('');
  let leaves='';const cols=['#c9402a','#e2632c','#a8281f','#f0893a'];
  for(let i=0;i<46;i++){leaves+=leafSvg(r()*330-20,r()*230,.55+r()*.6,r()*360,cols[Math.floor(r()*4)])}
  return `<g transform="${flip?'translate(1640 -10) scale(-1 1)':'translate(1330 -10)'}">${body}${leaves}</g>`;
}

const F={
  falls(r,S,u){
    return `<g><path d="M1210 590 L1250 360 L1330 330 L1420 355 L1470 470 L1500 600Z" fill="${S.pal.ridges[1]}" opacity=".95"/>
    <rect x="1344" y="338" width="22" height="270" fill="url(#wf${u})"/>
    <path d="M1348 340V600M1356 340V600M1363 340V600" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
    <ellipse cx="1355" cy="606" rx="70" ry="16" fill="#fff" opacity=".35" filter="url(#bl${u})"/></g>`;
  },
  bigfalls(r,S,u){
    return `<g><path d="M780 0 L840 40 L860 330 L1160 330 L1180 40 L1230 0Z" fill="#2c3e42" opacity=".85" transform="translate(-100 0)"/>
    <rect x="720" y="0" width="150" height="640" fill="url(#wf${u})" opacity=".85"/>
    <path d="M740 0V640M770 0V640M800 0V640M830 0V640M850 0V640" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
    <ellipse cx="795" cy="650" rx="190" ry="40" fill="#fff" opacity=".5" filter="url(#bl${u})"/>
    <path d="M0 680 Q400 640 790 670 Q1200 640 1600 690 V900 H0Z" fill="#1d2e30"/></g>`;
  },
  pagodaFar(r,S,u){
    return `<g><path d="M1250 560 Q1330 430 1420 420 Q1520 430 1600 520 L1600 600Z" fill="${S.pal.ridges[1]}"/>${pagoda(1430,430,1.05,S.pal.ridges[3],'#ffd27a')}</g>`;
  },
  mesa(r,S,u){return `<g><path d="M1100 600 L1140 440 L1380 430 L1430 600Z" fill="${S.pal.ridges[2]}"/>${pagoda(1260,432,.8,S.pal.ridges[3],'#ffcf80')}</g>`},
  temple(r,S,u){
    const c='#2a1a22';
    return `<g transform="translate(1250 690)">
    <rect x="-210" y="-26" width="420" height="30" fill="#33232b"/><rect x="-190" y="-48" width="380" height="24" fill="#3a2830"/><rect x="-170" y="-70" width="340" height="24" fill="#403038"/>
    <g fill="${c}"><rect x="-150" y="-190" width="300" height="120"/>
    <path d="M-220 -190 Q-130 -190 0 -300 Q130 -190 220 -190 Q150 -170 0 -178 Q-150 -170 -220 -190Z"/>
    <path d="M-170 -250 Q-90 -250 0 -330 Q90 -250 170 -250 Q110 -236 0 -242 Q-110 -236 -170 -250Z"/></g>
    <rect x="-100" y="-170" width="200" height="100" fill="#120b0f"/>
    <circle cx="-34" cy="-130" r="3" fill="#ffb457"/><circle cx="34" cy="-130" r="3" fill="#ffb457"/>
    <rect x="-18" y="-136" width="36" height="66" rx="2" fill="#2a1a22" stroke="#6a4a3a" stroke-width="2"/>
    <rect x="-132" y="-180" width="16" height="106" fill="#6e2018"/><rect x="116" y="-180" width="16" height="106" fill="#6e2018"/>
    <path d="M-190 -170 V-100 M190 -170 V-100" stroke="#a8281f" stroke-width="22" opacity=".85"/>
    <circle cx="-60" cy="-8" r="5" fill="#ffb457"/><circle cx="60" cy="-8" r="5" fill="#ffb457"/>
    <path d="M-60 -14 q-3 -18 3 -30 M60 -14 q3 -18 -3 -30" stroke="#d9cfd0" stroke-opacity=".5" stroke-width="3" fill="none"/></g>`;
  },
  inn(r,S,u){
    return `<g transform="translate(1120 700)"><rect x="-190" y="-130" width="380" height="130" fill="#1a1426"/>
    <path d="M-230 -130 Q-120 -140 0 -210 Q120 -140 230 -130 Q130 -112 0 -120 Q-130 -112 -230 -130Z" fill="#120d1d"/>
    <rect x="-150" y="-95" width="60" height="50" fill="#ffc26a" opacity=".92"/><rect x="-30" y="-95" width="60" height="50" fill="#ffc26a" opacity=".88"/><rect x="90" y="-95" width="60" height="50" fill="#ffb457" opacity=".9"/>
    <path d="M-150 -70H-90M-120 -95V-45M-30 -70H30M0 -95V-45M90 -70H150M120 -95V-45" stroke="#1a1426" stroke-width="3"/>
    ${lantern(-210,-90,.7,u)}${lantern(210,-90,.7,u)}</g>`;
  },
  stars(r,S){let o='<g fill="#fff">';for(let i=0;i<70;i++)o+=`<circle cx="${r1(r()*1600)}" cy="${r1(r()*380)}" r="${r1(.6+r()*1.5)}" opacity="${r1(.35+r()*.6)}"/>`;return o+'</g>'},
  sakura(r,S,u){const o=[];blossom(r,-20,60,190,.35,4,['#f7b8c6','#f4a3b6','#fbd2da','#f08fa8'],o);return `<g>${o.join('')}</g>`},
  lantern(r,S,u){return lantern(108,128,1,u)},
  lantern2(r,S,u){return lantern(1520,70,.9,u)},
  lanterns(r,S,u){let o='';for(let i=0;i<7;i++){o+=lantern(100+i*230+(r()*40),(i%2)*30-30,.6+r()*.2,u)}return `<g opacity=".95">${o}</g>`},
  maple(r,S,u){return mapleBranch(r,false)},
  pineL(r,S,u){return pine(120,720,1.1,'#1d1520',r)},
  pineR(r,S,u){return pine(1480,730,1.15,'#1d1520',r)},
  river(r,S,u){
    let o=`<rect x="0" y="560" width="1600" height="200" fill="url(#rv${u})"/>`;
    const sx=S.pal.sun[0];
    for(let i=0;i<14;i++)o+=`<rect x="${r1(sx-80+r()*160)}" y="${r1(575+i*13)}" width="${r1(30+r()*90)}" height="3" fill="#ffe7b0" opacity="${r1(.5-i*.03)}"/>`;
    return `<g>${o}</g>`;
  },
  reeds(r,S,u){let o='';for(let i=0;i<46;i++){const x=r()<.5?r()*420:1180+r()*420,h=70+r()*120,y=760+r()*60;o+=`<path d="M${r1(x)} ${r1(y)} q${r1((r()-.5)*30)} ${-h*.5} ${r1((r()-.5)*40)} ${-h}" stroke="#2c2029" stroke-width="${r1(1.5+r()*2)}" fill="none"/>`;}return `<g>${o}</g>`},
  bridge(r,S,u){
    return `<g fill="#241b2a"><path d="M200 700 Q420 520 700 690 L700 740 L200 740Z"/><path d="M880 692 Q1100 560 1400 700 L1400 740 L880 740Z"/>
    <rect x="180" y="672" width="540" height="26"/><rect x="860" y="672" width="560" height="26"/>
    <path d="M700 690 L744 730 L720 736 L690 706Z"/><path d="M880 690 L850 720 L860 736 L890 710Z"/>
    ${[...Array(8)].map((_,i)=>`<rect x="${200+i*68}" y="646" width="12" height="28"/>`).join('')}${[...Array(8)].map((_,i)=>`<rect x="${880+i*68}" y="646" width="12" height="28"/>`).join('')}</g>`;
  },
  bamboo(r,S,u){
    let o='';
    for(let i=0;i<30;i++){
      const x=r()*1600,w=7+r()*16,op=.5+r()*.5,c=r()<.5?'#1c2b29':'#26403a';
      o+=`<g opacity="${r1(op)}"><rect x="${r1(x)}" y="-10" width="${r1(w)}" height="930" fill="${c}"/>`;
      for(let k=0;k<9;k++)o+=`<rect x="${r1(x-1)}" y="${r1(k*110+r()*40)}" width="${r1(w+2)}" height="4" fill="#0e1a19"/>`;
      for(let k=0;k<4;k++)o+=`<path d="M${r1(x+w)} ${r1(150+k*190)} q${r1(60+r()*40)} ${-20-r()*20} ${r1(110+r()*40)} ${r1(30+r()*40)}" stroke="${c}" stroke-width="4" fill="none"/>`;
      o+='</g>';
    }
    return o;
  },
  rain(r,S){let o='<g stroke="#e7f0ee" stroke-opacity=".28" stroke-width="1.2">';for(let i=0;i<150;i++){const x=r()*1650,y=r()*900;o+=`<path d="M${r1(x)} ${r1(y)} l-9 26"/>`}return o+'</g>'},
  fence(r,S){let o='<g fill="#2a1c1c">';for(let i=0;i<30;i++)o+=`<rect x="${i*56-20}" y="${560+Math.abs(Math.sin(i))*4}" width="14" height="${96}" /><path d="M${i*56-20} 560 l7 -10 l7 10Z"/>`;return o+`<rect x="0" y="590" width="1600" height="8"/><rect x="0" y="624" width="1600" height="8"/></g>`},
  ballfield(r,S,u){
    // 石板球場：由遠到近的菱形壘線，象徵「野球」
    return `<g><path d="M300 900 L800 620 L1300 900Z" fill="#6a4c3a" opacity=".55"/>
    <path d="M520 900 L800 700 L1080 900Z" fill="#826048" opacity=".5"/>
    <path d="M800 620 L1030 760 L800 900 L570 760Z" fill="none" stroke="#f4dfb4" stroke-opacity=".55" stroke-width="3"/>
    <path d="M800 640 L800 880" stroke="#f4dfb4" stroke-opacity=".25" stroke-width="2"/>
    <rect x="786" y="610" width="28" height="12" fill="#f4dfb4" opacity=".8"/><rect x="1012" y="752" width="30" height="14" fill="#f4dfb4" opacity=".8" transform="rotate(8 1027 759)"/><rect x="560" y="752" width="30" height="14" fill="#f4dfb4" opacity=".8" transform="rotate(-8 575 759)"/>
    <path d="M770 884 L800 868 L830 884 L830 898 L770 898Z" fill="#f4dfb4" opacity=".85"/></g>`;
  },
  paifang(r,S,u){
    return `<g transform="translate(1250 620)" fill="#2a1a22"><rect x="-120" y="-120" width="14" height="150"/><rect x="106" y="-120" width="14" height="150"/><rect x="-14" y="-140" width="28" height="170"/>
    <path d="M-160 -130 Q-80 -135 0 -190 Q80 -135 160 -130 Q80 -120 0 -126 Q-80 -120 -160 -130Z"/><rect x="-124" y="-96" width="248" height="14" fill="#6e2018"/></g>`;
  },
  banner9(r,S){return `<g transform="translate(180 540)"><rect x="-4" y="-20" width="8" height="320" fill="#2a1a22"/><path d="M4 -10 H150 V160 L77 140 L4 160Z" fill="#8e2017"/><path d="M4 -10 H150 V160 L77 140 L4 160Z" fill="none" stroke="#f5dc92" stroke-width="3" opacity=".7"/><text x="77" y="92" text-anchor="middle" font-size="86" fill="#f5dc92" font-family="Yuji Boku,Noto Serif TC,serif">九</text></g>`},
  market(r,S,u){
    let o='';
    for(let i=0;i<9;i++){const x=i*190-40+(r()*30),h=70+r()*70;
      o+=`<g transform="translate(${r1(x)} 640)"><rect x="-70" y="-${h}" width="140" height="${h}" fill="#2a1b24"/><path d="M-96 -${h} Q-40 -${h+10} 0 -${h+60} Q40 -${h+10} 96 -${h} Q40 -${h-8} 0 -${h-4} Q-40 -${h-8} -96 -${h}Z" fill="#1f141c"/><rect x="-44" y="-${h*.6}" width="26" height="${h*.3}" fill="#ffc26a" opacity=".85"/><rect x="18" y="-${h*.6}" width="26" height="${h*.3}" fill="#ffb457" opacity=".8"/></g>`}
    return `<g>${o}</g>`;
  },
  /* 江湖市集：街道兩側的商鋪樓、懸掛的酒旗幌子、橫跨街道的燈籠串，遠處是城門樓（沒有任何人物） */
  bazaar(r,S,u){
    const body=['#2a1b24','#301f29','#261822'], dark='#170e16';
    const signs=['酒','茶','當','藥','棧','鏢','布','鐵'];
    const shop=(x,base,w,h,c,sign,flip)=>{
      const h1=h*.46, f=flip?-1:1;
      let o=`<g transform="translate(${x} ${base})">`;
      o+=`<rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" fill="${c}"/>`;
      o+=`<rect x="${-w/2-10}" y="${-h1-6}" width="${w+20}" height="8" fill="${dark}"/>`;
      /* 二樓：發亮的格窗與欄杆 */
      for(let i=0;i<2;i++){const wx=-w*.3+i*w*.34;
        o+=`<rect x="${r1(wx)}" y="${r1(-h+h*.2)}" width="${r1(w*.24)}" height="${r1(h*.22)}" fill="#ffc26a" opacity="${r1(.72+r()*.2)}"/>
        <path d="M${r1(wx)} ${r1(-h+h*.31)}H${r1(wx+w*.24)}M${r1(wx+w*.12)} ${r1(-h+h*.2)}V${r1(-h+h*.42)}" stroke="${c}" stroke-width="3"/>`;}
      o+=`<path d="M${-w/2+6} ${-h1-16}H${w/2-6}" stroke="#4a2a2a" stroke-width="4"/>`;
      for(let i=0;i<=7;i++)o+=`<rect x="${r1(-w/2+8+i*(w-18)/7)}" y="${-h1-16}" width="3" height="10" fill="#4a2a2a"/>`;
      /* 屋頂：翹簷 */
      o+=`<path d="M${-w/2-24} ${-h+2} Q${-w/4} ${-h-4} 0 ${r1(-h-h*.32)} Q${w/4} ${-h-4} ${w/2+24} ${-h+2} Q${w/4} ${-h+14} 0 ${-h+8} Q${-w/4} ${-h+14} ${-w/2-24} ${-h+2}Z" fill="#150c14"/>
      <path d="M${-w/2-24} ${-h+2} q-8 -10 -14 -12 M${w/2+24} ${-h+2} q8 -10 14 -12" stroke="#150c14" stroke-width="5" fill="none"/>`;
      /* 一樓：門面與條紋遮陽棚 */
      o+=`<rect x="${-w*.38}" y="${r1(-h1+6)}" width="${r1(w*.76)}" height="${r1(h1-6)}" fill="#120a11"/>
      <rect x="${-w*.3}" y="${r1(-h1+22)}" width="${r1(w*.6)}" height="${r1(h1-22)}" fill="#ffb457" opacity=".34"/>`;
      let aw=''; const n=7;
      for(let i=0;i<n;i++){const ax=-w*.4+i*(w*.8/n);aw+=`<path d="M${r1(ax)} ${r1(-h1+4)} h${r1(w*.8/n)} l${r1(w*.05*(i%2?1:-1)+2)} 20 h${r1(-w*.8/n)}Z" fill="${i%2?'#8e2017':'#3a1a1e'}"/>`;}
      o+=aw;
      /* 幌子（酒旗）：掛在屋簷邊 */
      const bx=f*(w/2-8);
      o+=`<g transform="translate(${r1(bx)} ${r1(-h1-4)})"><rect x="-1.5" y="-26" width="3" height="${r1(h1*.2+26)}" fill="#120a11"/><path d="M${f*2} -24 h${f*26} v${r1(h*.34)} l${f*-13} -8 l${f*-13} 8Z" fill="#8e2017"/><path d="M${f*2} -24 h${f*26} v${r1(h*.34)} l${f*-13} -8 l${f*-13} 8Z" fill="none" stroke="#f5dc92" stroke-width="1.6" opacity=".75"/><text x="${f*15}" y="${r1(h*.15)}" text-anchor="middle" font-size="19" fill="#f5dc92" font-family="serif">${sign}</text></g>`;
      return o+'</g>';
    };
    let o='';
    /* 遠處城門樓 */
    o+=`<g transform="translate(800 706)" fill="#1a1119"><rect x="-130" y="-70" width="260" height="70"/><rect x="-62" y="-70" width="124" height="70" fill="#0d070d"/><path d="M-62 0 V-48 Q0 -76 62 -48 V0Z" fill="#0d070d"/>
      <rect x="-90" y="-120" width="180" height="52"/><rect x="-26" y="-108" width="22" height="26" fill="#ffc26a" opacity=".7"/><rect x="4" y="-108" width="22" height="26" fill="#ffc26a" opacity=".7"/>
      <path d="M-150 -118 Q-70 -120 0 -172 Q70 -120 150 -118 Q70 -108 0 -112 Q-70 -108 -150 -118Z"/><rect x="-6" y="-186" width="12" height="20"/></g>`;
    /* 左右兩排商鋪，越靠近中間越小 */
    const L=[[-30,770,300,290],[250,752,230,250],[455,736,170,205],[600,724,120,150]];
    L.forEach((b,i)=>{o+=shop(b[0],b[1],b[2],b[3],body[i%3],signs[(i*2)%8],false);o+=shop(1600-b[0],b[1],b[2],b[3],body[(i+1)%3],signs[(i*2+1)%8],true);});
    /* 橫跨街道的燈籠串 */
    const str=(x0,y0,x1,y1,sag,n)=>{
      let g=`<path d="M${x0} ${y0} Q${(x0+x1)/2} ${(y0+y1)/2+sag} ${x1} ${y1}" stroke="#120a11" stroke-width="2.4" fill="none"/>`;
      for(let i=1;i<n;i++){const t=i/n,x=(1-t)*(1-t)*x0+2*t*(1-t)*((x0+x1)/2)+t*t*x1,y=(1-t)*(1-t)*y0+2*t*(1-t)*((y0+y1)/2+sag)+t*t*y1;
        g+=`<circle cx="${r1(x)}" cy="${r1(y+14)}" r="30" fill="url(#lg${u})"/><rect x="${r1(x-5)}" y="${r1(y-1)}" width="10" height="4" fill="#2a160e"/><ellipse cx="${r1(x)}" cy="${r1(y+14)}" rx="9" ry="12" fill="#e9852e"/><ellipse cx="${r1(x)}" cy="${r1(y+14)}" rx="9" ry="12" fill="url(#lf${u})"/><path d="M${r1(x)} ${r1(y+26)}v10" stroke="#c9482b" stroke-width="2"/>`;}
      return g;
    };
    o+=str(300,400,1300,400,120,9)+str(200,470,1400,470,80,11)+str(480,350,1120,350,90,6);
    return `<g>${o}</g>`;
  },
  /* 監獄衙門：森嚴的衙門大門（匾額、肅靜迴避牌、鳴冤鼓、石獅）、高牆、望樓與牢房，火把照亮（沒有任何人物） */
  yamen(r,S,u){
    const c='#1a1520', c2='#241d2c', c3='#2e2638';
    let o='';
    /* 高牆（左右延伸）與磚縫 */
    o+=`<rect x="-20" y="560" width="1640" height="200" fill="${c2}"/><rect x="-20" y="548" width="1640" height="16" fill="${c}"/>`;
    for(let i=0;i<41;i++)o+=`<path d="M${i*40-20} 548 l6 -10 h28 l6 10Z" fill="${c}"/>`;
    for(let y=590;y<760;y+=34)o+=`<path d="M-20 ${y}H1620" stroke="#120e18" stroke-width="2" opacity=".6"/>`;
    for(let k=0;k<26;k++){const y0=590+Math.floor(r()*5)*34,x=r()*1600;o+=`<path d="M${r1(x)} ${y0}v34" stroke="#120e18" stroke-width="2" opacity=".5"/>`;}
    /* 左：望樓 */
    o+=`<g transform="translate(260 560)" fill="${c}"><rect x="-70" y="-190" width="140" height="190" fill="${c3}"/><rect x="-82" y="-200" width="164" height="14"/>
      <path d="M-110 -196 Q-50 -200 0 -270 Q50 -200 110 -196 Q50 -184 0 -190 Q-50 -184 -110 -196Z"/><rect x="-5" y="-290" width="10" height="26"/>
      <rect x="-14" y="-150" width="28" height="42" fill="#0d0910"/><rect x="-14" y="-150" width="28" height="42" fill="#ffb457" opacity=".28"/><path d="M-6 -150v42M6 -150v42" stroke="#0d0910" stroke-width="3"/></g>`;
    /* 右：牢房（小窗與鐵欄杆、厚重鐵門） */
    o+=`<g transform="translate(1290 560)"><rect x="-190" y="-120" width="380" height="120" fill="${c3}"/><rect x="-206" y="-132" width="412" height="16" fill="${c}"/>
      ${[-140,-70,0,70,140].map((x,i)=>`<rect x="${x-18}" y="-92" width="36" height="34" fill="#0d0910"/><rect x="${x-18}" y="-92" width="36" height="34" fill="#ffb457" opacity="${i%2?.1:.22}"/><path d="M${x-9} -92v34M${x} -92v34M${x+9} -92v34" stroke="#3a3446" stroke-width="3"/>`).join('')}
      <rect x="-30" y="-64" width="60" height="64" fill="#0d0910" stroke="#4b4458" stroke-width="3"/><path d="M-30 -40H30M-30 -20H30" stroke="#4b4458" stroke-width="3"/><circle cx="0" cy="-32" r="5" fill="#6a6276"/></g>`;
    /* 中：衙門大門 */
    o+=`<g transform="translate(800 760)">
      <rect x="-250" y="-18" width="500" height="22" fill="#2a2230"/><rect x="-230" y="-38" width="460" height="22" fill="#30283a"/><rect x="-210" y="-58" width="420" height="22" fill="#383044"/>
      <rect x="-190" y="-260" width="380" height="204" fill="${c3}"/>
      <rect x="-170" y="-240" width="340" height="184" fill="#0d0910"/>
      ${[-110,0,110].map((x,i)=>`<rect x="${x-50}" y="-224" width="100" height="168" fill="${i==1?'#7a1f1a':'#5e1a18'}" stroke="#2a0c0c" stroke-width="3"/><path d="M${x} -224V-56" stroke="#2a0c0c" stroke-width="3"/>${[0,1,2,3].map(k=>[0,1,2,3,4].map(m=>`<circle cx="${x-40+m*20}" cy="${-205+k*32}" r="3.2" fill="#d6a845"/>`).join('')).join('')}`).join('')}
      <rect x="-210" y="-270" width="20" height="214" fill="#6e2018"/><rect x="190" y="-270" width="20" height="214" fill="#6e2018"/><rect x="-96" y="-270" width="12" height="214" fill="#6e2018"/><rect x="84" y="-270" width="12" height="214" fill="#6e2018"/>
      <rect x="-230" y="-290" width="460" height="26" fill="#6e2018"/><rect x="-230" y="-264" width="460" height="8" fill="#2a0c0c"/>
      <g fill="${c}"><path d="M-300 -290 Q-150 -292 0 -380 Q150 -292 300 -290 Q150 -270 0 -278 Q-150 -270 -300 -290Z"/><path d="M-230 -350 Q-110 -352 0 -430 Q110 -352 230 -350 Q110 -334 0 -342 Q-110 -334 -230 -350Z"/>
      <rect x="-210" y="-352" width="420" height="62" fill="#221a29"/><rect x="-10" y="-452" width="20" height="30"/><path d="M-30 -428 q30 -26 60 0Z"/><path d="M-300 -290 q-14 -4 -22 -22 M300 -290 q14 -4 22 -22" stroke="${c}" stroke-width="7" fill="none"/></g>
      <rect x="-86" y="-342" width="172" height="46" fill="#120c0f" stroke="#c9a24a" stroke-width="3"/><text x="0" y="-308" text-anchor="middle" font-size="34" fill="#e8c76a" font-family="serif" letter-spacing="14">衙門</text>
    </g>`;
    /* 肅靜、迴避牌 */
    [[470,'肅靜'],[1130,'迴避']].forEach(b=>{o+=`<g transform="translate(${b[0]} 760)"><rect x="-4" y="-150" width="8" height="150" fill="#120c10"/><rect x="-34" y="-250" width="68" height="124" rx="3" fill="#e7dcc0"/><rect x="-30" y="-246" width="60" height="116" fill="none" stroke="#121018" stroke-width="2"/><text x="0" y="-206" text-anchor="middle" font-size="30" fill="#1a1016" font-family="serif">${b[1][0]}</text><text x="0" y="-166" text-anchor="middle" font-size="30" fill="#1a1016" font-family="serif">${b[1][1]}</text></g>`;});
    /* 鳴冤鼓 */
    o+=`<g transform="translate(1250 760)"><path d="M-46 0L-36 -90M46 0L36 -90M-40 -50H40" stroke="#120c10" stroke-width="7" fill="none"/><ellipse cx="0" cy="-92" rx="40" ry="40" fill="#6e2018"/><ellipse cx="0" cy="-92" rx="40" ry="40" fill="none" stroke="#2a0c0c" stroke-width="5"/><ellipse cx="0" cy="-92" rx="30" ry="30" fill="#8a2a22"/><circle cx="0" cy="-92" r="6" fill="#d6a845"/></g>`;
    /* 石獅（簡化剪影） */
    [[560,1],[1040,-1]].forEach(b=>{o+=`<g transform="translate(${b[0]} 760) scale(${b[1]} 1)" fill="#3a3248"><rect x="-34" y="-30" width="68" height="30"/><path d="M-22 -30 q-6 -34 4 -52 q12 -26 34 -18 q14 6 10 24 q-4 14 -10 24 q10 8 8 22Z"/><circle cx="6" cy="-84" r="13"/><path d="M-10 -92 q-14 -6 -14 8 q4 14 12 12 M20 -92 q14 -4 14 10 q-4 12 -10 10" fill="none" stroke="#3a3248" stroke-width="8"/></g>`;});
    /* 火把 */
    [[700,'a'],[900,'b']].forEach(b=>{o+=`<g transform="translate(${b[0]} 700)"><circle cx="0" cy="-60" r="96" fill="url(#lg${u})"/><rect x="-3" y="-60" width="6" height="64" fill="#2a160e"/><path d="M0 -112 q-15 22 -9 44 q9 12 18 0 q6 -22 -9 -44Z" fill="#ff9a3c"/><path d="M0 -96 q-8 14 -5 28 q5 6 10 0 q3 -14 -5 -28Z" fill="#ffe19a"/></g>`;});
    /* 屋簷下的白燈籠 */
    [[600,-250],[1000,-250]].forEach(b=>{});
    return `<g>${o}</g>`;
  },
  steles(r,S){let o='';for(let i=0;i<28;i++){const x=40+i*56+r()*20,h=90+r()*130,y=700+r()*120,w=34+r()*16;o+=`<path d="M${r1(x)} ${r1(y)} v${-h} q${w/2} -14 ${r1(w)} 0 v${h}Z" fill="${i%3?'#2b2745':'#34305a'}" stroke="#4d4880" stroke-width="1.5" opacity="${r1(.65+r()*.35)}"/>`}return o},
  mist(r,S){return `<g fill="#aeb0d8" opacity=".12"><ellipse cx="400" cy="720" rx="520" ry="46"/><ellipse cx="1200" cy="770" rx="560" ry="50"/><ellipse cx="800" cy="650" rx="680" ry="34"/></g>`},
  plank(r,S){
    return `<g><path d="M0 740 L1000 540 L1000 580 L0 810Z" fill="#2a1d1b"/><path d="M0 740 L1000 540" stroke="#4d3a30" stroke-width="5"/>
    ${[...Array(16)].map((_,i)=>`<path d="M${i*64} ${742-i*12.5} l-12 70" stroke="#16100f" stroke-width="6"/>`).join('')}
    <path d="M560 560 L760 520 L760 510 L560 548Z" fill="#5a4234"/>
    <rect x="380" y="590" width="46" height="150" fill="#1a1210" transform="rotate(-12 380 590)"/></g>`;
  },
  clouds(r,S){let o='';for(let i=0;i<9;i++){o+=`<ellipse cx="${r1(r()*1600)}" cy="${r1(520+r()*260)}" rx="${r1(220+r()*340)}" ry="${r1(26+r()*30)}" fill="#fff" opacity=".28"/>`}return `<g filter="url(#bl_)">${o}</g>`},
  mossrocks(r,S){let o='';for(let i=0;i<14;i++){const x=r()*1600,y=720+r()*160,w=90+r()*180;o+=`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(w)}" ry="${r1(w*.32)}" fill="${i%2?'#223538':'#2c4244'}"/>`}return o},
  stonepath(r,S){
    let o='<path d="M690 900 Q760 780 760 700 Q780 650 800 640 Q820 650 840 700 Q840 780 910 900Z" fill="#8a6a58" opacity=".55"/>';
    for(let i=0;i<7;i++){const y=880-i*38,w=150-i*16;o+=`<ellipse cx="${r1(800+(i%2?10:-10))}" cy="${y}" rx="${w}" ry="${r1(11-i*.8)}" fill="#a2806a" opacity="${r1(.5-i*.05)}"/>`}
    return o;
  },
  cracks(r,S){let o='<g stroke="#120a0c" stroke-width="2.4" fill="none" opacity=".8">';for(let k=0;k<7;k++){let x=r()*1500+50,y=780+r()*100,p=`M${r1(x)} ${r1(y)}`;for(let i=0;i<6;i++){x+=(r()-.5)*150;y+=(r()-.3)*28;p+=` L${r1(x)} ${r1(y)}`}o+=`<path d="${p}"/>`}return o+'</g>'},
  petalsGround(r,S){let o='';for(let i=0;i<60;i++)o+=`<ellipse cx="${r1(r()*1600)}" cy="${r1(790+r()*100)}" rx="${r1(4+r()*5)}" ry="2.5" fill="#f6b9c4" opacity=".7" transform="rotate(${r1(r()*360)} 0 0)"/>`;return o}
};
function pine(x,y,s,c,r){
  let o=`<path d="M-26 140 Q-12 40 -18 -40 Q-34 -110 -10 -190 Q-2 -240 20 -270 L28 -262 Q10 -230 12 -190 Q36 -120 22 -40 Q24 40 34 140Z" fill="${c}"/>`;
  const cl=[[-90,-190,110,34],[80,-230,120,36],[-40,-290,130,38],[110,-130,90,28],[-120,-110,86,26]];
  for(const[cx,cy,rx,ry]of cl)o+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}"/><ellipse cx="${cx+20}" cy="${cy-18}" rx="${rx*.6}" ry="${ry*.6}" fill="${c}"/>`;
  o+=`<path d="M-200 140 Q-120 100 0 112 Q120 100 220 150 L220 200 L-200 200Z" fill="${c}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${o}</g>`;
}

function sceneSVG(key,seed){
  const S0=SCN[key]||SCN.road;const pal=PAL[S0.p];const S={...S0,pal};
  const r=RNG((seed||1)*7919+key.length*131+key.charCodeAt(0));
  const u='s'+(++_sid);
  const[c0,c1,c2,c3]=pal.sky;const[sx,sy,sr,sc]=pal.sun;
  let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
  <linearGradient id="sk${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset=".4" stop-color="${c1}"/><stop offset=".72" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
  <radialGradient id="sg${u}"><stop offset="0" stop-color="${sc}" stop-opacity=".95"/><stop offset=".22" stop-color="${sc}" stop-opacity=".5"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>
  <linearGradient id="mi${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pal.haze}" stop-opacity="0"/><stop offset="1" stop-color="${pal.haze}" stop-opacity=".6"/></linearGradient>
  <linearGradient id="wf${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#dff0f2" stop-opacity=".25"/></linearGradient>
  <linearGradient id="rv${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c2}" stop-opacity=".9"/><stop offset="1" stop-color="${pal.ridges[2]}" stop-opacity=".95"/></linearGradient>
  <radialGradient id="lg${u}"><stop offset="0" stop-color="#ffb457" stop-opacity=".75"/><stop offset="1" stop-color="#ffb457" stop-opacity="0"/></radialGradient>
  <radialGradient id="lf${u}"><stop offset="0" stop-color="#ffe19a" stop-opacity=".95"/><stop offset="1" stop-color="#ffe19a" stop-opacity="0"/></radialGradient>
  <filter id="bl${u}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="bl_" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
  <linearGradient id="gd${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.ground}"/><stop offset="1" stop-color="#0d0709"/></linearGradient></defs>`;
  o+=`<rect width="1600" height="900" fill="url(#sk${u})"/>`;
  o+=`<circle cx="${sx}" cy="${sy}" r="${sr*5.5}" fill="url(#sg${u})"/>`;
  if(pal.moon)o+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#f6f0d8"/><circle cx="${sx+14}" cy="${sy-8}" r="${sr*.92}" fill="${c0}" opacity=".0"/>`;
  else o+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${sc}"/>`;
  // 雲霞
  o+=`<g filter="url(#bl${u})">`;
  for(let i=0;i<9;i++)o+=`<ellipse cx="${r1(r()*1700-50)}" cy="${r1(70+r()*340)}" rx="${r1(160+r()*340)}" ry="${r1(9+r()*18)}" fill="${i%2?c3:c1}" opacity="${r1(.3+r()*.3)}"/>`;
  o+='</g>';
  // 遠山層
  const rs=pal.ridges;
  rs.forEach((c,i)=>{
    const base=470+i*78,amp=150+i*10;
    o+=`<path d="${ridgePath(r,base,amp,r()*6.28,1+i*.3)}" fill="${c}"/>`;
    if(i<rs.length-1)o+=`<rect x="0" y="${base-amp*.6}" width="1600" height="${amp*.6+90}" fill="url(#mi${u})"/>`;
  });
  // 景物
  (S.feat||[]).forEach(n=>{if(F[n])o+=F[n](r,S,u)});
  // 前景
  o+=`<path d="M-20 900 L-20 ${S.cracked?800:772} Q300 ${S.cracked?770:730} 700 ${S.cracked?790:760} Q1100 ${S.cracked?770:748} 1620 ${S.cracked?800:780} L1620 900Z" fill="url(#gd${u})"/>`;
  o+=`<rect x="0" y="${S.cracked?790:752}" width="1600" height="150" fill="url(#mi${u})" opacity=".18"/>`;
  return o+'</svg>';
}

/* ================= 水墨小景（選項卡、難度卡、身份印章底圖） ================= */
function inkMini(seed,tint,kind){
  const r=RNG(seed*131+7);const u='m'+(++_sid);
  const ink='#2b2320';
  let o=`<svg class="mini" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
  <linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tint[0]}"/><stop offset="1" stop-color="${tint[1]}"/></linearGradient>
  <filter id="${u}b"><feGaussianBlur stdDeviation="1.4"/></filter></defs><rect width="200" height="150" fill="url(#${u}p)"/>`;
  o+=`<circle cx="${r1(40+r()*120)}" cy="${r1(26+r()*18)}" r="12" fill="#f4e4bd" opacity=".55"/>`;
  for(let i=0;i<3;i++){
    const base=82+i*22,amp=34-i*5;let d=`M-10 160 L-10 ${base}`;
    for(let x=-10;x<=210;x+=22)d+=` L${x+11} ${r1(base-amp*r()*(.6+i*.25))}`;
    o+=`<path d="${d} L210 160Z" fill="${ink}" opacity="${r1(.22+i*.2)}" filter="url(#${u}b)"/>`;
  }
  if(kind==='pagoda')o+=`<g transform="translate(150 78) scale(.4)">${pagoda(0,0,1,ink)}</g>`;
  if(kind==='tree')o+=`<path d="M52 134 q4 -40 -2 -70" stroke="${ink}" stroke-width="3" fill="none"/><ellipse cx="50" cy="60" rx="24" ry="13" fill="${ink}" opacity=".7"/><ellipse cx="68" cy="72" rx="18" ry="9" fill="${ink}" opacity=".6"/>`;
  if(kind==='rocks')o+=`<path d="M120 140 L132 96 L150 90 L162 112 L180 98 L192 140Z" fill="${ink}" opacity=".78"/><path d="M30 140 L42 110 L60 104 L74 140Z" fill="${ink}" opacity=".6"/>`;
  if(kind==='boat')o+=`<path d="M60 112 Q100 128 142 110 Q100 120 60 112Z" fill="${ink}"/><path d="M100 112 V78 M100 80 L124 108 L100 108Z" stroke="${ink}" fill="${ink}" opacity=".85"/>`;
  return o+'</svg>';
}
function sealEmblem(char,seed){
  return `<div class="emblem">${inkMini(seed,['#d9c7a0','#a58a63'],['pagoda','tree','rocks'][seed%3])}<span class="seal">${esc(char)}</span></div>`;
}

/* ================= 圖示（物件、符號；沒有人物） ================= */
const IC={
  talk:'<path d="M6 10 H34 Q38 10 38 14 V26 Q38 30 34 30 H20 L12 37 V30 H10 Q6 30 6 26 V14 Q6 10 10 10Z"/><circle cx="16" cy="20" r="1.6" fill="currentColor"/><circle cx="22" cy="20" r="1.6" fill="currentColor"/><circle cx="28" cy="20" r="1.6" fill="currentColor"/>',
  watch:'<path d="M4 22 Q22 6 40 22 Q22 38 4 22Z"/><circle cx="22" cy="22" r="6"/><circle cx="22" cy="22" r="2" fill="currentColor"/>',
  leave:'<path d="M8 38 Q18 30 14 24 Q10 18 22 14 Q34 10 30 4"/><path d="M26 6 L31 3 L34 9"/><path d="M6 40 H18"/>',
  scroll:'<rect x="9" y="7" width="26" height="30" rx="2"/><path d="M14 14H30M14 20H30M14 26H26"/><path d="M6 7Q6 3 10 3H34M6 37Q6 41 10 41H34"/>',
  fight:'<path d="M8 36 L32 8 M12 40 L38 12"/><path d="M30 6 L38 8 L40 16"/><path d="M6 34 L10 38"/>',
  coin:'<circle cx="22" cy="22" r="15"/><rect x="17" y="17" width="10" height="10"/>',
  herb:'<path d="M22 40 V16"/><path d="M22 28 Q10 28 8 16 Q20 16 22 28Z"/><path d="M22 22 Q34 22 36 10 Q24 10 22 22Z"/><path d="M16 40 H28"/>',
  bat:'<path d="M6 38 L30 14 Q36 8 38 6 Q38 12 32 18 L10 40Z"/><circle cx="12" cy="12" r="6"/><path d="M9 9 Q12 12 9 15 M15 9 Q12 12 15 15"/>',
  rest:'<path d="M30 8 A14 14 0 1 0 38 30 A11 11 0 0 1 30 8Z"/><path d="M6 38 H40"/>',
  dice:'<rect x="8" y="8" width="28" height="28" rx="5"/><circle cx="16" cy="16" r="2" fill="currentColor"/><circle cx="28" cy="16" r="2" fill="currentColor"/><circle cx="22" cy="22" r="2" fill="currentColor"/><circle cx="16" cy="28" r="2" fill="currentColor"/><circle cx="28" cy="28" r="2" fill="currentColor"/>',
  boat:'<path d="M6 28 H38 Q34 38 24 38 H16 Q8 38 6 28Z"/><path d="M22 28 V8 M22 10 L34 24 H22Z"/><path d="M4 42 Q10 38 16 42 T28 42 T40 42"/>',
  scale:'<path d="M22 8 V36 M12 36 H32 M8 14 H36"/><path d="M8 14 L3 26 H13Z M36 14 L31 26 H41Z"/>',
  drink:'<path d="M10 12 H34 L30 32 Q29 36 25 36 H19 Q15 36 14 32Z"/><path d="M22 36 V42 M15 42 H29"/><path d="M13 20 H31"/>',
  ball:'<circle cx="22" cy="22" r="16"/><path d="M10 12 Q18 22 10 32 M34 12 Q26 22 34 32"/><path d="M11 17 l4 1 M12 22 l5 0 M11 27 l4 -1 M33 17 l-4 1 M32 22 l-5 0 M33 27 l-4 -1"/>',
  hat:'<path d="M4 28 L22 6 L40 28Z"/><path d="M4 28 Q22 36 40 28"/><path d="M14 31 Q22 36 30 31"/>',
  tear:'<path d="M8 8 H20 L24 14 L18 20 L26 26 L20 32 L30 38 H8Z"/><path d="M26 8 H36 V36 H32"/>',
  path:'<path d="M14 40 Q10 30 20 26 Q34 20 24 12 Q20 8 22 4"/><path d="M18 40 Q16 32 24 29"/>',
  bag:'<path d="M14 14 Q22 4 30 14"/><path d="M12 14 H32 L36 36 Q36 40 32 40 H12 Q8 40 8 36Z"/><path d="M16 22 Q22 28 28 22"/>',
  tool:'<path d="M10 36 L26 20"/><path d="M26 20 Q22 10 30 6 L34 10 L30 14 L34 18 L38 14 Q40 22 32 24 Q30 26 26 20Z"/>',
  moon:'<path d="M30 8 A14 14 0 1 0 38 30 A11 11 0 0 1 30 8Z"/>',
  gate:'<path d="M6 12 H38 M10 18 H34 M12 12 V40 M32 12 V40"/>',
  sword:'<path d="M12 32 L34 10 L36 8 L34 14 L16 36Z"/><path d="M8 30 L18 40 M10 40 L8 42"/>',
  trophy:'<path d="M14 8 H30 V20 Q30 28 22 28 Q14 28 14 20Z"/><path d="M14 12 H8 Q8 22 14 22 M30 12 H36 Q36 22 30 22"/><path d="M22 28 V34 M14 38 H30 M16 34 H28"/>',
  book:'<path d="M6 10 Q16 6 22 12 Q28 6 38 10 V36 Q28 32 22 38 Q16 32 6 36Z"/><path d="M22 12 V38"/>',
  image:'<rect x="5" y="8" width="34" height="28" rx="2"/><path d="M5 30 L14 20 L22 28 L28 22 L39 32"/><circle cx="29" cy="15" r="3"/>',
  gear:'<circle cx="22" cy="22" r="6"/><path d="M22 6 V11 M22 33 V38 M6 22 H11 M33 22 H38 M11 11 L14.5 14.5 M29.5 29.5 L33 33 M11 33 L14.5 29.5 M29.5 14.5 L33 11"/>',
  menu:'<path d="M10 12 H34 M10 22 H34 M10 32 H34"/><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="6" cy="22" r="1.4" fill="currentColor"/><circle cx="6" cy="32" r="1.4" fill="currentColor"/>',
  heart:'<path d="M22 38 Q6 26 6 16 Q6 8 14 8 Q20 8 22 14 Q24 8 30 8 Q38 8 38 16 Q38 26 22 38Z"/>',
  atk:'<path d="M8 36 L30 12 L34 8 L36 10 L32 16 L12 38Z"/><path d="M6 32 L14 40"/>',
  def:'<path d="M22 5 L38 11 V22 Q38 33 22 40 Q6 33 6 22 V11Z"/>',
  silver:'<ellipse cx="22" cy="28" rx="14" ry="8"/><path d="M8 28 V22 Q8 30 22 30 Q36 30 36 22 V28"/><ellipse cx="22" cy="20" rx="12" ry="7"/>',
  potion:'<path d="M18 6 H26 M20 6 V14 L10 32 Q8 38 14 38 H30 Q36 38 34 32 L24 14 V6"/><path d="M13 28 H31"/>',
  ethos:'<circle cx="22" cy="22" r="15"/><path d="M22 7 A7.5 7.5 0 0 1 22 22 A7.5 7.5 0 0 0 22 37"/><circle cx="22" cy="14.5" r="2" fill="currentColor"/>',
  dice2:'<path d="M22 4 L38 14 V30 L22 40 L6 30 V14Z M6 14 L22 24 L38 14 M22 24 V40"/>'
};
function icon(n,cls){return `<svg class="${cls||''}" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||IC.scroll}</svg>`}

/* 石頭、剪刀、布：以器物表示，不使用手勢圖 */
const MOVE_ICON=[
  `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 44 L8 30 L18 14 L36 8 L54 18 L57 38 L46 54 L24 56Z" fill="#8b8479" stroke="#2a211c" stroke-width="3" stroke-linejoin="round"/><path d="M18 14 L26 28 L8 30 M26 28 L36 8 M26 28 L40 32 L54 18 M40 32 L46 54 M26 28 L24 56 M40 32 L57 38" fill="none" stroke="#2a211c" stroke-opacity=".55" stroke-width="2"/><path d="M20 18 L34 12 L30 22Z" fill="#fff" opacity=".35"/></svg>`,
  `<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#2a211c" stroke-width="2.5" stroke-linejoin="round"><path d="M30 34 L50 6 L54 10 L38 38Z" fill="#d6dbe0"/><path d="M34 34 L14 6 L10 10 L26 38Z" fill="#c4cad0"/></g><g fill="none" stroke="#c6872e" stroke-width="5"><circle cx="21" cy="48" r="8"/><circle cx="43" cy="48" r="8"/></g><circle cx="32" cy="35" r="3.4" fill="#2a211c"/></svg>`,
  `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 14 Q20 6 32 14 T56 14 V46 Q44 54 32 46 T8 46Z" fill="#e8dcc0" stroke="#2a211c" stroke-width="3" stroke-linejoin="round"/><path d="M20 12 V46 M32 14 V46 M44 12 V50" stroke="#2a211c" stroke-opacity=".3" stroke-width="2" fill="none"/><path d="M8 14 Q20 6 32 14 T56 14" fill="none" stroke="#a8291c" stroke-width="3"/></svg>`
];
const MOVE_NAME=['石頭','剪刀','布'];

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

export {sceneSVG,inkMini,sealEmblem,icon,MOVE_ICON,MOVE_NAME,esc,RNG};
