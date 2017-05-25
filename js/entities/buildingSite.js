
game.buildingSite = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "buildingSite",
            name: "buildingSite",
            pool: "",
            width: 90,
            height: 80,
            framewidth: 100,
            frameheight : 100,
            counter:  0
        }]);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;


        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.pool = "buildingSite";

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.counter = 0;

        this.maxHP = 300;
        this.hp = 300;

        this.setId();

    },

    /*
     * update the player pos
     */
    update: function (dt) {


        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(game.playerObject, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onClick : function (event) {

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


