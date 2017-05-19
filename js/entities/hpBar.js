game.hpBar = me.Entity.extend({
    /**
     * constructor
     */
    init : function (x, y, offset, sprite) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "hpBar",
            name : "hpBar",
            width : 45,
            height : 10,
            framewidth : 45,
            counter : 0,
            offset : 0,
            hp : 0,
            finish: 0,
            sprite:  {}
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

        this.renderable.setCurrentAnimation("full");
        this.finish = 0;
        this.hp = 100;
        this.offset = offset;

        this.sprite = sprite;

        this.finish = sprite.maxHP;

        console.log(this);

    },

    update : function (dt) {

        this.hp = this.sprite.hp;

        //hp bar position
        if (this.sprite.width > 80) {
            this.pos.x = this.sprite.pos.x + (this.sprite.width/2-15);
        } else {
            this.pos.x = this.sprite.pos.x - 5;
        }
        this.pos.y = this.sprite.pos.y+this.offset+5;

        //hp bar level
        if (this.sprite.hp <= 0 ) {

            if (!this.renderable.isCurrentAnimation("empty")) {
                this.renderable.setCurrentAnimation("empty");
            }
        } else if (this.sprite.hp <= this.finish*.10 ) {

            if (!this.renderable.isCurrentAnimation("start")) {
                this.renderable.setCurrentAnimation("start");
            }
        } else if (this.sprite.hp <= this.finish*.25) {
            if (!this.renderable.isCurrentAnimation("one")) {
                this.renderable.setCurrentAnimation("one");
            }
        } else if (this.sprite.hp <= this.finish*.50) {
            if (!this.renderable.isCurrentAnimation("two")) {
                this.renderable.setCurrentAnimation("two");
            }
        } else if (this.sprite.hp <= this.finish*.75) {
            if (!this.renderable.isCurrentAnimation("three")) {
                this.renderable.setCurrentAnimation("three");
            }
        } else if (this.sprite.hp <= this.finish*.90) {
            if (!this.renderable.isCurrentAnimation("four")) {
                this.renderable.setCurrentAnimation("four");
            }
        } else {
            if (!this.renderable.isCurrentAnimation("full")) {
                this.renderable.setCurrentAnimation("full");
            }
        }


        return true;
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
