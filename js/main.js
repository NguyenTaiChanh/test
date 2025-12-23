// ==================== js/main.js – BẢN GỌN SẠCH NHẤT ====================
const gameArea = document.querySelector(".game-area");
const canvas = document.createElement("canvas");
gameArea.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Đầu main.js, sau const ctx = ...
let mapLoaded = false;

fetch("full_isometric_map.json")
  .then(r => r.json())
  .then(data => {
      gameMap.load(data);
      mapLoaded = true;
      if (loaded >= total && mapLoaded) startGame();
  })
  .catch(err => console.error("Map load error:", err));

// Sửa onLoad:
const onLoad = () => {
    loaded++;
    if (loaded >= total && mapLoaded) startGame();
};



function createNPCs() {
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const npc = new NPC(x, y, (i % 10) + 1, names[i]);
        npcs.push(npc);
    }
    console.log("10 NPCs created!");
}

// Thêm vào startGame()
function startGame() {
    if (npcs.length === 0) {
        createNPCs(); // Hàm tạo NPC (phải có trong main.js)
    }
    console.log("Game started! Running gameLoop...");
    requestAnimationFrame(gameLoop);
}

function resize() {
    const rect = gameArea.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resize();
window.addEventListener("resize", resize);

// Global
window.sheets = {};
window.sleepSheets = {};
window.npcPaused = false;
window.npcSleepMode = false;
const npcs = [];
const names = ["Nam", "Hưng", "Hùng", "Mạnh", "Thiên", "Phong", "Yến", "Kim", "Tú", "Lan"];

let loaded = 0;
const totalSprites = 30; // 10 a + 10 b + 10 sleep = 30, chỉnh nếu khác

const handleImageLoad = () => {
    loaded++;
    console.log(`Sprite loaded: ${loaded}/${totalSprites}`);
    if (loaded >= totalSprites && mapLoaded) {
        console.log("All assets ready! Starting game...");
        startGame();
    }
};

// Load walk sprites
for (let i = 1; i <= 10; i++) {
    const straight = new Image();
    straight.src = `img/npc/Nam${i}a.png`;
    straight.onload = handleImageLoad;

    const diagonal = new Image();
    diagonal.src = `img/npc/Nam${i}b.png`;
    diagonal.onload = handleImageLoad;

    window.sheets[i] = { straight, diagonal };
}

// Load sleep sprites
for (let i = 1; i <= 10; i++) {
    const sleepImg = new Image();
    sleepImg.src = `img/action/Nam${i}sleep.png`;
    sleepImg.onload = handleImageLoad;
    window.sleepSheets[i] = sleepImg;
}
Object.values(window.sheets).forEach(s => s.straight.onload = s.diagonal.onload = onLoad);
Object.values(window.sleepSheets).forEach(img => img.onload = onLoad);

function createNPCs() {
    if (npcs.length > 0) return;
    for (let i = 0; i < 10; i++) {
        npcs.push(new NPC(300 + i * 120 + Math.random() * 100, 300 + Math.random() * 300, i + 1, names[i]));
    }
}

let lastTime = 0;
function gameLoop(ts) {
    if (!lastTime) lastTime = ts;
    const dt = Math.min(ts - lastTime, 50);
    lastTime = ts;

    ctx.fillStyle = "#0a1a2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.gameMap.draw();
    npcs.forEach(npc => { npc.update(dt); npc.draw(); });
    window.thoai?.update(dt);
    window.thoai?.draw();

    requestAnimationFrame(gameLoop);
}

setTimeout(() => { if (!npcs.length) { createNPCs(); requestAnimationFrame(gameLoop); } }, 5000);

// Nút điều khiển
document.getElementById('pause-npc-btn')?.addEventListener('click', () => {
    window.npcPaused = !window.npcPaused;
    const b = document.getElementById('pause-npc-btn');
    b.textContent = window.npcPaused ? 'Tiếp Tục NPC' : 'Dừng NPC';
    b.classList.toggle('paused');
});

document.getElementById('sleep-btn')?.addEventListener('click', () => {
    window.npcSleepMode = !window.npcSleepMode;
    const b = document.getElementById('sleep-btn');
    b.textContent = window.npcSleepMode ? 'Thức Dậy' : 'Ngủ';
    b.classList.toggle('sleeping');
    if (!window.npcSleepMode) {
        npcs.forEach(n => n.dir = Math.floor(Math.random() * 8));
    }
});

// Click NPC → hiện profile (gọi từ profile.js)
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const npc of npcs) {
        if (Math.hypot(mx - npc.x, my - npc.y) < 50 && !window.npcSleepMode) {
            window.showNPCProfile(npc);
            return;
        }
    }
    window.hideNPCProfile?.();
});

document.getElementById("skill-btn")?.addEventListener("click", () => {
    if (typeof window.toggleSkillPanel === "function") {
        window.toggleSkillPanel();
    } else {
        console.error("Bảng kỹ năng chưa load xong!");
    }
});

// Nếu nút của mày không có id, dùng class hoặc text
// Dùng cách này chắc chắn chạy 100%:
document.querySelector(".center button:nth-child(4)")?.addEventListener("click", () => {
    window.toggleSkillPanel?.();
});




