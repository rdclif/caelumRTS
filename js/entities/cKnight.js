game.cKnight = game.playerObject.extend({
        /**
         * constructor
         */
        init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "cKnight",
            name : "cKnight",
            pool : "",
            width : 25,
            height : 35,
            framewidth : 36,
            frameheight: 48,
            newX : 0,
            newY : 0,
            direction : "stand",
            walk : false
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("right",  [3, 4, 5]);
        this.renderable.addAnimation("up",  [0, 1, 2]);
        this.renderable.addAnimation("down",  [6, 7, 8]);
        this.renderable.addAnimation("left",  [9, 10, 11]);
        this.renderable.addAnimation("attack",  [12, 13, 14]);
        // define a standing animation (using the frame)
        this.renderable.addAnimation("stand",  [7]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
        this.newX = x;
        this.newY = y;

        this.pool = "knightComputer";

        this.maxHP = KNIGHT_HP;
        this.hp = KNIGHT_HP;
        this.range = KNIGHT_RANGE;
        this.attack = false;
        this.attackObject = {};
        this.fighting = false;
        this.fightDirection = "left";
        this.fightTimer = 1;
        this.fightTurn = false;
		this.beingAttacked = false;

		this.direction = "down";
		this.lastdirection = "down";
		
        this.collision = false;
        this.collisionX = x;
        this.collisionY = y;		
		
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.setId();

    },

    update : function (dt) {
        if (this.collision === true && this.walk === false && this.fighting === false) {
            this.newX = this.collisionX;
            this.newY = this.collisionY;
            this.collision = false;
            this.walk = true
        }

        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;


        if (this.attack) {
            if (this.attackInRange() || this.fighting) {
                this.body.vel.x = 0;
                this.body.vel.y = 0;
                this.attackCollision(this.attackObject);
                if (this.fightDirection === "right") {
                    this.renderable.flipX(true);
                } else {
                    this.renderable.flipX(false);
                }
                if (!this.renderable.isCurrentAnimation("attack")) {
                    this.renderable.setCurrentAnimation("attack");
                }
                this.fightTimer += 1;
            } else {
                this.renderable.flipX(false);
                if (Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4) {
                    this.moveObject(distx, disty);
                    if (!this.renderable.isCurrentAnimation(this.direction)) {
                        this.renderable.setCurrentAnimation(this.direction);
                    }
                } else  {
                    this.walk = false;
                    this.body.vel.x = 0;
                    this.body.vel.y = 0;
                }
            }
        } else if (Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4) {
            this.renderable.flipX(false);
            this.moveObject(distx, disty);
            if (!this.renderable.isCurrentAnimation(this.direction)) {
                this.renderable.setCurrentAnimation(this.direction);											 
            }
        } else  {
            this.walk = false;
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }

        //--
        if (!(this.walk) && !(this.attack)) {
            this.renderable.flipX(false);
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }

		if (this.fightTimer % 50 === 0) {
            this.fightHit(this.attackObject, SOLDIER_STRENGTH);
        }
		
		
        //this.checkAttackHP();							 
        //check own hp					  
        if (this.hp <= 0) {
            this.stopWalkOrFight();
			//console.log(this.attackObject.name);
			if(this.attackObject.name)
			{
				this.attackObject.stopWalkOrFight();
			}
			
			removeFromWorld("hpBar");
			//Remove selection box if it is there
			removeFromWorld("selectBox", this);
            me.game.world.removeChild(this);
        }

        //for following
        if (this.attack && this.fighting===false && this.attackObject.type !== "structure") {
            this.newX = this.attackObject.pos.x;
            this.newY = this.attackObject.pos.y;
            this.walk = true
        }

        this.attackSpriteOutRange();																							 
        //--

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
		this.attack = false;					  
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
                        //console.log(this.sId);
                        if (response.b === this.attackObject){
                            //console.log("allstop");
                            this.fighting = true;
                            this.allStop();
                            return true;
                        }
                        else {
                            return this.collisionEvent(response.b);
                        }
                    } else {
                        return true;
                    }
                case me.collision.types.ENEMY_OBJECT:
                    if (this.walk) {
                        //console.log(this.sId);
                        return this.collisionEvent(response.b);
                    } else {
                        return true;
                    }
                case me.collision.types.WORLD_SHAPE:
                    if (this.walk) {
                        //console.log(this.sId);
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
                        //console.log(this.sId);
                        return false;
                    }
                    return true;
                case me.collision.types.ENEMY_OBJECT:
                    if (response.a.walk){
                        //console.log(this.sId);
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
