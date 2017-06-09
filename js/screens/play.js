game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {

        //load map
        me.levelDirector.loadLevel("Map3");
		me.audio.playTrack("bensound-acousticbreeze");
        this.handle = me.event.subscribe(me.event.KEYDOWN, this.keyPressed.bind(this));
        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.UIPanel(me.game.viewport.width-201, me.game.viewport.height-151, 200, 150);
        me.game.world.addChild(this.HUD, Infinity);

        //gold and food
        this.text = new game.HUD.Container();
        me.game.world.addChild(this.text);

        //menu
        this.menu = new game.HUD.menuPanel(0,0, 50, 50);
        me.game.world.addChild(this.menu, Infinity);


        // if the loadSave bool set, calls load function
        if (game.data.loadSave) {
            this.loadSave();


            //else load a new game
        } else {

            me.game.world.addChild(me.pool.pull("knightPlayer", 300, 300));
            me.game.world.addChild(me.pool.pull("cityObject", 100, 150));

            //load computer player units
            var level  = me.levelDirector.getCurrentLevel();

            me.game.world.addChild(me.pool.pull("knightComputer", level.width-300, level.height-100));
            me.game.world.addChild(me.pool.pull("cityComputerObject", level.width-300, level.height-300));



            // reset the score - temp increase for testing
            game.data.score = 0;
            game.data.foodCounter = PLAYER_START_FOOD;
            game.data.goldCounter = PLAYER_START_GOLD;
            game.data.foodCounter_comp = COMPUTER_START_FOOD;
            game.data.goldCounter_comp = COMPUTER_START_GOLD;
			setHardMode();
        }
		
		//Load computer player logic
		this.AI_logic = new game.AI_main();
		me.game.world.addChild(this.AI_logic);

        me.game.world.getChildByName("menuPanel")[0].story("An enemy from far away has entered into your lands and constructed a\n new city! It appears they are setting up for an attack. You must defend\n your territory! Destroy their city before they destroy yours.\n\nHurry, there is no time to waste!");
    },
    keyPressed: function (action /*, keyCode, edge */) {

        // navigate the map :)
        if (action === "left") {
            me.game.viewport.move(-(me.levelDirector.getCurrentLevel().tilewidth ), 0);

        } else if (action === "right") {
            me.game.viewport.move(me.levelDirector.getCurrentLevel().tilewidth , 0);

        }

        if (action === "up") {
            me.game.viewport.move(0, -(me.levelDirector.getCurrentLevel().tileheight ));

        } else if (action === "down") {
            me.game.viewport.move(0, me.levelDirector.getCurrentLevel().tileheight );
        }

        // force redraw
        me.game.repaint();

    },

    loadSave : function () {

        var sprites = JSON.parse(localStorage.getItem("me.save.sprites"));
        var idcounter = JSON.parse(localStorage.getItem("me.save.idCounter"));
        var food = JSON.parse(localStorage.getItem("me.save.Food"));
        var gold = JSON.parse(localStorage.getItem("me.save.Gold"));
        var hard = JSON.parse(localStorage.getItem("me.save.Hard"));
        //console.log(sprites);

        game.data.idCounter = idcounter;
        game.data.goldCounter = gold;
        game.data.foodCounter = food;
        game.data.hardMode = hard;

        for (var x = 0; x < sprites.length; x += 1) {
            var sprite = sprites[x];
            var added = me.game.world.addChild(me.pool.pull(sprite.pool, sprite.x, sprite.y));
            added.loadHP(sprite.hp);
        }
        game.data.loadSave = 0;
		setHardMode();
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
