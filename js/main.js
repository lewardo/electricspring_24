const block_min = 8;

window.nav_active = false;

window.block_recalculate = nav_open => {
    const prev_dims = {
        block_rows: window.block_rows,
        block_cols: window.block_cols
    }
    
    const block_fit = n => {
        const w = window.innerWidth, h = window.innerHeight;
        const r = w > h ? w * 1.0 / h : h * 1.0 / w;
        return Math.round(n * r);
    }

    const block_count = n => n * block_fit(n);

    if (window.innerWidth > window.innerHeight) {
        window.block_rows = block_min;
        window.block_cols = block_fit(block_min);
    } else {
        window.block_rows = block_fit(block_min);
        window.block_cols = block_min;
    }

    if (prev_dims.block_rows != window.block_rows || prev_dims.block_cols != window.block_cols) {
        $('#blocks').empty().append(new Array(block_count(block_min) + 1).join(
            `<div class="overlay__block ${nav_open ? 'overlay--active' : ''}"></div>`
        )).css({
            '--block-rows': `${window.block_rows}`, 
            '--block-cols': `${window.block_cols}`
        });
    }
}

window.block_toggle = nav_open => {
    const blocks = $('#blocks > div').toArray();

    window.setTimeout(() => $('.overlay').toggleClass('overlay--visible'), nav_open ? 0 : 1000);
    window.setTimeout(() => $('.overlay').toggleClass('overlay--active'), nav_open ? 1000 : 0);

    Array.from(Array(blocks.length).keys())
         .map(value => ({ value, sort: Math.random() }))
         .sort((a, b) => a.sort - b.sort)
         .map(({ value }) => value)
         .forEach((n, i) => { 
            window.setTimeout(() => {
                $(blocks[i]).toggleClass('overlay--active');
            }, n * 1000 / blocks.length);
        }
    );

    return new Promise(r => window.setTimeout(r, nav_open ? 1200 : 0));
}

window.menu_toggle = nav_open => {
    $('.overlay__img').css({
        '--flicker-anim': nav_open ? 'flicker-reveal' : 'flicker-hide',
    });

    window.setTimeout(() => $('.overlay__img').css({
        '--flicker-anim': '', 
        'opacity': nav_open ? 1 : 0
    }), 1000);

    return new Promise(r => window.setTimeout(r, nav_open ? 0 : 1200));
}

window.overlay_open = () => {
    if (!nav_active) {
        nav_active = true;
        block_toggle(nav_active).then(() => menu_toggle(nav_active));
    };
}

window.overlay_close = () => {
    if (nav_active) {
        nav_active = false;
        menu_toggle(nav_active).then(() => block_toggle(nav_active));
    }
}

$(document).ready(() => {
    window.block_recalculate(false);

    window.onresize = () => block_recalculate(nav_active);
    window.onclick = () => {
        nav_active ? overlay_close() : overlay_open();
    }
})