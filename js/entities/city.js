
game.City = game.playerObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, settings]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

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
        //alert(this.name);
        var hud = me.game.world.getChildByName("UIPanel")[0];
        hud.cityPanel(this);

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


