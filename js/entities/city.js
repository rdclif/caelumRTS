
game.City = game.playerObject.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "city",
            name: "Builder",
            width: 128,
            height: 128,
            framewidth: 128,
            training: false,
            trainx: 0,
            trainy: 0,
            trainType: "",
            trainTime: 0
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.trainTime = 0;

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

        if (this.training) {
            this.trainPlayer()
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
        if (!(this.training)) {
            //still has bugs
            var hud = me.game.world.getChildByName("UIPanel")[0];
            hud.cityPanel(this);
            hud.addChild(new game.progressBar(150, 32));
        }
    },

    callTraining : function (x,y,string) {
        this.trainx = x;
        this.trainy = y;
        this.trainType = string;
        this.training = true;
        this.trainTime = 0;
    },

    trainPlayer : function () {
        var progress =  me.game.world.getChildByName("progressBar")[0];
        if (progress) {
            progress.updateProgress(1, 1000);
        }
        this.trainTime += 1;
        if (this.trainTime >= 1000) {
            //TODO: move spawn loacation if space is occupied
            me.game.world.addChild(me.pool.pull(this.trainType, this.trainx+60, this.trainy+110));
            this.trainTime = 0;
            this.training = false;
            this.trainType = "";
        }
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


