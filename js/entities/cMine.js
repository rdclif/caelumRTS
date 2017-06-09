
game.cMine = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "cMine",
            name: "cMine",
            pool: "",
            width: 90,
            height: 90,
            framewidth: 100,
            frameheight : 100,
        }]);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.pool = "mineComputerObject";

        this.maxHP = MINE_HP;
        this.hp = MINE_HP;

        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.setId();

        this.type = "structure";
        this.attack = false;
        this.attackObject = {};
        this.fighting = false;
        this.fightDirection = "left";
        this.fightTimer = 0;
        this.fightTurn = false;

    },

    /*
     * update the player pos
     */
    update: function (dt) {

		//computer earns food
        this.counter += 1;
        if (this.counter >= TIMETHRESHOLD_RESOURCES) {
            game.data.goldCounter_comp += GOLDPERTICK;
            this.counter = 0;
        }

        if (this.hp <= 0) {
			//Remove selection box if it is there
			removeFromWorld("selectBox", this);
            me.game.world.removeChild(this);
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


