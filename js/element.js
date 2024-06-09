function el_display(bool) { return bool ? "" : "none" }
function el_classes(data) { return Object.keys(data).filter(x => data[x]).join(" ") }

function updateHTML() {
    if (tmp.the_end) {
        return
    }
    updateGEsDisplay()
    updateGEsHTML()
    updateTabsHTML()
}

function setupHTML() {
    setupGridElements()
    setupTabsHTML()
}