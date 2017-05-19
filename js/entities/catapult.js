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
            width : 72,
            height : 72,
            framewidth : 72,
            newX : 0,
            newY : 0,
            direction : "stand",
            walk : false
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("right",  [2, 7]);
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

        this.setId();

    },

    update : function (dt) {
        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;

        if (Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4) {
            this.moveObject(distx, disty);
            if (this.direction == "left"){
                this.renderable.flipX(true);
                this.direction = "right";
                if (!this.renderable.isCurrentAnimation(this.direction)) {
                    this.renderable.setCurrentAnimation(this.direction);
                }
            }
            else {
                this.renderable.flipX(false);
                if (!this.renderable.isCurrentAnimation(this.direction)) {
                    this.renderable.setCurrentAnimation(this.direction);
                }
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

    onClick : function (event) {
	    //alert(this.name);
	    var hud = me.game.world.getChildByName("UIPanel")[0];
	    hud.catapultPanel(this);

	    //me.game.world.addChild(new game.selectIcon(this.pos.x, this.pos.y, 36));
	    //me.game.world.addChild(new game.selectIcon(this.pos.x + 26, this.pos.y + 55, 36));

        //hp bar stuff
        var hp = me.game.world.getChildByName("hpBar")[0];
        if (hp) {
            me.game.world.removeChild(hp);
        }
        me.game.world.addChild(new game.hpBar(this.pos.x, this.pos.y, this.height, this));


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
        return false;
    }

});
