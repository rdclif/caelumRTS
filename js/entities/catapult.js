game.Catapult = game.playerObject.extend({
        /**
         * constructor
         */
        init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "catapult",
            name : "Catapult",
            pool : "",
            width : 50,
            height : 50,
            framewidth : 72,
            frameheight : 72,
            newX : 0,
            newY : 0,
            direction : "stand",
            walk : false
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("right",  [2, 7]);
		this.renderable.addAnimation("left",   [1,6]);
        this.renderable.addAnimation("up",  [0, 5]);
        this.renderable.addAnimation("down",  [4, 9]);
        this.renderable.addAnimation("attack-up",  [5, 10, 15]);
        this.renderable.addAnimation("attack-side",  [7, 12, 17]);
        this.renderable.addAnimation("attack-down",  [9, 14, 19]);
        // define a standing animation (using the frame)
        this.renderable.addAnimation("stand",  [2]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
        this.newX = x;
        this.newY = y;

        this.pool = "catapultPlayer";

        this.maxHP = 100;
        this.hp = 100;
		this.range = 100;
		this.attack = false;


        this.collision = false;
        this.collisionX = x;
        this.collisionY = y;

        this.direction = "down";
		this.lastdirection = "down";

        this.menu = me.game.world.getChildByName("menuPanel")[0];
        this.hud = me.game.world.getChildByName("UIPanel")[0];

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.setId();

    },

    update : function (dt) {

        if (this.collision === true && this.walk === false) {
            this.newX = this.collisionX;
            this.newY = this.collisionY;
            this.collision = false;
            this.walk = true
        }

        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;
		if (this.attack == true ){
            if ((Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4)){
				if (!(this.isSpaceOccupied(this.newX, this.newY))) {
					this.moveObject(distx, disty);
					if (!this.renderable.isCurrentAnimation(this.direction)) {
						this.renderable.setCurrentAnimation(this.direction);
						this.lastdirection = this.direction //used later to animate correct angles of attack
					}	
				}					
			}
			else {
				this.walk = false;
				this.body.vel.x = 0;
				this.body.vel.y = 0;
			}
			
			if ((this.body.vel.x == 0)&&(this.body.vel.y==0))
			{		
				if (!this.renderable.isCurrentAnimation("attack-up")) {
                    this.renderable.setCurrentAnimation("attack-up");
			
                }
			
			}
		}		
		
        else if (Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4) {
            if (!(this.isSpaceOccupied(this.newX, this.newY))) {
                this.moveObject(distx, disty);
                if (!this.renderable.isCurrentAnimation(this.direction)) {
                    this.renderable.setCurrentAnimation(this.direction);
                }
            } else {
                this.walk = false;
                this.renderable.setCurrentAnimation( "stand" );
                this.body.vel.x = 0;
                this.body.vel.y = 0;
            }
        } else  {
            this.walk = false;
            this.renderable.setCurrentAnimation( "stand" );
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }




        this.body.update(dt);
        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(game.playerObject, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    movePlayerTo :function (x, y) {
        this.newX = Math.round(x);
        this.newY = Math.round(y);
        this.collision = false;
        this.walk = true;
        this.walk = true;
		this.attack = false;


    },
	
    movePlayerToAttack :function (x, y) {
        this.newX = Math.round(x);
        this.newY = Math.round(y);
        this.collision = false;
        this.walk = true;
		this.walk = true;
		this.attack = true;




		
    },
	

    moveObject : function(distx, disty){
        if (this.walk && this.attack){
            var angle = Math.atan2(disty, distx);
			console.log(8);
            //this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
            this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
            this.body.vel.y = Math.sin(angle) * this.body.accel.y * me.timer.tick;

            if (Math.abs(distx) > Math.abs(disty)) {
                this.direction = ( distx > 0) ? "right" : "left";

            } else {
                this.direction = ( disty > 0) ? "up" : "down";
            }
		
			
			
        }
		else if (this.walk){
            var angle = Math.atan2(disty, distx);
			console.log(7);

            ///this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
            this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
            this.body.vel.y = Math.sin(angle) * this.body.accel.y * me.timer.tick;

            if (Math.abs(distx) > Math.abs(disty)) {
                this.direction = ( distx > 0) ? "right" : "left";

            } else {
                this.direction = ( disty > 0) ? "up" : "down";
            }
        }	
		

		

    },

    onClick : function (event) {
	    //alert(this.name);
	    this.hud.catapultPanel(this);

	    //me.game.world.addChild(new game.selectIcon(this.pos.x, this.pos.y, 36));
	    //me.game.world.addChild(new game.selectIcon(this.pos.x + 26, this.pos.y + 55, 36));

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
