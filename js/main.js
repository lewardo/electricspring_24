let nav_active = false;

window.block_recalculate = () => {
    const block_min = 8;
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
        $('#blocks')
            .empty()
            .append(new Array(block_count(block_min) + 1).join(
                `<div class="overlay__block ${nav_active ? 'overlay--visible' : ''}"></div>`
            ))
            .css({
                '--block-rows': `${window.block_rows}`, 
                '--block-cols': `${window.block_cols}`
            });
    }
}

window.overlay_open = () => {
    const blocks = $('#blocks > div').toArray();
    const delay = 1000 / blocks.length;

    $('.overlay')
        .qaddclass('overlay--visible')
        .qdelay(1000)
        .qaddclass('overlay--active');
        
    $('.overlay__img')
        .qdelay(1200)
        .qcss({'--flicker-anim': 'flicker-reveal'})
        .qdelay(1000)
        .qcss({'--flicker-anim': ''})
        .qaddclass('overlay--visible');

    $('.overlay__info')
        .qdelay(1500)
        .qaddclass('overlay--visible');
    
    $('.overlay__close')
        .qdelay(1000)
        .qaddclass('overlay--visible')

    Array.from(Array(blocks.length).keys())
         .map(value => ({ value, sort: Math.random() }))
         .sort((a, b) => a.sort - b.sort)
         .map(({ value }) => value)
         .forEach((n, i) => $(blocks[i]).qdelay(n * delay).qaddclass('overlay--visible'));

    nav_active = true;
}
        
window.overlay_close = () => {
    const blocks = $('#blocks > div').toArray();
    const delay = 1000 / blocks.length;

    $('.overlay')
        .qdelay(1200)
        .qrmclass('overlay--active')
        .qdelay(1000)
        .qrmclass('overlay--visible');

    $('.overlay__img')
        .qcss({'--flicker-anim': 'flicker-hide'})
        .qdelay(1000)
        .qcss({'--flicker-anim': ''})
        .qrmclass('overlay--visible');
    
    $('.overlay__info')
        .qdelay(500)
        .qrmclass('overlay--visible')
        .delay(1000)

    $('.overlay__close')
        .qdelay(1000)
        .qrmclass('overlay--visible');

    Array.from(Array(blocks.length).keys())
         .map(value => ({ value, sort: Math.random() }))
         .sort((a, b) => a.sort - b.sort)
         .map(({ value }) => value)
         .forEach((n, i) => $(blocks[i]).qdelay(1200).qdelay(n * delay).qrmclass('overlay--visible'));

    nav_active = false;
}

window.onresize = () => block_recalculate();

window.onkeyup = e => {
    if (e.key === "Escape" && nav_active) 
       window.overlay_close();
}

$('.overlay__close').on('click', function() {
    if (nav_active) window.overlay_close();
})

$('.info__event').on('click', function() {     
    $.getJSON("./data/" + $(this).attr('id') + ".json", data => {
        $('#title').delay(1500).qshuffle(data.title);
        $('#name').empty().delay(1500).qtype(data.artist);

        $('#liner').html(data.liner);
        $('#bio').html(data.bio);

        $('#profile').attr('src', data.profile);
    });

    window.overlay_open();
});


$(document).ready(() => {
    window.block_recalculate();
})