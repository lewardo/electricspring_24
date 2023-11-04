const block_min = 8;

window.nav_open = false;

window.block_recalculate = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const prev_dims = {
        block_rows: window.block_rows,
        block_cols: window.block_cols
    }
    
    const block_fit = (n, w, h) => {
        const r = w > h ? w * 1.0 / h : h * 1.0 / w;
        return Math.round(n * r);
    }

    const block_count = n => n * block_fit(n, width, height);


    if (width > height) {
        window.block_rows = block_min;
        window.block_cols = block_fit(block_min, width, height);
    } else {
        window.block_rows = block_fit(block_min, width, height);
        window.block_cols = block_min;
    }

    if (prev_dims.block_rows != window.block_rows || prev_dims.block_cols != window.block_cols) {
        $('#blocks').empty().append(new Array(block_count(block_min) + 1).join(
            `<div class="overlay__block ${nav_open ? 'overlay__block--active' : ''}"></div>`
        )).css({
            '--block-rows': `${window.block_rows}`, 
            '--block-cols': `${window.block_cols}`
        });
    }
}

window.block_toggle = () => {
    const blocks = $('#blocks > div').toArray();

    window.setTimeout(() => {
        $('.overlay').css({
            'display': nav_open ? 'block' : 'none'
        });
    }, nav_open ? 0 : 1000);

    Array.from(Array(blocks.length).keys())
         .map(value => ({ value, sort: Math.random() }))
         .sort((a, b) => a.sort - b.sort)
         .map(({ value }) => value)
         .forEach((n, i) => { 
            window.setTimeout(() => {
                $(blocks[i]).toggleClass('overlay__block--active');
            }, n * 1000 / blocks.length);
        }
    );

    return new Promise(r => window.setTimeout(r, nav_open ? 1200 : 0));
}

window.menu_toggle = () => {
}

$(document).ready(() => {
    window.block_recalculate();

    window.onresize = block_recalculate;
    window.onclick = () => {
        nav_open = !nav_open;

        if (nav_open) block_toggle().then(menu_toggle);
        else menu_toggle().then(block_toggle);
    }
})