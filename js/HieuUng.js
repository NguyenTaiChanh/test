document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".menu-dropdown");

    if (!btn || !menu) return; // Cho chắc, tránh lỗi

    btn.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".menu-wrapper")) {
            menu.style.display = "none";
        }
    });
});


