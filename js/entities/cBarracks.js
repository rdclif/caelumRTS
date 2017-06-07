
game.cBarracks = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "cBarracks",
            name: "cBarracks",
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

		this.player = me.game.world.getChildByName("cpu")[0];

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.maxHP = BARRACKS_HP;
        this.hp = BARRACKS_HP;

        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.setId();

        this.pool = "barracksComputerObject";

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
        //clear hud
        me.game.world.getChildByName("UIPanel")[0].remove();

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
		//console.log("Inside callTraining");
		//console.log("Gold: " + game.data.goldCounter_comp);
		//console.log("Food: " + game.data.foodCounter_comp);
		if (!this.training)
		{
			if (string === "soldierComputer") {
				if (game.data.goldCounter_comp >= SOLDIER_COST_GOLD && game.data.foodCounter_comp >= SOLDIER_COST_FOOD) {
					this.trainx = x;
					this.trainy = y;
					this.trainType = string;
					this.training = true;
					this.trainTime = 0;
					//console.log("Building soldier");
					game.data.goldCounter_comp -= SOLDIER_COST_GOLD;
					game.data.foodCounter_comp -= SOLDIER_COST_FOOD;
				}
				
				return;
			}
			if (string === "knightComputer") {
				if (game.data.goldCounter_comp >= KNIGHT_COST_GOLD && game.data.foodCounter_comp >= KNIGHT_COST_FOOD) {
					this.trainx = x;
					this.trainy = y;
					this.trainType = string;
					this.training = true;
					this.trainTime = 0;
					//console.log("Building knight");
					game.data.goldCounter_comp -= KNIGHT_COST_GOLD;
					game.data.foodCounter_comp -= KNIGHT_COST_FOOD;
				}
				
				return;
			}
			if (string === "catapultComputer") {
				if (game.data.goldCounter_comp >= CATAPULT_COST_GOLD && game.data.foodCounter_comp >= CATAPULT_COST_FOOD) {
					this.trainx = x;
					this.trainy = y;
					this.trainType = string;
					this.training = true;
					this.trainTime = 0;
					game.data.goldCounter_comp -= CATAPULT_COST_GOLD;
					game.data.foodCounter_comp -= CATAPULT_COST_FOOD;
				}
				
				return;
			} 	
		}
    },

    trainPlayer : function () {
        var timeToTrain = 20;
        //var progress =  me.game.world.getChildByName("progressBar")[0];
        //if (progress) {
        //    progress.updateProgress(1, timeToTrain);
        //}
        this.trainTime += 1;
        if (this.trainTime >= timeToTrain) {
            //move spawn loacation if space is occupied
            var xLoc = this.trainx-60;
            var yLoc = this.trainy+120;

            //move right if occupied
            while(this.isSpaceOccupied(xLoc, yLoc)) {
                xLoc -= 40;
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


