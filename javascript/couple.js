class ForgeCouple {

    static previewBtn = {};
    static mappingTable = {};
    static manualIndex = {};
    static bbox = {};

    static coords = [[-1, -1], [-1, -1]];

    static COLORS = [
        "hsl(0, 36%, 36%)",
        "hsl(30, 36%, 36%)",
        "hsl(60, 36%, 36%)",
        "hsl(120, 36%, 36%)",
        "hsl(240, 36%, 36%)",
        "hsl(280, 36%, 36%)",
        "hsl(320, 36%, 36%)"
    ];

    /**
     * Update the color of the rows based on the order and selection
     * @param {string} mode "t2i" | "i2i"
     */
    static updateColors(mode) {
        const selection = parseInt(this.manualIndex[mode].value);

        const rows = this.mappingTable[mode].querySelectorAll("tr");
        rows.forEach((row, i) => {
            const bg = (selection === i) ?
                "var(--table-row-focus)" :
                `var(--table-${(i % 2 == 0) ? "odd" : "even"}-background-fill)`;
            row.style.background = `linear-gradient(to right, ${bg} 80%, ${this.COLORS[i % this.COLORS.length]})`;
        });

        if (selection < 0 || selection >= rows.length)
            ForgeCouple.bbox[mode].hideBox();
        else
            ForgeCouple.bbox[mode].showBox(this.COLORS[selection], rows[selection]);
    }

    /**
     *  When updating the mappings, trigger a preview
     * @param {string} mode "t2i" | "i2i"
     */
    static preview(mode) {
        this.previewBtn[mode].click();
    }

    /**
     * When clicking on a row, update the index
     * @param {string} mode "t2i" | "i2i"
     */
    static onSelect(mode) {
        const rows = this.mappingTable[mode].querySelectorAll("tr");
        rows.forEach((row, i) => {
            if (row.querySelector(":focus-within") != null) {
                if (this.manualIndex[mode].value == i)
                    this.manualIndex[mode].value = -1;
                else
                    this.manualIndex[mode].value = i;

                updateInput(this.manualIndex[mode]);
            }
        });

        this.updateColors(mode);
    }

}

onUiLoaded(async () => {
    ["t2i", "i2i"].forEach((mode) => {
        const ex = document.getElementById(`forge_couple_${mode}`);

        ForgeCouple.previewBtn[mode] = ex.querySelector(".fc_preview");
        ForgeCouple.mappingTable[mode] = ex.querySelector(".fc_mapping").querySelector("tbody");
        ForgeCouple.manualIndex[mode] = ex.querySelector(".fc_index").querySelector("input");

        const row = ex.querySelector(".controls-wrap");
        row.remove();

        const mapping_div = ex.querySelector(".fc_mapping").children[1];
        const btns = ex.querySelector(".fc_map_btns");

        mapping_div.insertBefore(btns, mapping_div.children[1]);

        const preview_img = ex.querySelector("img");
        preview_img.ondragstart = (e) => { e.preventDefault(); return false; };

        const manual_field = ex.querySelector(".fc_manual_field").querySelector("input");

        ForgeCouple.bbox[mode] = new ForgeCoupleBox(preview_img, manual_field);

        setTimeout(() => {
            ForgeCouple.preview(mode);
        }, 100);
    });
})
