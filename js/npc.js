// js/npc.js 
class NPC {
    constructor(x, y, id, name) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.name = name;
        this.dir = Math.floor(Math.random() * 8);
        this.speed = 0.9 + Math.random() * 0.4;
        this.frame = 0;
        this.tick = 0;
        this.changeTimer = 1000 + Math.random() * 3000;
        this.idleTime = 0;
        this.spoken = false;
        this.lastX = x;
        this.lastY = y;
    }

    update(dt) {
        if (window.npcPaused || window.npcSleepMode) return;

        // Idle → hiện thoại
        const moved = Math.abs(this.x - this.lastX) > 0.2 || Math.abs(this.y - this.lastY) > 0.2;
        if (moved) {
            this.idleTime = 0;
            this.spoken = false;
        } else {
            this.idleTime += dt;
            if (this.idleTime > 5000 + Math.random() * 3000 && !this.spoken) {
                window.thoai?.them(this);
                this.spoken = true;
            }
        }
        this.lastX = this.x;
        this.lastY = this.y;

        // Đổi hướng ngẫu nhiên
        this.changeTimer -= dt;
        if (this.changeTimer <= 0) {
            this.dir = Math.floor(Math.random() * 8);
            this.changeTimer = 2000 + Math.random() * 4000;
        }

        // Di chuyển
        const s = this.speed * (this.dir > 3 ? 0.7 : 1) * dt / 16.66;
        const d = this.dir;
        if (d === 0) this.y += s;
        if (d === 1) this.x -= s;
        if (d === 2) this.x += s;
        if (d === 3) this.y -= s;
        if (d === 4) { this.x -= s; this.y += s; }
        if (d === 5) { this.x -= s; this.y -= s; }
        if (d === 6) { this.x += s; this.y += s; }
        if (d === 7) { this.x += s; this.y -= s; }

        // Giới hạn trong màn hình
        const b = 50;
        this.x = Math.max(b, Math.min(canvas.width - b, this.x));
        this.y = Math.max(b, Math.min(canvas.height - b, this.y));

        // Animation 8 frame
        this.tick += dt;
        if (this.tick > 80) {
            this.tick = 0;
            this.frame = (this.frame + 1) % 8;
        }
    }

    draw() {
        // NGỦ → nằm im đúng hướng
        if (window.npcSleepMode) {
            const sheet = window.sleepSheets[this.id];
            if (!sheet?.complete) return;

            const fh = sheet.height / 4;
            const frameMap = [0,1,3,0, 2,0,2,0]; // dir 0-7 → frame ngủ (0=ngửa, 1=trái, 2=sấp, 3=phải)
            const sy = frameMap[this.dir] * fh;
            const dw = sheet.width;
            const dh = fh;

            ctx.drawImage(sheet, 0, sy, dw, dh,
                this.x - dw/2, this.y - dh/2 + 10, dw, dh);
            return;
        }

        // ĐI BỘ bình thường
        const set = window.sheets[this.id];
        if (!set) return;
        const sheet = this.dir < 4 ? set.straight : set.diagonal;
        if (!sheet?.complete) return;

        const fw = sheet.width / 8;
        const fh = sheet.height / 4;
        const sx = this.frame * fw;
        const sy = (this.dir % 4) * fh;

        ctx.drawImage(sheet, sx, sy, fw, fh,
            this.x - fw/2, this.y - fh + 18, fw, fh);

        // Tên
        ctx.font = "bold 14px Arial";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.strokeText(this.name, this.x, this.y - fh + 4);
        ctx.fillText(this.name, this.x, this.y - fh + 4);
    }
}