
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
            width: 36,
            height: 48,
            framewidth: 36,
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

        this.maxHP = 100;
        this.hp = 100;

        this.setId();

    },

    /*
     * update the player pos
     */
    update : function (dt) {

        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;

        if (Math.abs(distx) > this.width / 4 || Math.abs(disty) > this.height / 4) {
            this.moveObject(distx, disty);
            if (!this.renderable.isCurrentAnimation(this.direction)) {
                this.renderable.setCurrentAnimation(this.direction);
            }
        } else {
            this.walk = false;
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }


        if (!(this.walk) && !(this.building)) {
            this.renderable.setCurrentAnimation("stand");
        }


        if (this.building && this.walk==false) {
			console.log("building");
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

        if (this.buildTime >= 1000) {
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
	
		if (string === "farmComputerObject") {
			console.log(game.data.goldCounter_comp);
            if (game.data.goldCounter_comp >= 200) {
                this.buildx = x;
                this.buildy = y;
                this.buildType = string;
                this.building = true;
                this.buildTime = 0;
                game.data.goldCounter_comp -= 200;
            }
        }
		
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
        //Turning off collisions for now
        return false;
    }

});
