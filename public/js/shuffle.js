(function($) {

    /**
     * Animates element text.
     *
     * @credits   @danieltamkin                   github.com/danieltamkin
     *            Peer-programmed by @darrenplace github.com/darrenplace
     * @version   1.0.0
     * @return    {settings.done()}
     */
    $.fn.glitch = function(options) {
      /**
       * Itterate over each instance.
       * @param  {Object}                key     Relative to the element assignment
       * @param  {Object}                element The current Element assigned
       * @return {[type]}                        [description]
       */
      return this.each(function(key, element) {
        let settings = $.extend({
          chars: '!<>-_\\/[]{}â€”=+*^?#________',
          charTime: 10,
          finalText: undefined,
          done: function(){console.log('done!');}
        }, options );
        let dfd = $.Deferred();
  
        /**
         * Prevent any collisions with function context.
         * @type {Object}
         */
        let that = '';
        /**
         * Allows us to target the element.
         * @type {jQuery}
         */
        element = $(element);
        /**
         * Grab the elements original text.
         * @type {String}
         */
        let originalText = element.text();
        /**
         * Full fledged class containing the glitch effect,
         * Will contain other glitch effects. Where currently
         * the only effect is "randomly" glitching each char.
         *
         * @return {function}
         */
        let TextScramble = (function(){
          let that = {};
          function TextScramble (elementRefrence,chars) {
            if(chars === undefined){
              that.chars = settings.chars;
            }
            that.element = elementRefrence;
            that.originalText = settings.finalText || elementRefrence.text();
            that.scrambledText = initalizeScramble();
          }
          /**
           * Random Scramble
           * @return {Array}                List of chars randomized.
           */
          function initalizeScramble(){
            let scrambleSet = []
            for (var i = 0; i < that.originalText.length; i++) {
              scrambleSet.push(randomChar())
            }
            return scrambleSet;
          }
          /**
           * Randomly return a char from the set of chars defined
           * @return {String}                A char from that.chars
           */
          function randomChar() {
            return that.chars[Math.floor(Math.random() * that.chars.length)];
          }
          /**
           * Updates a specific character from a given string with a supplied
           * char.
           *
           * @param {String}            str   The string we're updating.
           * @param {Int}               index The point of which updating occurs.
           * @param {String}            chr   The character we're replacing.
           * @credit {@darrenplace}
           */
          function setCharAt(str,index,chr) {
            if(index > str.length-1) return str;
            return str.substr(0,index) + chr + str.substr(index+1);
          }
          /**
           * Targets a specific char from that.originalText to glitch.
           *
           * @param  {Int}              index location in that.originalText
           *                                  to which we will target.
           * @return {Promise}          Resolves once the character has resolved
           *                            it's originalText.
           */
          function animateChar(index){
            let dfd = $.Deferred();
            let timeDiff = Math.floor(Math.random() * 40) + 10;
            let animateAmount = Math.floor(Math.random() * 2) + settings.charTime;
  
            // TODO: @darrenplace would love if we converted this to a fps specifc
            // algorythim
  
            //
            /**
             * Animation effect served through setInterval.
             * @resolve                 When the original char was set.
             */
            let intervalSignit = setInterval(function(){
              if(animateAmount === 0){
                clearInterval(intervalSignit);
                dfd.resolve();
                that.element.text(
                  setCharAt(
                    that.element.text(),
                    index,
                    that.originalText.charAt(index)
                  )
                );
              }
              else{
                that.element.text(
                  setCharAt(
                    that.element.text(),
                    index,
                    randomChar()
                  )
                );
                animateAmount--;
              }
            }, timeDiff);
  
  
            return dfd.promise();
          }
          /**
           * Obtains the randomly generated scrambledText.
           *
           * @scope  {global}
           * @return {String}                joins the scrambledText array.
           */
          TextScramble.prototype.getScrambledText = function(){
            return that.scrambledText.join("");
          }
          /**
           * Executes the animation
           * @resolve                         When the elements text is
           *                                  originalText is set.
           * @return {Promise}                Passes a promise for chaining.
           */
          TextScramble.prototype.animate = function(){
            let dfd = $.Deferred();
            let promiseChain = [];
  
            /**
             * Each character is animated on their own timeframe.
             * A rough rendition of "randomly" animating the glitch effect.
             * // TODO: Make this an effect
             */
            for (var i = 0; i < element.text().length; i++) {
              promiseChain.push(animateChar(i));
            }
            Promise.all(promiseChain)
              .then(function(){
                dfd.resolve();
              });
            return dfd.promise();
          }
          return TextScramble;
        })();
        /**
         * Initalize the effect with a reference of the elmeent passed.
         * @type {TextScramble}
         */
        let effect = new TextScramble(element)
        /**
         * Change the elements text to a generally scrambled Text
         */
        element.text(effect.getScrambledText());
        /**
         * Animate the glitch effect
         */
        effect.animate()
          .then(function(){
            settings.done(element);
          })
  
      });
    };
  })(jQuery);