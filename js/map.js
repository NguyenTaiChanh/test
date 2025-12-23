// =========================
// ISOMETRIC MAP SYSTEM – FULL FIX
// =========================

class IsoMap {
    constructor() {
        this.tileW = 128;
        this.tileH = 64;
        this.cols = 20; // Default
        this.rows = 20;

        this.tiles = {}; // { "dirt_N": img, ... }
        this.mapData = [];
        this.objects = [];

        // Default map
        for (let y = 0; y < this.rows; y++) {
            let row = [];
            for (let x = 0; x < this.cols; x++) {
                row.push({ name: "dirt", variant: "N" });
            }
            this.mapData.push(row);
        }
    }

    loadImg(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    load(data) {
        if (!data) return;

        this.cols = data.cols || this.cols;
        this.rows = data.rows || this.rows;
        this.tileW = data.tileW || this.tileW;
        this.tileH = data.tileH || this.tileH;

        // Ground map
        if (data.map && data.map.length === this.rows) {
            this.mapData = data.map.map(row => row.map(tile => ({
                name: tile.name || "dirt",
                variant: tile.variant || "N"
            })));
        }

        // Objects
        this.objects = data.objects || [];

        // Load unique images
        const unique = new Set();
        this.mapData.flat().forEach(t => unique.add(`${t.name}_${t.variant}`));
        this.objects.forEach(o => unique.add(`${o.name}_${o.variant}`));

        unique.forEach(key => {
            this.tiles[key] = this.loadImg(`img/Isometric/${key}.png`);
        });

        console.log(`Map loaded: ${this.cols}x${this.rows}, ${unique.size} tiles, ${this.objects.length} objects`);
    }

    isoX(col, row) {
        return (col - row) * (this.tileW / 2) + canvas.width / 2;
    }

    isoY(col, row) {
        return (col + row) * (this.tileH / 2) - (this.rows * this.tileH) / 2;
    }

    draw() {
        // Center camera vào ngôi nhà (col 20, row 18)
        const centerCol = 20;
        const centerRow = 18;
        const offsetX = canvas.width / 2 - this.isoX(centerCol, centerRow);
        const offsetY = canvas.height / 2 - this.isoY(centerCol, centerRow) + 200; // Bù mái cao

        // Ground
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const tile = this.mapData[row][col];
                const key = `${tile.name}_${tile.variant}`;
                const img = this.tiles[key];
                if (!img || !img.complete) continue;

                const dx = this.isoX(col, row) + offsetX;
                const dy = this.isoY(col, row) + offsetY;
                ctx.drawImage(img, dx, dy, this.tileW, this.tileH);
            }
        }

        // Objects (z-sort)
        this.objects.sort((a, b) => (a.row + a.col) - (b.row + b.col));
        this.objects.forEach(obj => {
            const key = `${obj.name}_${obj.variant}`;
            const img = this.tiles[key];
            if (!img || !img.complete) return;

            const dx = this.isoX(obj.col, obj.row) + offsetX;
            const dy = this.isoY(obj.col, obj.row) + offsetY - (img.height - this.tileH || 0);
            ctx.drawImage(img, dx, dy, img.width || this.tileW, img.height || this.tileH);
        });
    }
}

window.gameMap = new IsoMap();