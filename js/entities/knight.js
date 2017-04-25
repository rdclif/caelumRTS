
game.Knight = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y, settings) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, settings]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.collidable = true;

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

    },

    /*
     * update the player pos
     */
    update : function (dt) {

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(game.playerObject, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onClick : function (event) {
        var panel = new game.UI.Container(this.pos.x-100, this.pos.y-150, 250, 150, "KNIGHT");

        panel.addChild(new game.UI.ButtonUI(
            30, 45,
            "grey",
            "Move"
        ));
        panel.addChild(new game.UI.ButtonUI(
            30, 90,
            "grey",
            "Attack"
        )
        );

        // add the panel to word (root) container
        me.game.world.addChild(panel);

    },

    onDestroyEvent : function() {

    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        return true;
    }

});