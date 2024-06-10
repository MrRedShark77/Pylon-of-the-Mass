function calc(dt) {
    if (tmp.the_end2) {
        tmp.mass += dt

        el('mass-text').innerHTML = format(tmp.mass)
        el('rank-btn').className = el_classes({locked: tmp.mass < 10})

        return
    }

    if (tmp.the_end) {
        let p = 0.95

        tmp.meta_size = Math.max(tmp.meta_size * p, 0.001)

        camera_pos.x *= p
        camera_pos.y *= p

        el('grid-elements').style.transform = `scale(${tmp.meta_size})`

        updatePosition()

        return
    }

    for (let [i,v] of Object.entries(CURRENCIES)) {
        var passive = v.passive ?? 1
        gainCurrency(i, tmp.currency_gain[i].mul(dt*passive))
    }

    if (hasUpgrade("A7")) {
        if (tmp.eed.dimensions.gt(1)) player.eed.ticks = player.eed.ticks.add(tmp.eed.tickspeed.mul(dt)).max(0);
    }

    for (let id of tmp.auto_upg) buyUpgrade(id, false, true);

    if (camera_lerp.active) {
        var x1, y1
        var x2 = camera_pos.x = lerp(camera_pos.x, x1 = camera_lerp.pos.x, dt*2)
        var y2 = camera_pos.y = lerp(camera_pos.y, y1 = camera_lerp.pos.y, dt*2)

        updatePosition()

        if (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) < 20) camera_lerp.active = false
    }

    if (hasUpgrade("END1")) player.meta.energy = player.meta.energy.add(tmp.currency_gain.meta).max(0);

    player.time += dt

    drawCanvas()
}