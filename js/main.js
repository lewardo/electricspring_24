$(document).ready(() => {
    const container = $('#blocks');
    const block = '<div class="blocks__block"></div>';

    const N = 10;

    window.block_recalculate = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const block_fit = (n, w, h) => {
            const r = w > h ? w * 1.0 / h : h * 1.0 / w;
            return Math.round(n * r);
        }

        const block_count = n => n * block_fit(n, width, height);

        if (width > height) {
            window.block_rows = N;
            window.block_cols = block_fit(N, width, height);
        } else {
            window.block_rows = block_fit(N, width, height);
            window.block_cols = N;
        }

        container.append(new Array(block_count(N) + 1).join(block));
        container.css({
            '--block-width': `${width / window.block_cols}px`, 
            '--block-height': `${height / window.block_rows}px`
        });
    }

    window.block_toggle = () => {
        const blocks = $('#blocks > div').toArray();
        const delay = 1000 / blocks.length;
        const order = Array.from(Array(blocks.length).keys())
                           .map(value => ({ value, sort: Math.random() }))
                           .sort((a, b) => a.sort - b.sort)
                           .map(({ value }) => value);
        
        order.forEach((n, i) => {
            setTimeout(() => {
                $(blocks[i]).toggleClass('blocks__block--hidden');
            }, n * delay);
        })
    }

    window.block_recalculate();
    window.onresize = window.block_recalculate;

    window.onclick = window.block_toggle;
})