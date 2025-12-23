// ==================== js/Thoai.js ====================
// HỘI THOẠI CHO NPC – BONG BÓNG CHAT KHI ĐỨNG YÊN
class Thoai {
    constructor() {
        this.list = []; // {npc, text, timeLeft}
        this.maxTime = 4000; // 4 giây hiện thoại
    }

    // Gọi khi NPC đứng yên lâu (hoặc ngẫu nhiên)
    them(npc, text = null) {
        if (!text) {
            const thoaiNgauNhien = [
                "Trời tối quá...",
                "Hôm nay có chuyện gì vậy?",
                "Ai đó đang theo dõi mình...",
                "Muốn hút điếu thuốc quá...",
                "Đợi ai đó tới sao?",
                "Tao thấy mày từ nãy giờ rồi.",
                "Hẹn gặp ở đâu nhỉ?",
                "Cái gì đang xảy ra vậy?",
		"Đến lượt ai rồi?",
		"Đừng tin ai ở đây...",
		"Chờ đến lượt mày đi",
		"Khi nào mới xong đây!?",
		"Cần tìm chỗ để dừng lại",
		"Cho tao dừng lại...!!!!"
            ];
            text = thoaiNgauNhien[Math.floor(Math.random() * thoaiNgauNhien.length)];
        }

        // Xóa thoại cũ của NPC này (nếu có)
        this.list = this.list.filter(t => t.npc !== npc);
        this.list.push({ npc, text, timeLeft: this.maxTime });
    }

    update(dt) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            this.list[i].timeLeft -= dt;
            if (this.list[i].timeLeft <= 0) {
                this.list.splice(i, 1);
            }
        }
    }

    draw() {
        this.list.forEach(item => {
            const { npc, text } = item;
            const x = npc.x;
            const y = npc.y - 90; // trên đầu NPC

            // Bong bóng chat
            ctx.font = "bold 16px Arial";
            const width = ctx.measureText(text).width + 24;
            const height = 36;

            // Nền bong bóng
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            ctx.roundRect(x - width/2, y - height, width, height, 16).fill();
            ctx.strokeStyle = "#7b2cbf";
            ctx.lineWidth = 3;
            ctx.roundRect(x - width/2, y - height, width, height, 16).stroke();

            // Chữ
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, x, y - height/2 + 2);

            // Tam giác chỉ xuống NPC
            ctx.beginPath();
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x, y + 12);
            ctx.lineTo(x + 10, y);
            ctx.closePath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
            ctx.fill();
            ctx.stroke();
        });
    }
}

// Tạo global
window.thoai = new Thoai();

// Hỗ trợ roundRect (cho bong bóng tròn)
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};