const VERSION = 1
const SAVE_ID = "poti_save"
var prevSave = "", autosave

function getPlayerData() {
    let s = {
        energy: E(0),

        upgrades: {},

        eed: {
            ticks: E(0),
            amount: E(0),
        },

        refined: {
            energy: E(0),
            unl: false,
        },

        stars: E(0),

        chal: {
            active: 0,
            completion: [null],
        },

        galactic: {
            energy: E(0),
            unl: false,
        },

        psi: {
            active: false,
            essence: E(0),
        },

        meta: {
            energy: E(0),
            particles: E(0),
            unl: false,
        },

        time: 0,

        saved_cam: {x : 0, y : 0},
    }

    for (let k in UPGRADES) s.upgrades[k] = E(0);
    for (let i = 1; i < CHALLENGES.length; i++) s.chal.completion[i] = 0

    return s
}

function wipe(reload) {
	player = getPlayerData()
    reloadTemp()
	if (reload) {
        save()
        location.reload()
    }
}

function loadPlayer(load) {
    const DATA = getPlayerData()
    player = deepNaN(load, DATA)
    player = deepUndefinedAndDecimal(player, DATA)
    camera_pos = player.saved_cam
}

function clonePlayer(obj,data) {
    let unique = {}

    for (let k in obj) {
        if (data[k] == null || data[k] == undefined) continue
        unique[k] = Object.getPrototypeOf(data[k]).constructor.name == "Decimal"
        ? E(obj[k])
        : typeof obj[k] == 'object'
        ? clonePlayer(obj[k],data[k])
        : obj[k]
    }

    return unique
}

function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
        }
    }
    return obj
}

function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data
    for (let k in data) {
        if (obj[k] === null) continue
        if (obj[k] === undefined) obj[k] = data[k]
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
        }
    }
    return obj
}

function preventSaving() { return tmp.the_end }

function save() {
    let str = btoa(JSON.stringify(player))
    if (preventSaving() || findNaN(str, true)) return
    if (localStorage.getItem(SAVE_ID) == '') wipe()
    localStorage.setItem(SAVE_ID,str)
    prevSave = str
    console.log("Game Saved!")
    // addNotify("Game Saved!")
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    let str = btoa(JSON.stringify(player))
    save();
    let file = new Blob([str], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "POTI Save - "+new Date().toGMTString()+".txt"
    a.click()
}

function export_copy() {
    let str = btoa(JSON.stringify(player))

    let copyText = document.getElementById('copy')
    copyText.value = str
    copyText.style.visibility = "visible"
    copyText.select();
    document.execCommand("copy");
    copyText.style.visibility = "hidden"
}

function importy() {
    loadgame = prompt("Paste in your save. WARNING: WILL OVERWRITE YOUR CURRENT SAVE!")
    if (loadgame != null) {
        let keep = player
        try {
			if (findNaN(loadgame, true)) {
				error("Error Importing, because it got NaNed")
				return
			}
			localStorage.setItem(SAVE_ID, loadgame)
			location.reload()
        } catch (error) {
            error("Error Importing")
            player = keep
        }
    }
}

function importy_file() {
    let a = document.createElement("input")
    a.setAttribute("type","file")
    a.click()
    a.onchange = ()=>{
        let fr = new FileReader();
        fr.onload = () => {
            let loadgame = fr.result
            if (findNaN(loadgame, true)) {
				error("Error Importing, because it got NaNed")
				return
			}
            localStorage.setItem(SAVE_ID, loadgame)
			location.reload()
        }
        fr.readAsText(a.files[0]);
    }
}

function wipeConfirm() {
    if (confirm(`Are you sure you want to wipe your save?`)) wipe(true)
}

function checkNaN() {
    let naned = findNaN(player)
    if (naned) {
        warn("Game Data got NaNed because of "+naned.bold())
        resetTemp()
        loadGame(false, true)
        tmp.start = 1
        tmp.pass = 1
    }
}

function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false
}

function findNaN(obj, str=false, data=getPlayerData(), node='player') {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
    for (let k in obj) {
        if (typeof obj[k] == "number") if (isNaNed(obj[k])) return node+'.'+k
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node+'.'+k
        }
        if (typeof obj[k] == "object") {
            let node2 = findNaN(obj[k], str, data[k], (node?node+'.':'')+k)
            if (node2) return node2
        }
    }
    return false
}