const CURRENCIES = {
    energy: {
        name: "Energy",

        pos: [0,0],
        display: `<b class='iconly-bolt'></b>`,

        get amount() { return player.energy },
        set amount(v) { player.energy = v },

        get gain() {
            if (!hasUpgrade("A1")) return E(0);

            let x = E(1)

            x = x.mul(upgradeEffect("A2")).mul(upgradeEffect("A5")).mul(upgradeEffect("A9")).mul(tmp.eed.effect)
            
            if (hasUpgrade("A3")) x = x.mul(upgradeEffect("A3"));
            if (hasUpgrade("C5")) x = x.mul(upgradeEffect("C5"));
            if (hasUpgrade("F10")) x = x.mul(upgradeEffect("F10"));

            if (hasUpgrade("F4")) x = x.mul(1e100).pow(1.1)

            if (hasUpgrade("C3")) x = x.pow(1.05);

            x = x.pow(getChallengeBase(1)).pow(getChallengeBase(4)).pow(getChalEffect(1)).pow(upgradeEffect("A12")).pow(upgradeEffect("G1"))

            x = expPow(x,getChallengeBase(6,1))

            if (player.psi.active) x = expPow(x,0.75);

            x = x.addTP(MPEffect(0,0))

            let s = E('eee3').addTP(upgradeEffect("META3",0)).addTP(MPEffect(1,0))

            x = tetraflow(x,s,hasUpgrade("END3") ? 0.75 : 0.5);

            return x
        },
    },
    energy_p: {
        name: "Powered Energy",

        get amount() { return player.eed.amount },
        set amount(v) { player.eed.amount = v },

        get gain() {
            if (!hasUpgrade("A7")) return E(0)

            let x = tmp.eed.gain.mul(tmp.eed.tickspeed)

            return x
        },
    },
    energy_r: {
        name: "Refined Energy",

        unl: () => hasUpgrade("UNLOCK1"),
        pos: [0,20],
        display: `<b class='iconly-bolt-refined'></b>`,

        get amount() { return player.refined.energy },
        set amount(v) { player.refined.energy = v },

        get gain() {
            if (!hasUpgrade("UNLOCK1") || player.energy.lt(RESETS.energy_r.require)) return E(0)

            let x = player.energy.max(1).log10().div(308).pow(hasUpgrade("F2") ? 0.85 : 0.8).sub(1).pow_base(100).mul(upgradeEffect("C7"))

            if (hasUpgrade("A11")) x = x.mul(upgradeEffect("A11"));
            
            x = x.pow(getChallengeBase(4)).pow(getChalEffect(4))

            if (player.psi.active) x = expPow(x,0.75);

            return x.floor()
        },

        get passive() { return hasUpgrade("C13") ? 1 : 0 },
    },
    star: {
        name: "Stars",

        unl: () => hasUpgrade("UNLOCK2"),
        pos: [20,0],
        display: `<b class='iconly-star'></b>`,

        get amount() { return player.stars },
        set amount(v) { player.stars = v },

        get gain() {
            if (!hasUpgrade("UNLOCK2")) return E(0)

            let x = E(1).mul(simpleUpgradeEffect("E2")).mul(simpleUpgradeEffect("E3")).mul(simpleUpgradeEffect("E4"))
            .mul(upgradeEffect("E5")).mul(simpleUpgradeEffect("E6"))
            
            x = x.pow(simpleUpgradeEffect("E9"))

            if (player.psi.active) x = expPow(x,0.75);

            return x
        },
    },
    energy_g: {
        name: "Galactic Energy",

        unl: () => hasUpgrade("UNLOCK3"),
        pos: [20,40],
        display: `<b class='iconly-nova'></b>`,

        get amount() { return player.galactic.energy },
        set amount(v) { player.galactic.energy = v },

        get gain() {
            if (!hasUpgrade("UNLOCK3") || player.energy.lt(RESETS.energy_g.require)) return E(0)

            let x = player.refined.energy.log10().log10().div(2).root(0.5).sub(1.5).pow_base(1e5)

            x = x.mul(upgradeEffect("F7")).mul(getChalEffect(6))

            return x.floor()
        },

        get passive() { return hasUpgrade("F11") ? 1 : 0 },
    },
    psi: {
        name: "Psi Essence",

        unl: () => hasUpgrade("UNLOCK4"),
        pos: [40,20],
        display: `<b class='iconly-delta'></b>`,

        get amount() { return player.psi.essence },
        set amount(v) { player.psi.essence = v },

        get gain() {
            if (!hasUpgrade("G10")) if (!hasUpgrade("UNLOCK4") || !player.psi.active) return E(0)

            let x = player.energy.max(10).log10().log10().div(4).pow(0.75).sub(1.1).pow_base(1e10)

            x = x.mul(upgradeEffect("G3"))

            if (hasUpgrade("G2")) x = x.mul(upgradeEffect("G2"));
            if (hasUpgrade("G8")) x = x.mul(upgradeEffect("G8"));

            return x.floor()
        },
    },
    meta: {
        name: "Meta-Energy",

        unl: () => hasUpgrade("UNLOCK5"),
        pos: [40,40],
        display: `<b class='iconly-infinity'></b>`,

        get amount() { return player.meta.energy },
        set amount(v) { player.meta.energy = v },

        get gain() {
            if (!hasUpgrade("UNLOCK5")) return E(0)

            let x = player.energy.slog(10).sub(3.587852386325334).div(0.5).root(1.5)

            let m = E(1).mul(upgradeEffect("META8"))

            if (hasUpgrade("META5")) m = m.mul(2);
            if (hasUpgrade("META7")) m = m.mul(2);

            tmp.meta_mult = m

            return x.mul(m).add(1).floor().sub(this.amount).max(0)
        },

        get passive() { return 0 },
    },
    meta_p: {
        name: "Meta-Particles",

        unl: () => player.meta.unl,

        get amount() { return player.meta.particles },
        set amount(v) { player.meta.particles = v },

        get gain() {
            if (!player.meta.unl) return E(0)

            let x = player.energy.max(1).slog(10).pow10().mul(player.meta.energy.pow(20))

            if (hasUpgrade("END2")) x = x.pow(player.meta.energy.add(10).log10())

            x = x.mul(upgradeEffect("META2"))

            return x
        },
    },
}

