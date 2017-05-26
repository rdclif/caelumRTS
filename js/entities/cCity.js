
game.cCity = game.playerObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "cCity",
            name: "cCity",
            pool: "",
            width: 128,
            height: 128,
            framewidth: 128,
            training: false,
            trainx: 0,
            trainy: 0,
            trainType: "",
            trainTime: 0
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.trainTime = 0;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.pool = "cityComputerObject";

        this.maxHP = 1000;
        this.hp = 1000;

        this.setId();

    },

    /*
     * update the player pos
     */
    update: function (dt) {

        if (this.training) {
            this.trainPlayer(this.player)
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

    callTraining : function (x, y, string, player) {
		//Can only start training units when not busy
		if(!this.training)
		{
			if (string === "builderComputer") {
				if(game.data.goldCounter_comp >= 100 && game.data.foodCounter_comp >= 50) {
					this.trainx = x;
					this.trainy = y;
					this.trainType = string;
					this.training = true;
					this.trainTime = 0;
					this.player = player;
					game.data.goldCounter_comp -= 100;
					game.data.foodCounter_comp -= 50;
				}

			}
		}
    },

    trainPlayer : function (player) {
        var timeToTrain = 200;
        var progress =  me.game.world.getChildByName("progressBar")[0];
        if (progress) {
            progress.updateProgress(1, timeToTrain);
        }
        this.trainTime += 1;
        if (this.trainTime >= timeToTrain) {
            //TODO: move spawn loacation if space is occupied
            me.game.world.addChild(me.pool.pull(this.trainType, this.trainx+60, this.trainy+110));
            this.trainTime = 0;
            this.training = false;
			//Probably will be removed - alternate implementation
			//incrementComputerUnitList(player, this.trainType);
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


