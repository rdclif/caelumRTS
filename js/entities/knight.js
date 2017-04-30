
game.Knight = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "knight",
            name : "Knight",
            width : 36,
            height : 48,
            framewidth : 36
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
	//alert(this.name);
	var hud = me.game.world.children[0].children[0];
	hud.knightPanel(this);

//	me.game.world.addChild(new game.selectIcon(this.pos.x, this.pos.y, 36));
	me.game.world.addChild(new game.selectIcon(this.pos.x + 26, this.pos.y + 55, 36));

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
