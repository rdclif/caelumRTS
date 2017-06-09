game.DefeatScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        //TItle screen
        var backgroundImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('defeat_screen')
        });

        backgroundImage.anchorPoint.set(0, 0);
        backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);

        // add to the world container
        me.game.world.addChild(backgroundImage, 1);

        me.game.world.addChild(new game.UI.playAgainButton(me.game.viewport.width / 2 - 100, me.game.viewport.height - 70));

        // add a new renderable component with the scrolling text
        me.game.world.addChild(new (me.Renderable.extend({

            // constructor
            init: function () {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

                this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

            },


            update: function (dt) {
                return true;
            },

            draw: function (renderer) {
                this.font.draw(renderer, "Defeat", me.game.viewport.width / 2 - 85, 40);
            },


            onDestroyEvent: function () {
                return true;
            }
        })), 2);

	},



    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
		// TODO
    }
});
