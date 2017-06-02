
game.City = game.playerObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "city",
            name: "city",
            pool: "",
            width: 110,
            height: 110,
            framewidth: 128,
            frameheight: 128,
            training: false,
            trainx: 0,
            trainy: 0,
            trainType: "",
            trainTime: 0
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.trainTime = 0;

        this.name = "city";

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.pool = "cityObject";

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.maxHP = 1000;
        this.hp = 1000;

        this.setId();

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
        if (!(this.training)) {
            //still has bugs
            var hud = me.game.world.getChildByName("UIPanel")[0];
            hud.cityPanel(this);
            hud.addChild(new game.progressBar(150, 32));
        }

        //hp bar stuff
        var hp = me.game.world.getChildByName("hpBar")[0];
        //remove if one already exists
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
            if (string === "builderPlayer") {
                if (game.data.goldCounter >= 100 && game.data.foodCounter >= 50) {
                    this.trainx = x;
                    this.trainy = y;
                    this.trainType = string;
                    this.training = true;
                    this.trainTime = 0;
                    game.data.goldCounter -= 100;
                    game.data.foodCounter -= 50;
                }
                else {
                    if (game.data.goldCounter < 100) {
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
            var yLoc = this.trainy+125;

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

        return false;
    }
});


