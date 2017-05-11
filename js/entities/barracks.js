
game.Barracks = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y ) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image: "barracks",
            name: "Barracks",
            pool: "",
            width: 100,
            height: 100,
            framewidth: 100,
            training: false,
            trainx: 0,
            trainy: 0,
            trainType: "",
            trainTime: 0
        }]);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.renderable.addAnimation("attacked", [1, 2]);

        // define a standing animation (using the frame)
        this.renderable.addAnimation("idle", [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("idle");

        this.setId();

        this.pool = "barracksObject";

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
        var hud = me.game.world.getChildByName("UIPanel")[0];
        hud.barracksPanel(this);
        hud.addChild(new game.progressBar(150, 32));

    },

    callTraining : function (x,y,string) {
        this.trainx = x;
        this.trainy = y;
        this.trainType = string;
        this.training = true;
        this.trainTime = 0;
    },

    trainPlayer : function () {
        var timeToTrain = 200;
        var progress =  me.game.world.getChildByName("progressBar")[0];
        if (progress) {
            progress.updateProgress(1, timeToTrain);
        }
        this.trainTime += 1;
        if (this.trainTime >= timeToTrain) {
            //TODO: move spawn loacation if space is occupied
            me.game.world.addChild(me.pool.pull(this.trainType, this.trainx+50, this.trainy+90));
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


