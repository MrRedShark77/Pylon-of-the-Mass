var tmp = {}
var options = {
    
}

function reloadTemp() {
    tmp = {
        currency_gain: {},
        upgs_effect: {},

        eed: {
            tickspeed: E(1),
            dimensions: E(1),
        },

        galaxy: {
            diameter: E(1),
            effect: E(0),
        },

        auto_upg: [],
        lock_upg: [],

        chal_effect: [],

        meta_p_effects: [],

        the_end: false,
        the_end2: false,
        mass: 0,

        meta_size: 1,
    }
}

function updateEEDTemp() {
    let eed = tmp.eed

    eed.dimensions = Decimal.add(1, upgradeEffect("B1",0)).add(upgradeEffect("B3",0)).add(simpleUpgradeEffect("C10",0))
    eed.dimensions = eed.dimensions.add(eed.dimensions.div(getChalEffect(3,EINF)).floor())
    if (hasUpgrade("E10")) eed.dimensions = eed.dimensions.mul(upgradeEffect("E10"));
    eed.dimensions = eed.dimensions.mul(upgradeEffect("B6"));

    if (chalActive(3)) eed.dimensions = eed.dimensions.min(getChallengeBase(3));
    eed.dimensions = eed.dimensions.round()

    eed.tickspeed = Decimal.mul(1,upgradeEffect("B2")).mul(upgradeEffect("B4")).pow(simpleUpgradeEffect("E8")).pow(upgradeEffect("B6"))

    if (player.psi.active) eed.tickspeed = expPow(eed.tickspeed,0.75)

    eed.gain = F.exponential_sum(player.eed.ticks, eed.dimensions.sub(1))
    eed.effect = getEEDEffect()
}

function getEEDEffect() {
    let x = expPow(player.eed.amount.add(1),0.75)

    return x
}

function updateEGTemp() {
    let gal = tmp.galaxy

    gal.diameter = Decimal.mul(upgradeEffect("D1"),upgradeEffect("D2")).mul(upgradeEffect("D3")).mul(upgradeEffect("D4")).pow(upgradeEffect("E11"))

    let e = gal.diameter.max(1).log10()
    if (hasUpgrade("F3")) e = e.pow(1.5)
    gal.effect = e.div(15)
}

function updateTemp() {
    updateChallengesTemp()

    tmp.slow_scale_1 = upgradeEffect("F1")

    updateUpgradesTemp()

    META_PARTICLE_EFFECTS.forEach((v,i) => {tmp.meta_p_effects[i] = v[1](v[0]() ? player.meta.particles : E(0))})

    updateEGTemp()
    updateEEDTemp()
    
    for (let [i,v] of Object.entries(CURRENCIES)) tmp.currency_gain[i] = preventNaNDecimal(v.gain??E(0))
}