const TAB_CURR_UNLOCKS = {
    energy: () => true,
    energy_p: () => hasUpgrade("A7"),
    energy_r: () => hasUpgrade("UNLOCK1"),
    star: () => hasUpgrade("UNLOCK2"),
    energy_g: () => hasUpgrade("UNLOCK3"),
    psi: () => hasUpgrade("UNLOCK4"),
    meta: () => hasUpgrade("UNLOCK5"),
    meta_p: () => player.meta.unl,
}

const CURR_GRIDS = ['energy','energy_r','star','energy_g','psi','meta']

function gainCurrency(id,amt) {
    var curr = CURRENCIES[id]
    curr.amount = curr.amount.add(amt)
    if ('total' in curr) curr.total = curr.total.add(amt)
}

function createCurrencyGridElement(id) {
    var curr = CURRENCIES[id]

    createGridElement('currency-'+id,{
        html: `
        <h4><span id="${id}-amount">0</span>${curr.display??""}</h4>
        <div id="${id}-per-second">(+1/s)</div>
        `,

        unl: curr.unl,
        pos: curr.pos,

        style: {
            'background': `#111 linear-gradient(to top, #fff1 50%, transparent 10px)`,
            'backgroundSize': '100% 40px',
            'animation': `currency-background 8s linear infinite`,
        },

        updateHTML() {
            el(id+"-amount").innerHTML = format(curr.amount, 0)
            el(id+"-per-second").innerHTML = (curr.passive ?? 1) > 0 && tmp.currency_gain[id].gt(0) ? formatGain(curr.amount, tmp.currency_gain[id].mul(curr.passive ?? 1)) : ""
        },
    })
}

