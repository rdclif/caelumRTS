game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {

        //load map
        me.levelDirector.loadLevel("Map2");
		me.audio.playTrack("bensound-acousticbreeze");
        this.handle = me.event.subscribe(me.event.KEYDOWN, this.keyPressed.bind(this));
        me.game.world.addChild(me.pool.pull("knightPlayer", 100, 100));
        me.game.world.addChild(me.pool.pull("cityObject", 300, 300));
        


        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.UIPanel(me.game.viewport.width-201, me.game.viewport.height-151, 200, 150);
        me.game.world.addChild(this.HUD);

        var menu = new game.HUD.menuPanel(0,0, 50, 50);
        me.game.world.addChild(menu);



    },
    keyPressed: function (action /*, keyCode, edge */) {

        // navigate the map :)
        if (action === "left") {
            me.game.viewport.move(-(me.levelDirector.getCurrentLevel().tilewidth / 2), 0);

        } else if (action === "right") {
            me.game.viewport.move(me.levelDirector.getCurrentLevel().tilewidth / 2, 0);

        }

        if (action === "up") {
            me.game.viewport.move(0, -(me.levelDirector.getCurrentLevel().tileheight / 2));

        } else if (action === "down") {
            me.game.viewport.move(0, me.levelDirector.getCurrentLevel().tileheight / 2);
        }

        // force redraw
        me.game.repaint();

    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
