
game.cBuilder = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "cBuilder",
            name: "cBuilder",
            pool : "",
            width : 25,
            height : 35,
            framewidth : 36,
            frameheight: 48,
            newX: 0,
            newY: 0,
            direction: "stand",
            walk: false,
            building: false,
            buildx: 0,
            buildy: 0,
            buildType: "",
            buildTime: 1
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;


        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("right",  [3, 4, 5]);
        this.renderable.addAnimation("up",  [0, 1, 2]);
        this.renderable.addAnimation("down",  [6, 7, 8]);
        this.renderable.addAnimation("left",  [9, 10, 11]);
        this.renderable.addAnimation("build",  [12, 13, 14]);
        // define a standing animation (using the frame)
        this.renderable.addAnimation("stand",  [7]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");

        this.pool = "builderComputer";

        this.collision = false;
        this.collisionX = x;
        this.collisionY = y;

        this.maxHP = BUILDER_HP;
        this.hp = BUILDER_HP;

        this.site = {};

        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.setId();

    },

    /*
     * update the player pos
     */
    update : function (dt) {
        if (this.collision === true && this.walk === false) {
            this.newX = this.collisionX;
            this.newY = this.collisionY;
            this.collision = false;
            this.walk = true
        }

        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;

        if (Math.abs(distx) > this.width / 4 || Math.abs(disty) > this.height / 4) {
            if (!(this.isSpaceOccupied(this.newX, this.newY))) {
                this.moveObject(distx, disty);
                if (!this.renderable.isCurrentAnimation(this.direction)) {
                    this.renderable.setCurrentAnimation(this.direction);
                }
            } else {
                //space occupied, can't walk to or build here
                this.build = false;
                this.walk = false;
                this.body.vel.x = 0;
                this.body.vel.y = 0;
            }
        } else {
            this.walk = false;
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }


        if (!(this.walk) && !(this.building)) {
            this.renderable.setCurrentAnimation("stand");
        }


        if (this.building && this.walk==false && this.collision ==false) {
            this.buildBuilding();
            if (!this.renderable.isCurrentAnimation("build")) {
                this.renderable.setCurrentAnimation("build");
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(game.playerObject, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    buildBuilding : function () {
        //TODO: add different times for building type
        this.buildTime += 1;
        if (this.buildTime === 1) {
            this.site = new game.buildingSite(this.buildx-50, this.buildy-50);
            me.game.world.addChild(this.site);
        }

        if (this.buildTime >= 1000) {
            me.game.world.removeChild(this.site);
            me.game.world.addChild(me.pool.pull(this.buildType, this.buildx-50, this.buildy-50));
            this.buildTime = 0;
            this.building = false;
            this.buildType = "";
        }

    },

    movePlayerTo :function (x, y) {
        this.newX = Math.round(x);
        this.newY = Math.round(y);
        this.walk = true;
    },

    moveObject : function(distx, disty){
        if (this.walk) {
            var angle = Math.atan2(disty, distx);
            this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
            this.body.vel.y = Math.sin(angle) * this.body.accel.y * me.timer.tick;

            if (Math.abs(distx) > Math.abs(disty)) {
                this.direction = ( distx > 0) ? "right" : "left";

            } else {
                this.direction = ( disty > 0) ? "down" : "up";
            }
        }
    },

    buildSomething : function (x, y, string) {
        //check if something there first
	    if (!(this.isSpaceOccupied(x,y))) {
			if (string === "barracksComputerObject") {
                if (game.data.goldCounter >= BARRACKS_COST_GOLD) {
                    this.buildx = x;
                    this.buildy = y;
                    this.buildType = string;
                    this.building = true;
                    this.buildTime = 0;
                    game.data.goldCounter_comp -= BARRACKS_COST_GOLD;
                    this.hud.remove();
                }
            }
            if (string === "farmComputerObject") {
                //console.log(game.data.goldCounter_comp);
				if (string === "farmComputerObject") {
					//console.log(game.data.goldCounter_comp);
					if (game.data.goldCounter_comp >= FARM_COST_GOLD) {
						this.buildx = x;
						this.buildy = y;
						this.buildType = string;
						this.building = true;
						this.buildTime = 0;
						game.data.goldCounter_comp -= FARM_COST_GOLD;
					}
				}
            }
			if (string === "mineComputerObject") {
                if (game.data.goldCounter >= MINE_COST_GOLD) {
                    this.buildx = x;
                    this.buildy = y;
                    this.buildType = string;
                    this.building = true;
                    this.buildTime = 0;
                    game.data.goldCounter_comp -= MINE_COST_GOLD;
                    this.hud.remove();
                }
            }
        } 
		else {
	        console.log("builder space occupied");
	        this.walk = false;
        }
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
    onCollision : function (response, other) {
        if (response.a == this) {
            switch (response.b.body.collisionType) {
                case me.collision.types.PLAYER_OBJECT:
                    if (this.walk) {
                        console.log(this.sId);
                        return this.collisionEvent(response.b);
                    } else {
                        return true;
                    }
                case me.collision.types.ENEMY_OBJECT:
                    if (this.walk) {
                        console.log(this.sId);
                        return this.collisionEvent(response.b);
                    } else {
                        return true;
                    }
                case me.collision.types.WORLD_SHAPE:
                    if (this.walk) {
                        console.log(this.sId);
                        return this.collisionEvent(response.b);
                    } else {
                        return true;
                    }
                case me.collision.types.ACTION_OBJECT:
                    return false;
                default:
                    //console.log("other");
                    return false;
            }
        } else {
            switch (response.a.body.collisionType) {
                case me.collision.types.PLAYER_OBJECT:
                    if (response.a.walk){
                        console.log(this.sId);
                        return false;
                    }
                    return true;
                case me.collision.types.ENEMY_OBJECT:
                    if (response.a.walk){
                        console.log(this.sId);
                        return false;
                    }
                    return true;
                case me.collision.types.WORLD_SHAPE:
                    //console.log("world");
                    return false;
                case me.collision.types.ACTION_OBJECT:
                    return false;
                default:
                    //console.log("other");
                    return false;
            }
        }
    }

});
