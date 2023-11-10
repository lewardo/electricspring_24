$.fn.extend({
    // syntactic sugar
    qdelay: function(delay) {
        return $(this).delay(delay); 
    },

    // https://stackoverflow.com/q/5396119
    qcss: function(css) {
       return $(this).queue(function(next) {
          $(this).css(css);
          next();
       });
    },

    qaddclass: function(style) {
        return $(this).queue(function(next) {
            $(this).addClass(style);
            next();
        });
    },

    qrmclass: function(style) {
        return $(this).queue(function(next) {
            $(this).removeClass(style);
            next();
        });
    },

    qtype: function(str) {
        return $(this).queue(function(next) {
            new TypeIt(this, { cursor: true, speed: 80 })
                    .empty()
                    .type(str)
                    .go();
                    
            next();
        });
    },

    qshuffle: function(finalText) {
        return $(this).queue(function(next) { 
            const chars = "abcdefghijklmnopqrstuvwxyz";
            $(this).glitch({ chars, charTime: 16, finalText });
            next();
        });
    },
    
    qthen: function(f) {
        return $(this).queue(function(next) {
            f();
            next();
        });
    }
});
