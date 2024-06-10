const UPGRADES = {
    "A1": {
        unl: () => true,
        pos: [0,1],

        desc: `Generate <b>+1</b> energy per second.`,
        curr: "energy",

        cost: E(0),
    },
    "A2": {
        unl: () => hasUpgrade("A1"),
        pos: [1,1],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("A4")).mul(simpleUpgradeEffect("C8")) },

        get desc() { return `Increase energy rate by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy",

        cost: a => Decimal.pow(3,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(10),
        bulk: a => a.div(10).log(3).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A3": {
        unl: () => hasUpgrade("A2"),
        pos: [1,0],

        desc: `Energy boosts its rate at a reduced rate.`,
        curr: "energy",

        cost: E(100),

        effect(a) {
            let e = Decimal.add(hasUpgrade("A6") ? 0.5 : 1/3,upgradeEffect("A10"))
            let x = expPow(player.energy.add(1),e)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A4": {
        unl: () => hasUpgrade("A3"),
        pos: [1,-1],
        max: EINF,

        get base() { return Decimal.add(0.5, simpleUpgradeEffect("A8",0)) },

        get desc() { return `Increase the base of <b>A2</b> by <b>+${format(this.base)}</b> per level.` },
        curr: "energy",

        cost: a => Decimal.pow(10,a.pow(hasUpgrade("C1") ? 1.75 : 2)).mul(1e3),
        bulk: a => a.div(1e3).log(10).root(hasUpgrade("C1") ? 1.75 : 2).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A5": {
        unl: () => hasUpgrade("A4"),
        pos: [0, -1],
        max: EINF,

        get base() { return player.energy.add(10).log10() },

        get desc() { return `Increase energy rate by <b>${formatMult(this.base)}</b> per level. (based on lg[<b class="iconly-bolt"></b>])` },
        curr: "energy",

        cost: a => Decimal.pow(1e3,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e6),
        bulk: a => a.div(1e6).log(1e3).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A6": {
        unl: () => hasUpgrade("A3"),
        pos: [2,0],

        desc: `Improve <b>A3</b> better.`,
        curr: "energy",

        cost: E(1e15),
    },
    "A7": {
        unl: () => hasUpgrade("A6"),
        pos: [3,0],

        desc: `Unlock <b>Endless Energy Dimensions</b> (EEDs).`,
        curr: "energy",

        cost: E(1e32),
    },
    "A8": {
        unl: () => hasUpgrade("A7"),
        pos: [2,-1],

        desc: `Powered energy boosts the base of <b>A4</b> at a reduced rate.`,
        curr: "energy",

        cost: E(1e64),

        effect(a) {
            let x = player.eed.amount.add(1).log10().root(2).div(25)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A9": {
        unl: () => hasUpgrade("A7"),
        pos: [-1, -1],
        max: EINF,

        get base() { return player.eed.amount.add(10).log10() },

        get desc() { return `Increase energy rate by <b>${formatMult(this.base)}</b> per level. (based on lg[<b class="iconly-bolt"></b>P])` },
        curr: "energy",

        cost: a => Decimal.pow(1e5,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e100),
        bulk: a => a.div(1e100).log(1e5).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A10": {
        unl: () => hasUpgrade("A6"),
        pos: [2,1],
        max: 15,

        desc: `Increase the exponent of <b>A3</b> by <b>+0.01</b> per level.`,
        curr: "energy",

        cost: a => Decimal.pow(1e10,Decimal.pow(1.1,a).sub(1).mul(10)).mul(1e300),
        bulk: a => a.div(1e300).log(1e10).div(10).add(1).log(1.1).floor().add(1),

        effect(a) {
            let x = a.div(100)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A11": {
        unl: () => player.refined.unl,
        pos: [-1,1],

        desc: `Powered energy boosts refined energy earned at a reduced rate.`,
        curr: "energy",

        cost: E('e729'),

        effect(a) {
            let x = player.eed.amount.max(1).log10().div(1000).pow(0.6).sub(1).pow10().add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A12": {
        unl: () => hasUpgrade("F5"),
        pos: [-1,0],
        max: EINF,

        desc: `Increase the exponent of energy by <b>+0.1</b> per level.`,
        curr: "energy",

        cost: a => Decimal.pow('ee6',a.sumBase(1.5)).mul('e5e5'),
        bulk: a => a.div('e5e5').log('ee6').sumBase(1.5,true).floor().add(1),

        effect(a) {
            let x = a.div(10).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },

    "B1": {
        unl: () => hasUpgrade("A7"),
        pos: [4,1],
        max: EINF,

        desc: `Increase the amount of <b>EED</b> by <b>+1</b> per level.`,
        curr: "energy",

        cost: a => Decimal.pow(20,a.sumBasePO(tmp.slow_scale_1.mul(hasUpgrade("C9") ? 1/3 : 0.5))).mul(1e33),
        bulk: a => a.div(1e33).log(20).sumBasePO(tmp.slow_scale_1.mul(hasUpgrade("C9") ? 1/3 : 0.5),true).floor().add(1),

        effect(a) {
            let x = a
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "B2": {
        unl: () => hasUpgrade("A7"),
        pos: [5, 1],
        max: EINF,

        get base() { return Decimal.add(hasUpgrade("C2") ? 1.3 : 1.25, tmp.galaxy.effect) },

        get desc() { return `Increase the tickspeed of <b>EED</b> by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy",

        cost: a => Decimal.pow(10,a.scale(Decimal.div(500,hasUpgrade("F9")?upgradeEffect("F1"):1),3,"E2")).mul(1e33),
        bulk: a => a.div(1e33).log(10).scale(Decimal.div(500,hasUpgrade("F9")?upgradeEffect("F1"):1),3,"E2",true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "B3": {
        unl: () => hasUpgrade("B1"),
        pos: [4,2],
        max: EINF,

        desc: `Increase the amount of <b>EED</b> by <b>+1</b> per level.`,
        curr: "energy_p",

        cost: a => Decimal.pow(1e35,a.sumBasePO(tmp.slow_scale_1.mul(0.5))).mul(1e140),
        bulk: a => a.div(1e140).log(1e35).sumBasePO(tmp.slow_scale_1.mul(0.5),true).floor().add(1),

        effect(a) {
            let x = a
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "B4": {
        unl: () => hasUpgrade("A7"),
        pos: [5,2],
        max: EINF,

        get base() { return Decimal.add(hasUpgrade("C2") ? 1.3 : 1.25, tmp.galaxy.effect).pow(simpleUpgradeEffect("B5")) },

        get desc() { return `Increase the tickspeed of <b>EED</b> by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy_p",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e300),
        bulk: a => a.div(1e300).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "B5": {
        unl: () => hasUpgrade("C6"),
        pos: [6,1],

        desc: `Powered Energy boosts the base of <b>B4</b> at a greatly reduced rate.`,

        cost: E('e7500'),
        curr: "energy_p",

        effect(a) {
            let x = player.eed.amount.max(1).log10().add(10).log10()
            return x
        },
        effDesc: x => formatPow(x),
    },
    "B6": {
        unl: () => hasUpgrade("G7"),
        pos: [6,2],
        max: EINF,

        get base() { return Decimal.add(2, hasUpgrade("G9") ? upgradeEffect("G4",0) : 0) },

        get desc() { return `Increase the amount of <b>EED</b> and the exponent of its tickspeed by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy_p",

        cost: a => a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11"))).pow_base(10).mul(1e100).pow_base(10),
        bulk: a => a.log10().div(1e100).log10().sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "C1": {
        unl: () => player.refined.unl,
        pos: [-1,21],

        desc: `Reduce the cost of <b>A4</b> slightly.`,
        curr: "energy_r",

        cost: E(1),
    },
    "C2": {
        unl: () => player.refined.unl,
        pos: [1,21],

        desc: `Increase the base of <b>B2</b> & <b>B4</b> by <b>+0.05</b>.`,
        curr: "energy_r",

        cost: E(1),
    },
    "C3": {
        unl: () => hasUpgrade("C1"),
        pos: [-1,20],

        desc: `Raise the energy rate to the <b>1.05th</b> power.`,
        curr: "energy_r",

        cost: E(10),
    },
    "C4": {
        unl: () => hasUpgrade("C2"),
        pos: [1,20],

        desc: `Start with <b>EED</b> (upgrade <b>A7</b>) unlocked on reset.`,
        curr: "energy_r",

        cost: E(10),

        on_buy() {
            if (!hasUpgrade("A7")) player.upgrades["A7"] = E(1)
        },
    },
    "C5": {
        unl: () => hasUpgrade("C3"),
        pos: [-1,19],

        desc: `Unspent refined energy boosts energy rate.`,
        curr: "energy_r",

        cost: E(50),

        effect(a) {
            let x = player.refined.energy.add(1).pow(2)
            if (hasUpgrade("C11")) x = x.pow(upgradeEffect("C11"));
            x = hasUpgrade("C14") ? x.overflow('ee4',0.5) : x.min('ee4')
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C6": {
        unl: () => hasUpgrade("C4"),
        pos: [1,19],

        desc: `Unlock the <b>Energy Galaxy</b>.`,
        curr: "energy_r",

        cost: E(1e3),
    },
    "C7": {
        unl: () => hasUpgrade("C5"),
        pos: [0,19],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("C12")) },

        get desc() { return `Increase refined energy earned by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy_r",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e3),
        bulk: a => a.div(1e3).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C8": {
        unl: () => hasUpgrade("C6"),
        pos: [4,20],

        desc: `The diameter of the <b>Energy Galaxy</b> boosts the base of <b>A2</b>.`,
        curr: "energy_r",

        cost: E(5e5),

        effect(a) {
            let x = expPow(tmp.galaxy.diameter.max(1),0.75)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C9": {
        unl: () => hasUpgrade("C6"),
        pos: [4,19],

        desc: `Reduce the cost of <b>B1</b> slightly.`,
        curr: "energy_r",

        cost: E(5e6),
    },
    "C10": {
        unl: () => hasUpgrade("C6"),
        pos: [-1,22],

        desc: `The diameter of the <b>Energy Galaxy</b> increases the amount of <b>EED</b>.`,
        curr: "energy_r",

        cost: E(1e9),

        effect(a) {
            let x = tmp.galaxy.diameter.max(1).log10().pow(1.5).floor()
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "C11": {
        unl: () => hasUpgrade("C10"),
        pos: [0,22],

        desc: `Refined Energy improves the effect of <b>C5</b>.`,
        curr: "energy_r",

        cost: E(1e13),

        effect(a) {
            let x = expPow(player.refined.energy.max(1).log10().add(1),0.75)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "C12": {
        unl: () => hasUpgrade("C11"),
        pos: [1,22],
        max: EINF,

        get base() { return Decimal.add(1, simpleUpgradeEffect("E7",0)) },

        get desc() { return `Increase the base of <b>C7</b> by <b>+${format(this.base)}</b> per level.` },
        curr: "energy_r",

        cost: a => Decimal.pow(10,a.pow(2)).mul(1e15),
        bulk: a => a.div(1e15).log(10).root(2).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "C13": {
        unl: () => player.chal.completion[2] > 1,
        pos: [3,22],

        desc: `Passively generate <b>100%</b> of Refined Energy you earned on reset.`,
        curr: "energy_r",

        cost: E(1e38),
    },
    "C14": {
        unl: () => player.chal.completion[2] > 2,
        pos: [5,21],

        desc: `The hardcap of <b>C5</b> is now softcap.`,
        curr: "energy_r",

        cost: E(1e210),
    },

    "D1": {
        unl: () => hasUpgrade("C6"),
        pos: [2,21],
        max: EINF,

        desc: `Increase the diameter of the <b>Energy Galaxy</b> by <b>+100%</b> per level.`,
        curr: "energy_r",

        cost: a => Decimal.pow(5,a).mul(1e2),
        bulk: a => a.div(1e2).log(5).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D2": {
        unl: () => hasUpgrade("C6"),
        pos: [3,21],
        max: EINF,

        desc: `Increase the diameter of the <b>Energy Galaxy</b> by <b>+100%</b> per level.`,
        curr: "energy_p",

        cost: a => Decimal.pow('e200',a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul('e2000'),
        bulk: a => a.div('e2000').log('e200').sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D3": {
        unl: () => hasUpgrade("C6"),
        pos: [4,21],
        max: EINF,

        desc: `Increase the diameter of the <b>Energy Galaxy</b> by <b>+100%</b> per level.`,
        curr: "energy",

        cost: a => Decimal.pow('e100',a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul('e1000'),
        bulk: a => a.div('e1000').log('e100').sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D4": {
        unl: () => player.chal.completion[2] > 1,
        pos: [4,22],
        max: EINF,

        desc: `Increase the diameter of the <b>Energy Galaxy</b> by <b>+100%</b> per level.`,
        curr: "star",

        cost: a => Decimal.pow(10,a).mul(1e12),
        bulk: a => a.div(1e12).log(10).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },

    "E1": {
        unl: () => hasUpgrade("UNLOCK2"),
        pos: [19,0],

        desc: `Unlock the <b>Challenges</b>.`,
        curr: "star",

        cost: E(10),
    },
    "E2": {
        unl: () => player.chal.completion[2] > 0,
        pos: [19,1],

        desc: `Energy boosts star generation at a reduced rate.`,
        curr: "energy",

        cost: E('e2850'),

        effect(a) {
            let x = player.energy.max(1).log10().div(100).root(3).pow_base(10)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E3": {
        unl: () => player.chal.completion[2] > 0,
        pos: [19,-1],

        desc: `Powered Energy boosts star generation at a reduced rate.`,
        curr: "energy_p",

        cost: E('e15000'),

        effect(a) {
            let x = player.eed.amount.max(1).log10().div(1000).root(3).pow_base(20)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E4": {
        unl: () => player.chal.completion[2] > 1,
        pos: [20,-1],

        desc: `Refined Energy boosts star generation at a reduced rate.`,
        curr: "energy_r",

        cost: E('e39'),

        effect(a) {
            let x = player.refined.energy.max(1).log10().div(10).root(3).pow_base(300)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E5": {
        unl: () => player.chal.completion[2] > 2,
        pos: [21,-1],
        max: EINF,

        get base() { return Decimal.add(3, simpleUpgradeEffect("E7",0)) },

        get desc() { return `Increase star generation by <b>${formatMult(this.base)}</b> per level.` },
        curr: "star",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e15),
        bulk: a => a.div(1e15).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E6": {
        unl: () => hasUpgrade("E5"),
        pos: [22,-1],

        get base() { return Decimal.add(2, 0) },

        get desc() { return `Star generation is increased by <b>${formatMult(this.base)}</b> per challenges completed.` },
        curr: "star",

        cost: E('1e20'),

        effect(a) {
            let x = 0
            for (let i = 1; i < CHALLENGES.length; i++) x += player.chal.completion[i]
            return this.base.pow(x)
        },
        effDesc: x => formatMult(x),
    },
    "E7": {
        unl: () => hasUpgrade("E6"),
        pos: [23,-1],

        desc: `Stars boost the base of <b>C12</b> & <b>E5</b> at a reduced rate.`,
        curr: "star",

        cost: E('1e32'),

        effect(a) {
            let x = player.stars.max(1).log10().root(2).div(5)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "E8": {
        unl: () => hasUpgrade("E7"),
        pos: [21,1],

        desc: `The amount of <b>EED</b> raises its tickspeed.`,
        curr: "star",

        cost: E('1e36'),

        effect(a) {
            let x = tmp.eed.dimensions.sub(1).max(0).root(2).div(20).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "E9": {
        unl: () => player.chal.completion[5] > 0,
        pos: [23,1],

        desc: `Galactic Energy boosts star generation at a reduced rate.`,
        curr: "energy_g",

        cost: E(1e19),

        effect(a) {
            let x = player.galactic.energy.max(1).log10().root(2).div(30).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "E10": {
        unl: () => hasUpgrade("E9"),
        pos: [24,1],

        desc: `Stars increase the amount of <b>EED</b>.`,
        curr: "star",

        cost: E(1e230),

        effect(a) {
            let x = player.stars.max(1).log10().root(3).div(10).add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E11": {
        unl: () => player.chal.completion[5] > 2,
        pos: [24,-1],
        max: EINF,

        get base() { return Decimal.add(1, 0) },

        get desc() { return `Increase the exponent of <b>Energy Galaxy</b>'s diameter by <b>+${format(this.base)}</b> per level.` },
        curr: "star",

        cost: a => Decimal.pow('e5e3',a.sumBase(1.1)).mul('e9e4'),
        bulk: a => a.div('e9e4').log('e5e3').sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },

    "F1": {
        unl: () => player.galactic.unl,
        pos: [20,39],
        max: EINF,

        get base() { return Decimal.add(1.5, upgradeEffect("F8",0)) },

        get desc() { return `The cost of <b>A2</b>, <b>A5</b>, <b>A9</b>, <b>B1</b>, <b>B3-4</b>, <b>C7</b>, <b>D2-3</b>, and <b>E5</b> scales <b>${formatMult(this.base)}</b> slower per level.` },
        curr: "energy_g",

        cost: a => Decimal.pow(10,a.sumBase(1.25).pow(1.5)),
        bulk: a => a.log(10).root(1.5).sumBase(1.25,true).floor().add(1),

        effect(a) {
            if (player.psi.active) return E(1)
            let x = this.base.pow(-1).pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F2": {
        unl: () => hasUpgrade("F1"),
        pos: [19,40],

        desc: `Start with the refined energy generation (upgrade <b>C13</b>) unlocked on reset. Improves the formula of refined energy better.`,
        curr: "energy_g",

        cost: E(100),

        on_buy() {
            if (!hasUpgrade("C13")) player.upgrades["C13"] = E(1)
        },
    },
    "F3": {
        unl: () => hasUpgrade("F1"),
        pos: [21,40],

        desc: `Start with the <b>Energy Galaxy</b> (upgrade <b>C6</b>) unlocked on reset. The <b>Energy Galaxy</b> is stronger.`,
        curr: "energy_g",

        cost: E(100),

        on_buy() {
            if (!hasUpgrade("C6")) player.upgrades["C6"] = E(1)
        },
    },
    "F4": {
        unl: () => hasUpgrade("F2"),
        pos: [19,39],

        desc: `Increase energy rate by <b>×1e100</b>, then <b>^1.1</b>.`,
        curr: "energy_g",

        cost: E(1e3),
    },
    "F5": {
        unl: () => hasUpgrade("F3"),
        pos: [21,39],

        desc: `Unlock new upgrade <b>A</b>.`,
        curr: "energy_g",

        cost: E(1e9),
    },
    "F6": {
        unl: () => hasUpgrade("F2"),
        pos: [19,41],

        desc: `Keep the first 3 challenges on reset. Unlock new challenges.`,
        curr: "energy_g",

        cost: E(1e10),
    },
    "F7": {
        unl: () => hasUpgrade("F3"),
        pos: [21,41],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("G4",0)) },

        get desc() { return `Increase galactic energy gain by <b>${formatMult(this.base)}</b> per level.` },
        curr: "energy_g",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1,simpleUpgradeEffect("F13")))).mul(1e7),
        bulk: a => a.div(1e7).log(10).sumBasePO(Decimal.mul(0.1,simpleUpgradeEffect("F13")),true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F8": {
        unl: () => player.chal.completion[5] > 1,
        pos: [20,38],
        max: EINF,

        get base() { return Decimal.add(0.05, simpleUpgradeEffect("G5",0)) },

        get desc() { return `Increase the base of <b>F1</b> <b>+${format(this.base)}</b> per level.` },
        curr: "energy_g",

        cost: a => Decimal.pow(1e12,a.sumBase(1.1)).mul(1e34),
        bulk: a => a.div(1e34).log(1e12).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "F9": {
        unl: () => player.chal.completion[5] > 1,
        pos: [22,40],

        desc: `<b>F1</b> now affects the scaling of <b>B2</b>.`,
        curr: "energy_g",

        cost: E(1e53),
    },
    "F10": {
        unl: () => player.chal.completion[5] > 1,
        pos: [22,38],

        desc: `Galactic Energy boosts energy rate.`,
        curr: "energy_g",

        cost: E(1e120),

        effect(a) {
            let x = expPow(player.galactic.energy.add(1),Decimal.add(2,simpleUpgradeEffect("F12",0)))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F11": {
        unl: () => player.chal.completion[5] > 2,
        pos: [23,40],

        desc: `Passively generate <b>100%</b> of Galactic Energy you earned on reset.`,
        curr: "energy_g",

        cost: E(1e190),
    },
    "F12": {
        unl: () => hasUpgrade("F11"),
        pos: [23,37],

        desc: `Improve <b>F10</b> better.`,
        curr: "energy_g",

        cost: E(1e250),

        effect(a) {
            if (player.psi.active) return E(0)
            let x = player.galactic.energy.max(10).log10().log10()
            return x
        },
        effDesc: x => "+"+format(x)+" to exponent",
    },
    "F13": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [19,38],

        desc: `<b>F1</b> now affects the cost of <b>F7</b> at a reduced rate.`,
        curr: "energy_g",

        cost: E('e12222'),

        effect(a) {
            let x = upgradeEffect("F1").log10().pow(-2)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "G1": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [40,19],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("G4",0)) },

        get desc() { return `Increase energy rate by <b>${formatPow(this.base)}</b> per level.` },
        curr: "psi",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")))).mul(10),
        bulk: a => a.div(10).log(10).sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "G2": {
        unl: () => hasUpgrade("G1"),
        pos: [39,20],

        desc: `Galactic Energy boosts Psi Essence.`,
        curr: "psi",

        cost: E(1e3),

        effect(a) {
            let x = player.galactic.energy.max(1).log10().add(1)
            if (hasUpgrade("G6")) x = x.pow(x.log10().add(1))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "G3": {
        unl: () => hasUpgrade("G2"),
        pos: [41,20],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("G4",0)) },

        get desc() { return `Increase psi essence generation by <b>${formatMult(this.base)}</b> per level.` },
        curr: "psi",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")))).mul(1e7),
        bulk: a => a.div(1e7).log(10).sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "G4": {
        unl: () => hasUpgrade("G3"),
        pos: [41,19],
        max: EINF,

        get base() { return Decimal.add(0.5, 0) },

        get desc() { return `Increase the base of <b>F7</b>, <b>G1</b>, & <b>G3</b> by <b>+${format(this.base)}</b> per level.` },
        curr: "psi",

        cost: a => Decimal.pow(100,a.pow(2.1)).mul(1e11),
        bulk: a => a.div(1e11).log(100).root(2.1).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "G5": {
        unl: () => hasUpgrade("G4"),
        pos: [39,21],

        desc: `<b>G4</b> now affects the base of <b>F8</b> at a 10% rate.`,
        curr: "psi",

        cost: E(1e30),

        effect(a) {
            let x = upgradeEffect("G4").div(10)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "G6": {
        unl: () => hasUpgrade("G5"),
        pos: [39,19],

        desc: `Improve <b>G2</b> better.`,
        curr: "psi",

        cost: E(1e39),
    },
    "G7": {
        unl: () => hasUpgrade("G6"),
        pos: [41,21],

        desc: `Unlock new <b>B</b> upgrade.`,
        curr: "psi",

        cost: E(1e79),
    },
    "G8": {
        unl: () => hasUpgrade("G2"),
        pos: [38,20],

        desc: `Powered Energy boosts Psi Essence.`,
        curr: "psi",

        cost: E(1e82),

        effect(a) {
            let x = player.eed.amount.max(1).log10().add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "G9": {
        unl: () => hasUpgrade("G5"),
        pos: [37,20],

        desc: `<b>G4</b> now affects the base of <b>B6</b>.`,
        curr: "psi",

        cost: E(1e103),
    },
    "G10": {
        unl: () => hasUpgrade("G9"),
        pos: [40,22],

        desc: `You can generate Psi Essence outside the dilation.`,
        curr: "psi",

        cost: E(1e105),
    },
    "G11": {
        unl: () => hasUpgrade("G10"),
        pos: [38,22],

        desc: `<b>F1</b> now affects the cost of <b>B6</b>, <b>G1</b>, & <b>G3</b> at greatly reduced rate.`,
        curr: "psi",

        cost: E('1e588'),

        effect(a) {
            let x = upgradeEffect("F1").log10().abs().root(1.5482).div(5).add(1).pow(-1)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "AUTO1": {
        unl: () => hasUpgrade("A7"),
        pos: [6,0],

        desc: `Automatically buy <b>A*</b> without spending currencies.`,
        curr: "energy",

        cost: E(1e100),
    },
    "AUTO2": {
        unl: () => hasUpgrade("AUTO1"),
        pos: [6,-1],

        desc: `Automatically buy <b>B*</b> without spending currencies.`,
        curr: "energy_p",

        cost: E('1e500'),
    },
    "AUTO3": {
        unl: () => player.chal.completion[2] > 2,
        pos: [5,19],

        desc: `Automatically buy <b>C*</b> without spending currencies.`,
        curr: "energy_r",

        cost: E(1e100),
    },
    "AUTO4": {
        unl: () => hasUpgrade("AUTO3"),
        pos: [5,20],

        desc: `Automatically buy <b>D*</b> without spending currencies.`,
        curr: "energy_r",

        cost: E('1e150'),
    },
    "AUTO5": {
        unl: () => hasUpgrade("E8"),
        pos: [22,1],

        desc: `Automatically buy <b>E*</b> without spending currencies.`,
        curr: "star",

        cost: E('1e45'),
    },
    "AUTO6": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [22,41],

        desc: `Automatically buy <b>F*</b> without spending currencies.`,
        curr: "energy_g",

        cost: E('e7200'),
    },
    "AUTO7": {
        unl: () => hasUpgrade("G11"),
        pos: [40,23],

        desc: `Automatically buy <b>G*</b> without spending currencies.`,
        curr: "psi",

        cost: E('e500'),
    },
    "AUTO8": {
        unl: () => hasUpgrade("META9"),
        pos: [38,38],

        desc: `Automatically buy <b>META*</b> without spending currencies.`,
        curr: "meta",

        cost: E(1000),
    },

    "UNLOCK1": {
        unl: () => hasUpgrade("A7"),
        pos: [3,-1],

        desc: `Unlock the next Path.`,
        curr: "energy",

        cost: Decimal.pow(2,1024),

        on_buy() {doCameraLerp(0, 20*250)},
    },
    "UNLOCK2": {
        unl: () => hasUpgrade("C12"),
        pos: [2,22],

        desc: `Unlock the next Path.`,
        curr: "energy_r",

        cost: E(1e21),

        on_buy() {doCameraLerp(20*250, 0)},
    },
    "UNLOCK3": {
        unl: () => hasUpgrade("C14"),
        pos: [5,22],

        desc: `Unlock the next Path again.`,
        curr: "energy_r",

        cost: E(2).pow(1024),

        on_buy() {doCameraLerp(20*250, 40*250)},
    },
    "UNLOCK4": {
        unl: () => hasUpgrade("C12"),
        pos: [20,37],

        desc: `Unlock the next Path.`,
        curr: "energy_g",

        cost: E('e700'),

        on_buy() {doCameraLerp(40*250, 20*250)},
    },
    "UNLOCK5": {
        unl: () => hasUpgrade("G11"),
        pos: [37,23],

        desc: `Unlock the final Path.`,
        curr: "energy",

        cost: E('eee3'),

        on_buy() {doCameraLerp(40*250, 40*250)},
    },

    "META1": {
        unl: () => player.meta.unl,
        pos: [42,39],

        desc: `Start with refined and galactic energy generations unlocked and keep challenge completions on reset.`,
        curr: "meta_p",

        cost: E(1e6),

        on_buy() {
            if (!hasUpgrade("C6")) player.upgrades["C6"] = E(1);
            if (!hasUpgrade("F11")) player.upgrades["F11"] = E(1);
        },
    },
    "META2": {
        unl: () => player.meta.unl,
        pos: [43,39],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("META4",0)) },

        get desc() { return `Increase meta-particle generation by <b>${formatMult(this.base)}</b> per level.` },
        curr: "meta_p",

        cost: a => Decimal.pow(10,a.sumBase(1.1)).mul(1e6),
        bulk: a => a.div(1e6).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "META3": {
        unl: () => player.meta.energy.gte(2),
        pos: [38,41],
        max: EINF,

        get base() { return Decimal.add(0.5, MPEffect(3,0)) },

        get desc() { return `Energy Overflow delays <b>+${format(this.base)}</b> later per level.` },
        curr: "meta_p",

        cost: a => Decimal.pow(1e5,a.sumBase(1.1)).mul(1e14),
        bulk: a => a.div(1e14).log(1e5).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "META4": {
        unl: () => player.meta.energy.gte(4),
        pos: [37,41],
        max: EINF,

        get base() { return Decimal.add(1, MPEffect(2,0)) },

        get desc() { return `Increase the base of <b>META2</b> by <b>+${format(this.base)}</b> per level.` },
        curr: "meta_p",

        cost: a => Decimal.pow(100,a.pow(2)).mul(1e25),
        bulk: a => a.div(1e25).log(100).root(2).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "META5": {
        unl: () => player.meta.energy.gte(5),
        pos: [38,40],

        desc: `Double meta-energy gain.`,
        curr: "meta_p",

        cost: E(1e35),
    },
    "META6": {
        unl: () => player.meta.energy.gte(10),
        pos: [37,40],

        desc: `Start with <b>G10</b> unlocked on reset.`,
        curr: "meta_p",

        cost: E(1e45),

        on_buy() {
            if (!hasUpgrade("G10")) player.upgrades["G10"] = E(1);
        },
    },
    "META7": {
        unl: () => player.meta.energy.gte(17),
        pos: [38,39],

        desc: `Double meta-energy gain again.`,
        curr: "meta_p",

        cost: E(1e60),
    },
    "META8": {
        unl: () => player.meta.energy.gte(36),
        pos: [37,39],
        max: EINF,

        get base() { return Decimal.add(2, 0) },

        get desc() { return `Increase meta-energy gain by <b>${formatMult(this.base)}</b> per level.` },
        curr: "meta_p",

        cost: a => Decimal.pow(1e20,a.sumBase(1.5)).mul(1e75),
        bulk: a => a.div(1e75).log(1e20).sumBase(1.5,true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "META9": {
        unl: () => player.meta.energy.gte(216),
        pos: [40,39],

        desc: `Improve the first four meta-particle's effects better.`,
        curr: "meta_p",

        cost: E(1e108),

        effect(a) {
            let x = expPow(player.meta.energy.add(1),0.5)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "END1": {
        unl: () => hasUpgrade("AUTO8"),
        pos: [36,36],

        desc: `Automatically gain meta-energy, and it resets nothing.`,
        curr: "meta",

        cost: E(1e50),
    },
    "END2": {
        unl: () => hasUpgrade("END1"),
        pos: [34,34],

        desc: `Improve meta-particles gain better.`,
        curr: "meta",

        cost: E(1.586e51),
    },
    "END3": {
        unl: () => hasUpgrade("END2"),
        pos: [32,32],

        desc: `Energy overflow is even weaker.`,
        curr: "meta",

        cost: E(8.048e90),
    },
    "END4": {
        unl: () => hasUpgrade("END3"),
        pos: [30,30],

        desc: `Unlock the Black Hole.`,
        curr: "meta",

        cost: E('6.1769e383'),

        on_buy() {doCameraLerp(20*250, 20*250)},
    },
}

const UPG_KEYS = Object.keys(UPGRADES)
const PREFIXES = ["A","B","C","D","E","F","G","AUTO","UNLOCK","META","END"]

function getUpgrades(prefix) { return UPG_KEYS.filter(key => key.split(prefix)[0] == "" && Number(key.split(prefix)[1])) }

const PREFIX_TO_UPGS = (()=>{
    let x = {}
    PREFIXES.forEach(y => {x[y] = getUpgrades(y)})
    return x
})()

const CHAL_A_UPGS = PREFIX_TO_UPGS["A"].filter(x => x != "A1")

function getUpgradeCost(id) {
    let u = UPGRADES[id]

    return Decimal.gt(u.max ?? 1,1) ? u.cost(player.upgrades[id]) : u.cost
}

function buyUpgrade(id, all = false, auto = false) {
    let u = UPGRADES[id], lvl = player.upgrades[id], max = u.max ?? 1

    if (tmp.lock_upg.includes(id) || !u.unl() || lvl.gte(max)) return

    let cost = getUpgradeCost(id), curr = CURRENCIES[u.curr]

    if (curr.amount.gte(cost)) {
        let bulk = player.upgrades[id].add(1)

        if ((all || auto) && Decimal.gt(max, 1)) {
            bulk = bulk.max(u.bulk(curr.amount).min(max))
            cost = u.cost(bulk.sub(1))
        }

        player.upgrades[id] = bulk
        if (!auto) {
            curr.amount = curr.amount.sub(cost).max(0)
            if (u.on_buy) u.on_buy()
        }
    }
}

function hasUpgrade(id) { return player.upgrades[id].gte(1) }
function upgradeEffect(id,def=1) { return tmp.upgs_effect[id] ?? def }
function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? tmp.upgs_effect[id] ?? def : def }

function setupUpgrades() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id], max = u.max ?? 1, curr = CURRENCIES[u.curr]

        createGridElement('upgrade-' + id, {
            unl: ()=>u.unl() || hasUpgrade(id),

            pos: u.pos,
            sub_html: `<div class="grid-element-info">(${u.pos.join(', ')}) ${id}</div>`,
            html: `
            <button onclick="buyUpgrade('${id}')" class="grid-button" id="upgrade-grid-${id}"></button>
            <button onclick="buyUpgrade('${id}',true)" class="upgrade-grid-buy-max" style="display: ${Decimal.gt(max,1) ? "block" : "none"}">Buy Max</button>
            `,

            updateHTML() {
                let u_el = el("upgrade-grid-" + id), lvl = player.upgrades[id], bought = lvl.gte(max)

                let h = ""
                if (Decimal.gt(max,1)) h += `<div>[Level ${format(lvl,0) + (Decimal.lt(max,EINF) ? " / " + format(max,0) : "")}]</div>`
                h += u.desc

                if (u.effDesc) h += `<br>Effect: ${u.effDesc(tmp.upgs_effect[id])}`

                var cost = getUpgradeCost(id)

                if (!bought) h += `<br>Cost: ${format(cost,0)} ${curr.name}`

                u_el.innerHTML = h
                u_el.className = el_classes({"grid-button": true, bought, locked: !bought && (tmp.lock_upg.includes(id) || curr.amount.lt(cost))})
            },
        })
    }
}

function updateUpgradesTemp() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id]
        if (u.effect) tmp.upgs_effect[id] = u.effect(player.upgrades[id])
    }

    let auto = []

    if (hasUpgrade("AUTO1")) auto.push(...PREFIX_TO_UPGS["A"]);
    if (hasUpgrade("AUTO2")) auto.push(...PREFIX_TO_UPGS["B"]);
    if (hasUpgrade("AUTO3")) auto.push(...PREFIX_TO_UPGS["C"]);
    if (hasUpgrade("AUTO4")) auto.push(...PREFIX_TO_UPGS["D"]);
    if (hasUpgrade("AUTO5")) auto.push(...PREFIX_TO_UPGS["E"]);
    if (hasUpgrade("AUTO6")) auto.push(...PREFIX_TO_UPGS["F"]);
    if (hasUpgrade("AUTO7")) auto.push(...PREFIX_TO_UPGS["G"]);
    if (hasUpgrade("AUTO8")) auto.push(...PREFIX_TO_UPGS["META"]);

    tmp.auto_upg = auto

    let lock = []

    if (chalActive(2)) lock.push(...getChallengeBase(2));
    if (chalActive(5)) lock.push(...getChallengeBase(5));

    tmp.lock_upg = lock
}

function resetUpgrades(id,keep=[]) {
    for (let i of PREFIX_TO_UPGS[id]) if (!keep.includes(i)) player.upgrades[i] = E(0)
}