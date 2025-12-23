// js/profile.js – Profile mini khi click NPC (riêng biệt, dễ quản lý)
(function () {
    // Tạo UI
    const profileUI = document.createElement("div");
    profileUI.id = "profile-ui";
    profileUI.style.cssText = `
        position: fixed;
        top: 70px; left: 10px;
        width: 200px;
        background: rgba(5, 15, 30, 0.95);
        border: 2px solid #7b2cbf;
        border-radius: 12px;
        padding: 16px;
        color: #fff;
        font-family: Arial, sans-serif;
        box-shadow: 0 0 20px rgba(123, 44, 191, 0.6);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s, transform 0.3s;
        transform: translateY(-20px);
    `;
    profileUI.innerHTML = `
        <div style="text-align:center; margin-bottom:12px;">
            <img id="prof-img" width="96" height="96" style="border-radius:50%; border:3px solid #00eaff;">
        </div>
        <div style="font-size:18px; font-weight:bold; text-align:center;" id="prof-name"></div>
        <div style="margin:8px 0; color:#a0e7ff;">Tuổi: <span id="prof-age"></span></div>
        <div style="color:#cce7ff; line-height:1.4;" id="prof-quote"></div>
        <div style="margin-top:12px; color:#ff6b6b;">Độ lạ: <span id="prof-weird">?</span>%</div>
    `;
    document.body.appendChild(profileUI);

    // Dữ liệu profile
    const profiles = [
        null,
        { age: 28, quote: "Đêm nay lạnh quá...", weird: 72 },		//1.Nam
        { age: 25, quote: "Đừng lại gần tao...", weird: 88 },		//2.Hưng
        { age: 31, quote: "Tao thấy mày từ nãy giờ rồi.", weird: 95 }, 	//3.Hùng
        { age: 29, quote: "Muốn hút thuốc không?", weird: 65 },		//4.Mạnh
        { age: 26, quote: "Có nghe thấy tiếng gì không?", weird: 80 },	//5.Thiên
        { age: 33, quote: "Đừng tin ai ở đây.", weird: 90 },		//6.Phong
        { age: 35, quote: "Chờ đến lượt mày đi.", weird: 54 },		//7.Kim
        { age: 25, quote: "Đến lượt ai rồi?", weird: 45 },		//8.Yến
        { age: 29, quote: "Đến khi nào mới xong đây?", weird: 15 },	//9.Tú
        { age: 38, quote: "Tao chỉ đang... chờ ai đó.", weird: 0 },	//10.Lan
    ];

    // Hàm công khai để main.js gọi
    window.showNPCProfile = (npc) => {
        document.getElementById("prof-name").textContent = npc.name;
        document.getElementById("prof-age").textContent = profiles[npc.id].age;
        document.getElementById("prof-quote").textContent = profiles[npc.id].quote;
        document.getElementById("prof-weird").textContent = profiles[npc.id].weird;
        document.getElementById("prof-img").src = `img/avt/avt${npc.id}.png`;

        profileUI.style.opacity = 1;
        profileUI.style.transform = "translateY(0)";
        profileUI.style.pointerEvents = "auto";
    };

    window.hideNPCProfile = () => {
        profileUI.style.opacity = 0;
        profileUI.style.transform = "translateY(-20px)";
    };

    // Click vào profile để tắt
    profileUI.addEventListener("click", () => window.hideNPCProfile());

    // Click ra ngoài canvas cũng tắt (tùy chọn)
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#profile-ui") && !e.target.closest(".game-area")) {
            window.hideNPCProfile();
        }
    });
})();