const RESETS = {
    energy_r: {
        unl: () => hasUpgrade("UNLOCK1"),
        pos: [0,21],
        desc: `Reset energy, EEDs, powered energy, and upgrades A* & B* for refined energy <b class='iconly-bolt-refined'></b>. Earn more refined energy based on energy.`,
        get require() { return E(Number.MAX_VALUE) },
        require_curr: "energy",

        doReset() {
            player.refined.unl = true

            player.energy = E(0)
            player.eed.amount = E(0)
            player.eed.ticks = E(0)
            
            resetUpgrades("A",hasUpgrade("C4") ? ["A7"] : [])
            resetUpgrades("B")
        },
    },
    energy_g: {
        unl: () => hasUpgrade("UNLOCK3"),
        pos: [20,41],
        desc: `Reset everything refined energy does, as well as refined energy, stars, challenges, and upgrades C*, D*, & E* for galactic energy <b class='iconly-nova'></b>. Earn more galactic energy based on refined energy.`,
        get require() { return E(Number.MAX_VALUE) },
        require_curr: "energy_r",

        doReset() {
            player.galactic.unl = true

            player.refined.energy = E(0)
            player.stars = E(0)

            if (!hasUpgrade("F6")) for (let i = 1; i <= 3; i++) player.chal.completion[i] = 0

            let k = []

            if (hasUpgrade("F2") || hasUpgrade("META1")) k.push("C13");
            if (hasUpgrade("F3")) k.push("C6");
            
            resetUpgrades("C",k)
            resetUpgrades("D")
            resetUpgrades("E",["E1"])

            RESETS.energy_r.doReset()
        },
    },
    meta: {
        unl: () => hasUpgrade("UNLOCK5"),
        pos: [40,41],
        desc: `Reset everything galactic energy does, as well as galactic energy, psi essence, challenges, and upgrades F* & G* for meta-energy <b class='iconly-infinity'></b>.`,
        get require() { return this.require_dis() },
        require_dis(y=player.meta.energy) {
            let x = Decimal.iteratedexp(10,y.div(tmp.meta_mult).pow(1.5).mul(0.5).add(3),3)

            return x
        },
        require_curr: "energy",

        doReset() {
            player.meta.unl = true

            if (hasUpgrade("END1")) return;

            player.galactic.energy = E(0)
            player.psi.essence = E(0)
            player.psi.amount = false

            if (!hasUpgrade("META1")) for (let i = 1; i <= 6; i++) player.chal.completion[i] = 0

            let k = ["F6"]

            if (hasUpgrade("META1")) k.push("F11");
            
            resetUpgrades("F",k)

            k = []

            if (hasUpgrade("META6")) k.push("G10");

            resetUpgrades("G",k)

            RESETS.energy_g.doReset()
        },
    },
}

function createResetGridElement(id) {
    var reset = RESETS[id], curr = CURRENCIES[id]

    createGridElement('reset-'+id,{
        unl: reset.unl,
        pos: reset.pos,

        html: `
        <button onclick="doReset('${id}')" class="grid-button" id="reset-grid-${id}"></button>
        `,

        updateHTML() {
            var reset_el = el(`reset-grid-${id}`), req = reset.require, req_curr = CURRENCIES[reset.require_curr]

            reset_el.innerHTML = req_curr.amount.gte(req)
            ? `<p>${reset.desc}</p><p>Earn <b>+${format(tmp.currency_gain[id],0)}</b> ${curr.name} ${"require_dis" in reset ? `(next at ${format(reset.require_dis(tmp.currency_gain[id].add(curr.amount)))})` : ""}</p>`
            : `Reach ${format(req, 0)} ${req_curr.name}`

            reset_el.className = el_classes({locked: req_curr.amount.lt(req), "grid-button": true})
        },
    })
}

function doReset(id, force) {
    var reset = RESETS[id], curr = CURRENCIES[id]

    if (force || reset.unl() && CURRENCIES[reset.require_curr].amount.gte(reset.require)) {
        if (!force) curr.amount = curr.amount.add(tmp.currency_gain[id])

        reset.doReset()
    }
}