
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
	x_center : 0,
	y_center : 0,
	x_offset : 0,
	y_offset : 0
    },


    // Run on page load.
    onload : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto", scaleMethod : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(debugPanel, "debug");
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAMEOVER, new game.DefeatScreen());
	    me.state.set(me.state.GAME_END, new game.VictoryScreen());


        game.texture = new me.video.renderer.Texture(
            me.loader.getJSON("menu"),
            me.loader.getImage("menu")
        );

        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.T,  "test");

        //set gravity to 0
        me.sys.gravity = 0;

        // add our player entity in the entity pool
        me.pool.register("catapultPlayer", game.Catapult);
        me.pool.register("knightPlayer", game.Knight);
        me.pool.register("soldierPlayer", game.Soldier);
	    me.pool.register("builderPlayer", game.Builder);
        me.pool.register("cityObject", game.City);
        me.pool.register("barracksObject", game.Barracks);
        me.pool.register("farmObject", game.Farm);
        me.pool.register("mineObject", game.Mine);

        // Start the game.
        me.state.change(me.state.MENU);
    }
};
