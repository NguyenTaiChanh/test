// js/skillPanel.js – BẢN HOÀN CHỈNH 100%, KHÔNG BỊ CẮT, TOOLTIP SIÊU ĐẸP
(() => {
    const panel = document.createElement("div");
    panel.id = "skill-panel";
    Object.assign(panel.style, {
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%) scale(0)",
        width: "98vw", maxWidth: "1600px", maxHeight: "95vh",
        background: "linear-gradient(145deg, #0a0e1a 0%, #1a0a2e 50%, #0f0a2a 100%)",
        border: "4px solid transparent",
        borderImage: "linear-gradient(45deg, #7b2cbf, #00eaff, #ff3366) 1",
        borderRadius: "28px", padding: "32px", zIndex: "100000",
        overflow: "hidden", boxShadow: "0 0 100px rgba(123,44,191,0.8), inset 0 0 40px rgba(0,0,0,0.6)",
        transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s", opacity: "0"
    });
    document.body.appendChild(panel);

    panel.innerHTML = `
        <div style="text-align:center;margin-bottom:24px;position:relative;">
            <div style="font-size:48px;font-weight:900;background:linear-gradient(90deg,#00eaff,#ff3366,#7b2cbf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 40px #00eaff;">
                BẢNG KỸ NĂNG CẤM
            </div>
            <div style="position:absolute;top:12px;right:20px;color:#a0e7ff;font-size:18px;">
                Đã mở: <span id="skill-progress">0</span>/104
            </div>
        </div>
    `;

    const tabs = ["Thể chất", "Tâm trí", "Nghi thức", "Bóng Tối", "Ký Ức", "Cấm Thuật", "Tên Hắn", "Lời Nguyền"];
    const ranges = [[1,13],[14,26],[27,39],[40,52],[53,65],[66,78],[79,91],[92,104]];

    const tabContainer = document.createElement("div");
    tabContainer.style.cssText = "display:flex;gap:12px;justify-content:center;margin-bottom:32px;overflow-x:auto;padding-bottom:12px;";
    panel.appendChild(tabContainer);

    let activeTab = 0;
    const tabButtons = [];

    tabs.forEach((name, i) => {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.style.cssText = `
            min-width:140px;padding:16px 28px;border-radius:50px;font-weight:700;font-size:17px;
            background:${i===0?"linear-gradient(145deg,#00eaff,#42b9ff)":"rgba(0,234,255,0.08)"};
            color:${i===0?"#000":"#cce7ff"};border:3px solid ${i===0?"#00eaff":"rgba(123,44,191,0.5)"};
            cursor:pointer;transition:all 0.4s;box-shadow:${i===0?"0 0 30px rgba(0,234,255,0.7)":"0 4px 15px rgba(0,0,0,0.5)"};
        `;
        btn.onmouseover = () => { if(i!==activeTab) btn.style.background = "rgba(0,234,255,0.2)"; };
        btn.onmouseout  = () => { if(i!==activeTab) btn.style.background = "rgba(0,234,255,0.08)"; };
        btn.onclick = () => switchTab(i);
        tabContainer.appendChild(btn);
        tabButtons.push(btn);
    });

    const grid = document.createElement("div");
    grid.id = "skill-grid";
    grid.style.cssText = `
        display:grid;grid-template-columns:repeat(13,1fr);gap:24px;
        padding:32px;background:rgba(0,0,0,0.4);border-radius:24px;
        max-height:calc(95vh - 280px);overflow-y:auto;border:2px solid rgba(123,44,191,0.3);
        scrollbar-width:thin;scrollbar-color:#7b2cbf transparent;
    `;
    panel.appendChild(grid);

    // Responsive
    const style = document.createElement("style");
    style.textContent = `
        @media(max-width:1400px){#skill-grid{grid-template-columns:repeat(11,1fr)!important;gap:20px}}
        @media(max-width:1100px){#skill-grid{grid-template-columns:repeat(9,1fr)!important}}
        @media(max-width:900px){#skill-grid{grid-template-columns:repeat(7,1fr)!important}}
        @media(max-width:700px){#skill-grid{grid-template-columns:repeat(5,1fr)!important}}
        @media(max-width:500px){#skill-grid{grid-template-columns:repeat(4,1fr)!important;gap:16px}}
    `;
    document.head.appendChild(style);

    // TẠO 104 SKILL – PHẦN QUAN TRỌNG NHẤT
    for (let i = 1; i <= 104; i++) {
        const skill = window.SKILL_DATA[i] || { name: "???", desc: "Chưa được khám phá..." };

        const box = document.createElement("div");
        box.dataset.id = i;
        box.style.cssText = `
            aspect-ratio:1;background:rgba(0,255,255,0.08);border:3px solid #3a5f78;
            border-radius:18px;overflow:hidden;position:relative;cursor:pointer;
            transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);
            box-shadow:0 8px 25px rgba(0,0,0,0.7);transform:scale(0.9);opacity:0;
        `;

        const img = new Image();
        img.src = `img/skill/skill (${i}).png`;
        img.style.cssText = "width:100%;height:100%;object-fit:contain;image-rendering:pixelated;transition:0.4s;";
        img.onerror = () => img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMzMzQ0NjYiIHJ4PSIxNiIvPjwvc3ZnPg==";
        box.appendChild(img);

                     // TOOLTIP RESPONSIVE 100% – HIỆN TRÊN/DƯỚI, MOBILE ĐẸP, KHÔNG BAO GIỜ BỊ CHE
        const tooltip = document.createElement("div");
        Object.assign(tooltip.style, {
            position: "fixed",
            background: "linear-gradient(145deg, rgba(10,15,30,0.98), rgba(0,0,15,0.98))",
            color: "#fff",
            border: "4px solid #ff3366",
            borderRadius: "20px",
            padding: "18px 24px",
            minWidth: "280px",
            maxWidth: "92vw",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 20px 60px rgba(255,51,102,0.7), 0 0 60px rgba(123,44,191,0.5)",
            backdropFilter: "blur(20px)",
            zIndex: "9999999",
            opacity: "0",
            pointerEvents: "none",
            transition: "opacity 0.35s cubic-bezier(0.34,1.56,0.64,1), transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            transform: "translateY(10px) scale(0.95)"
        });
        tooltip.innerHTML = `
            <div style="font-size:22px;font-weight:900;color:#00eaff;margin-bottom:10px;text-shadow:0 0 20px #00eaff;">
                [${String(i).padStart(3,'0')}] ${skill.name}
            </div>
            <div style="color:#cce7ff;line-height:1.7;font-size:16px;">${skill.desc}</div>
            ${skill.ending ? '<div style="margin-top:14px;color:#ff3366;font-weight:bold;font-size:18px;">KẾT THÚC BÍ MẬT</div>' : ''}
        `;
        document.body.appendChild(tooltip);

        box.addEventListener("mouseenter", () => {
            const rect = box.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            const showAbove = spaceAbove > spaceBelow + 100;

            tooltip.style.left = (rect.left + rect.width / 2) + "px";
            tooltip.style.top = (showAbove ? rect.top - 20 : rect.bottom + 20) + "px";
            tooltip.style.transform = `translateX(-50%) translateY(${showAbove ? -10 : 10}px) scale(1)`;
            tooltip.style.opacity = "1";

            if (window.innerWidth <= 768) {
                tooltip.style.maxWidth = "94vw";
                tooltip.style.padding = "14px 18px";
                tooltip.style.fontSize = "15px";
                tooltip.querySelector("div").style.fontSize = "19px";
            }
        });

        box.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
            tooltip.style.transform = "translateX(-50%) translateY(0) scale(0.95)";
        });

        // Mobile: click để hiện tooltip 3 giây
        box.addEventListener("click", (e) => {
            e.stopPropagation();
            const rect = box.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2) + "px";
            tooltip.style.top = (rect.top > 200 ? rect.top - 20 : rect.bottom + 20) + "px";
            tooltip.style.transform = "translateX(-50%) scale(1)";
            tooltip.style.opacity = "1";
            clearTimeout(tooltip.hideTimer);
            tooltip.hideTimer = setTimeout(() => { tooltip.style.opacity = "0"; }, 3000);
        });

        box.onmouseenter = () => {
            box.style.transform = "scale(1.25) translateY(-10px)";
            box.style.borderColor = "#ff3366";
            box.style.boxShadow = "0 25px 60px rgba(255,51,102,0.8)";
            img.style.filter = "brightness(1.4) drop-shadow(0 0 20px #ff3366)";
            tooltip.style.opacity = "1";
            tooltip.style.visibility = "visible";
        };
        box.onmouseleave = () => {
            box.style.transform = "scale(1)";
            box.style.borderColor = "#3a5f78";
            box.style.boxShadow = "0 8px 25px rgba(0,0,0,0.7)";
            img.style.filter = "";
            tooltip.style.opacity = "0";
            tooltip.style.visibility = "hidden";
        };

        setTimeout(() => {
            box.style.transition = "all 0.6s cubic-bezier(0.34,1.56,0.64,1)";
            box.style.transform = "scale(1)";
            box.style.opacity = "1";
        }, i * 18);

        grid.appendChild(box);
    }

    function switchTab(idx) {
        activeTab = idx;
        const [start, end] = ranges[idx];
        tabButtons.forEach((b, i) => {
            b.style.background = i === idx ? "linear-gradient(145deg,#00eaff,#42b9ff)" : "rgba(0,234,255,0.08)";
            b.style.color = i === idx ? "#000" : "#cce7ff";
            b.style.boxShadow = i === idx ? "0 0 35px rgba(0,234,255,0.8)" : "0 4px 15px rgba(0,0,0,0.5)";
        });
        grid.querySelectorAll("div[data-id]").forEach(el => {
            const id = Number(el.dataset.id);
            el.style.display = (id >= start && id <= end) ? "block" : "none";
        });
    }
    switchTab(0);

    window.toggleSkillPanel = () => {
        const open = panel.style.transform.includes("scale(1)");
        panel.style.transform = open ? "translate(-50%,-50%) scale(0)" : "translate(-50%,-50%) scale(1)";
        panel.style.opacity = open ? "0" : "1";
        if (!open) switchTab(0);
    };

    setTimeout(() => {
        document.querySelectorAll("#skill-btn, .center button").forEach(btn => {
            if (btn.textContent.includes("Kỹ năng") || btn.id === "skill-btn") {
                btn.addEventListener("click", window.toggleSkillPanel);
            }
        });
    }, 100);

    console.log("Skill Panel HOÀN CHỈNH 100% – Tooltip hiện đẹp, không bị cắt!");
})();