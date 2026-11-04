/* ==================== 場景圖片渲染（目前遊戲中尚未使用，保留備用） ==================== */

/*顯示圖片，沒有路徑時恢復預設畫面*/
export function showImage(scene, imagePath = "", altText = "遊戲場景"){

    // 沒有圖片路徑，恢復預設畫面
    if(!imagePath){
        clearImage(scene);
        return;
    };

    // 清空原本內容
    scene.innerHTML = "";

    // 建立圖片
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = altText;

    // 圖片載入失敗
    img.onerror = function(){
        clearImage(scene);
    };

    scene.appendChild(img);
};

/*清除圖片，恢復預設畫面*/
export function clearImage(scene){

    const defaultContent = scene.id === "game-scene"
        ? `<div class="scene-default">
               <p>江湖場景</p>
               <span>此處預留給背景圖或人物立繪</span>
           </div>`
        : `<div class="scene-default">
               <p>王關場景</p>
               <span>此處預留給王的立繪或背景圖</span>
           </div>`;

    scene.innerHTML = defaultContent;
};
