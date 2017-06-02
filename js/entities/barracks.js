
game.Barracks = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "barracks",
            name: "Barracks",
            pool: "",
            width: 90,
            height: 90,
            framewidth: 100,
            frameheight : 100,
            training: false,
            trainx: 0,
            trainy: 0,
            trainType: "",
            trainTime: 0
        }]);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.maxHP = 600;
        this.hp = 600;

        this.setId();

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;



        this.pool = "barracksObject";

    },

    /*
     * update the player pos
     */
    update: function (dt) {

        if (this.training) {
            this.trainPlayer()
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(game.playerObject, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onClick : function (event) {
        //alert(this.name);
        var hud = me.game.world.getChildByName("UIPanel")[0];
        hud.barracksPanel(this);
        hud.addChild(new game.progressBar(150, 32));

        //hp bar stuff
        var hp = me.game.world.getChildByName("hpBar")[0];
        if (hp) {
            me.game.world.removeChild(hp);
        }
        me.game.world.addChild(new game.hpBar(this.pos.x, this.pos.y, this.height, this));

		//Create selection box around newly selected object
		removeFromWorld("selectBox");
		createSelectionBox( this );

    },

    callTraining : function (x,y,string) {
        var menu = me.game.world.getChildByName("menuPanel")[0];
        if (!(this.training)) {
            if (string === "soldierPlayer") {
                if (game.data.goldCounter >= 200 && game.data.foodCounter >= 100) {
                    this.trainx = x;
                    this.trainy = y;
                    this.trainType = string;
                    this.training = true;
                    this.trainTime = 0;
                    game.data.goldCounter -= 200;
                    game.data.foodCounter -= 100;
                } else {
                    if (game.data.goldCounter < 200) {
                        menu.alert("You do not have enough gold.");
                    } else {
                        menu.alert("You do not have enough food.");
                    }
                }
            }
            if (string === "knightPlayer") {
                if (game.data.goldCounter >= 500 && game.data.foodCounter >= 200) {
                    this.trainx = x;
                    this.trainy = y;
                    this.trainType = string;
                    this.training = true;
                    this.trainTime = 0;
                    game.data.goldCounter -= 500;
                    game.data.foodCounter -= 200;
                } else {
                    if (game.data.goldCounter < 500) {
                        menu.alert("You do not have enough gold.");
                    } else {
                        menu.alert("You do not have enough food.");
                    }
                }
            }
            if (string === "catapultPlayer") {
                if (game.data.goldCounter >= 1000 && game.data.foodCounter >= 500) {
                    this.trainx = x;
                    this.trainy = y;
                    this.trainType = string;
                    this.training = true;
                    this.trainTime = 0;
                    game.data.goldCounter -= 1000;
                    game.data.foodCounter -= 500;
                } else {
                    if (game.data.goldCounter < 1000) {
                        menu.alert("You do not have enough gold.");
                    } else {
                        menu.alert("You do not have enough food.");
                    }
                }
            }
        } else {
            menu.alert("Already training");
        }
    },

    trainPlayer : function () {
        var timeToTrain = 200;
        var progress =  me.game.world.getChildByName("progressBar")[0];
        if (progress) {
            progress.updateProgress(1, timeToTrain);
        }
        this.trainTime += 1;
        if (this.trainTime >= timeToTrain) {
            //move spawn loacation if space is occupied
            var xLoc = this.trainx+60;
            var yLoc = this.trainy+100;

            //move right if occupied
            while(this.isSpaceOccupied(xLoc, yLoc)) {
                xLoc += 40;
            };
            me.game.world.addChild(me.pool.pull(this.trainType, xLoc, yLoc));
            this.trainTime = 0;
            this.training = false;
            this.trainType = "";
        }
    },
    onDestroyEvent : function() {
        me.input.releasePointerEvent("pointerdown", this);
        me.input.releasePointerEvent("pointerup", this);
        me.input.releasePointerEvent("pointercancel", this);
        me.event.unsubscribe(this.handler);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function (response, other) {
        //if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {

        return false;
    }
});


