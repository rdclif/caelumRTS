game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {

        //load map
        me.levelDirector.loadLevel("Map2");
		me.audio.playTrack("bensound-acousticbreeze");
        this.handle = me.event.subscribe(me.event.KEYDOWN, this.keyPressed.bind(this));
        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.UIPanel(me.game.viewport.width-201, me.game.viewport.height-151, 200, 150);
        me.game.world.addChild(this.HUD);
        this.text = new game.HUD.Container();
        me.game.world.addChild(this.text);


        this.menu = new game.HUD.menuPanel(0,0, 50, 50);
        me.game.world.addChild(this.menu);


        if (game.data.loadSave) {
            this.loadSave();

        } else {

            me.game.world.addChild(me.pool.pull("knightPlayer", 100, 100));
            me.game.world.addChild(me.pool.pull("cityObject", 300, 300));

            // reset the score
            game.data.score = 0;
            game.data.foodCounter = 500;
            game.data.goldCounter = 1000;

        }

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

    loadSave : function () {

        var sprites = JSON.parse(localStorage.getItem("me.save.sprites"));
        var idcounter = JSON.parse(localStorage.getItem("me.save.idCounter"));
        var food = JSON.parse(localStorage.getItem("me.save.Food"));
        var gold = JSON.parse(localStorage.getItem("me.save.Gold"));
        console.log(sprites);

        game.data.idCounter = idcounter;
        game.data.goldCounter = gold;
        game.data.foodCounter = food;

        for (var x = 0; x < sprites.length; x += 1) {
            var sprite = sprites[x];
            var added = me.game.world.addChild(me.pool.pull(sprite.pool, sprite.x, sprite.y));
            added.loadHP(sprite.hp);
        }
        game.data.loadSave = 0;
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        this.HUD.remove();
        me.game.world.removeChild(this.HUD);
        me.game.world.removeChild(this.text);
        this.menu.removeAll()
        me.game.world.removeChild(this.menu);
        me.audio.stopTrack();
    }
});
