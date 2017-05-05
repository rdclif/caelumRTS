game.progressBar = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "progress",
            name : "progressBar",
            width : 20,
            height : 90,
            framewidth : 20,
            counter : 0,
            progress : 0,
            finish: 0
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.float = false;

        this.renderable.addAnimation("empty",  [0]);
        this.renderable.addAnimation("start",  [1]);
        this.renderable.addAnimation("one",  [2]);
        this.renderable.addAnimation("two",  [3]);
        this.renderable.addAnimation("three",  [4]);
        this.renderable.addAnimation("four",  [5]);
        this.renderable.addAnimation("full",  [6]);

        this.renderable.setCurrentAnimation("empty");
        this.progress = 0;
        this.finish = 0;


    },

    update : function (dt) {


        if (this.progress <= 0 ) {

            if (!this.renderable.isCurrentAnimation("empty")) {
                this.renderable.setCurrentAnimation("empty");
            }
        } else if (this.progress <= this.finish*.10 ) {

            if (!this.renderable.isCurrentAnimation("start")) {
                this.renderable.setCurrentAnimation("start");
            }
        } else if (this.progress <= this.finish*.25) {
            if (!this.renderable.isCurrentAnimation("one")) {
                this.renderable.setCurrentAnimation("one");
            }
        } else if (this.progress <= this.finish*.50) {
            if (!this.renderable.isCurrentAnimation("two")) {
                this.renderable.setCurrentAnimation("two");
            }
        } else if (this.progress <= this.finish*.75) {
            if (!this.renderable.isCurrentAnimation("three")) {
                this.renderable.setCurrentAnimation("three");
            }
        } else if (this.progress <= this.finish*.90) {
            if (!this.renderable.isCurrentAnimation("four")) {
                this.renderable.setCurrentAnimation("four");
            }
        } else {
            if (!this.renderable.isCurrentAnimation("full")) {
                this.renderable.setCurrentAnimation("full");
            }
        }

        if (this.progress >= this.finish) {
            this.progress = .000;
            this.counter = 0;
            this.finish = 0;
        }

        return true;
    },

    updateProgress : function (inc, end) {
        this.finish = end;
        this.progress += inc;
    },

    onDestroyEvent : function() {
        me.game.world.updateChildBounds();
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        return false;
    }

});
