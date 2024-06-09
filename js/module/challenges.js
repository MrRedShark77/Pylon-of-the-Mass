const CHALLENGES = [
    null,
    {
        unl: () => hasUpgrade("E1"),
        pos: [21,0],

        max: 10,
        name: `Energy Reduction`,
        desc(c) { return `Energy rate is reduced by <b>${formatPow(this.base[c],3)}</b>.` },
        base: [0.5,0.392,0.266,0.214,0.181,0.145,0.096,0.062,0.053,0.043,0],

        effect(c) {
            if (chalActive(1)) return E(1)
            let x = player.stars.max(1).log10().div(20).mul(c).add(1).root(2)
            return x
        },
        effDesc: x => formatPow(x),
        reward: x => `Stars (<b class="iconly-star"></b>) boost energy rate by <b>${x}</b> outside of this challenge.`,

        goal(c) { return E('e750') },
        res: "energy",

        reset: "energy_r",
    },{
        unl: () => hasUpgrade("E1"),
        pos: [22,0],

        max: 3,
        name: `No Upgrades`,
        desc(c) { return [
            `You cannot purchase <b>A*</b> upgrades, except <b>A1</b>.`,
            `You cannot purchase <b>B*</b> upgrades.`,
            `You cannot purchase <b>A*</b> & <b>B*</b> upgrades, except <b>A1</b>.`,
            `???`,
        ][c] },
        base: [CHAL_A_UPGS, PREFIX_TO_UPGS["B"], CHAL_A_UPGS.concat(PREFIX_TO_UPGS["B"])],

        reward: x => `Unlock more upgrades.`,

        goal(c) { return [E('e1600'),E('e2100'),E('e7200'),EINF][c] },
        res: "energy",

        reset: "energy_r",
    },{
        unl: () => hasUpgrade("E1"),
        pos: [23,0],

        max: 5,
        name: `Less Dimensions`,
        desc(c) { return `The amount of <b>EED</b> cannot be increased above <b>${this.base[c]}</b>.` },
        base: [8,6,4,2,1,1],

        effect(c) {
            let x = c > 0 ? 10-c : EINF
            return x
        },
        effDesc: x => format(x,0),
        reward: x => `Give <b>1</b> extra amount of <b>EED</b> per <b>${x}</b> dimensions purchased.`,

        goal(c) { return E('e1800') },
        res: "energy_p",

        reset: "energy_r",
    },{
        unl: () => hasUpgrade("F6"),
        pos: [24,0],

        max: 5,
        name: `Energy Reduction II`,
        desc(c) { return `Energy and refined energy are reduced by <b>${formatPow(this.base[c],3)}</b>.` },
        base: [0.5,0.375,0.239,0.18,0.15,0],

        effect(c) {
            if (chalActive(4)) return E(1)
            let x = player.stars.max(1).log10().div(250).mul(c).add(1).root(3)
            return x
        },
        effDesc: x => formatPow(x),
        reward: x => `Stars boost refined energy gain by <b>${x}</b> outside of this challenge.`,

        goal(c) {
            if (c > 2) return [E('e4200'),E('e34e5'),EINF][c-3]
            return E('e500')
        },
        res: "energy_r",

        reset: "energy_g",
    },{
        unl: () => hasUpgrade("F6"),
        pos: [25,0],

        max: 3,
        name: `No Upgrades II`,
        desc(c) { return [
            `You cannot purchase <b>C*</b> upgrades.`,
            `You cannot purchase <b>D*</b> upgrades.`,
            `You cannot purchase <b>C*</b> & <b>D*</b> upgrades.`,
            `???`,
        ][c] },
        base: [PREFIX_TO_UPGS["C"], PREFIX_TO_UPGS["D"], PREFIX_TO_UPGS["C"].concat(PREFIX_TO_UPGS["D"])],

        reward: x => `Unlock more upgrades.`,

        goal(c) { return [E('e2400'),E('e38000'),E('e9e9'),EINF][c] },
        res: "energy_r",

        reset: "energy_g",
    },{
        unl: () => hasUpgrade("F6"),
        pos: [26,0],

        max: 5,
        name: `Exponential Energy Reduction`,
        desc(c) { return `The exponent of energy rate is reduced by <b>${formatPow(this.base[c],3)}</b>.` },
        base: [0.5,0.433,0.357,0.309,0.272,0],

        effect(c) {
            c = c > 1 ? 2 ** (c-1) : c
            let x = player.energy.max(1).log10().add(1).pow(c*0.55)
            return x
        },
        effDesc: x => formatMult(x),
        reward: x => `Energy boosts galactic energy gain by <b>${x}</b>.`,

        goal(c) {
            return E('ee5')
        },
        res: "energy",

        reset: "energy_g",
    },
]

function getChallengeBase(c, def=1) { return player.chal.active == c ? CHALLENGES[c].base[player.chal.completion[c]] : def }
function chalActive(c) { return player.chal.active == c }
function getChalEffect(c, def=1) { return tmp.chal_effect[c] ?? def }

function enterChallenge(i) {
    let active = player.chal.active, c = CHALLENGES[active], comps = player.chal.completion

    if (active > 0 && CURRENCIES[c.res].amount.gte(c.goal(comps[active]))) {
        comps[active] = Math.min(comps[active] + 1, c.max)
    }

    doReset(CHALLENGES[i == 0 ? active : i].reset,true)
    if (i > 0 && comps[i] < CHALLENGES[i].max) player.chal.active = i
    else player.chal.active = 0
}

function setupChallenges() {
    for (let i = 1; i < CHALLENGES.length; i++) {
        let c = CHALLENGES[i], max = c.max, curr = CURRENCIES[c.res]

        createGridElement(`chal-${i}`, {
            unl: c.unl,
            pos: c.pos,

            html: `
            <button onclick="enterChallenge(${i})" class="grid-button" id="challenge-grid-${i}"></button>
            `,

            updateHTML() {
                let c_el = el("challenge-grid-" + i), lvl = player.chal.completion[i], comp = lvl >= max, goal = c.goal(lvl)

                let h = `<b>${c.name}</b> [${lvl}/${max}]`

                let u = c.effDesc ? c.effDesc(tmp.chal_effect[i]) + (comp ? " " : " ➜ " + c.effDesc(c.effect(lvl+1))) : ""

                h += `<div>${c.desc(lvl)}</div><div>Reward: ${c.reward(u)}</div>`

                if (!comp) h += `<div>Goal: ${format(goal,0)} ${curr.name}</div>`

                c_el.innerHTML = h
                c_el.className = el_classes({"grid-button": true, bought: comp, locked: !comp && chalActive(i) && curr.amount.lt(goal)})
            },
        })
    }

    createGridElement(`chal-exit`, {
        unl: ()=>player.chal.active>0,
        pos: [20,1],

        html: `
        <button onclick="enterChallenge(0)" class="grid-button" id="challenge-button"></button>
        `,

        updateHTML() {
            let c = CHALLENGES[player.chal.active], goal = c.goal(player.chal.completion[player.chal.active]), curr = CURRENCIES[c.res]
            el('challenge-button').innerHTML = `${curr.amount.gte(goal) ? "Complete" : "Exit"} Challenge <b>[${c.name}]</b>`
        },
    })
}

function updateChallengesTemp() {
    for (let i = 1; i < CHALLENGES.length; i++) {
        let c = CHALLENGES[i], lvl = player.chal.completion[i]
        if (c.effect) tmp.chal_effect[i] = c.effect(lvl)
    }
}