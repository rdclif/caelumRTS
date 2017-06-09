game.attackIcon = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "cursorSword_silver",
            name : "attackIcon",
            width : 34,
            height : 37,
            framewidth : 34
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.float = true;

        this.body.collisionType = me.collision.types.ACTION_OBJECT;
        this.collisionBool = false;

    },

    update : function (dt) {
        //prevent click on collidable objects
        this.collisionBool = true;
        //prevent click on clickable  objects
        game.data.pointerBusy = true;
        var x = me.game.viewport.localToWorld(me.input.pointer.pos.x,me.input.pointer.pos.y);
        this.pos.x = x.x;
        this.pos.y = x.y;
        this.body.update(dt);
        me.collision.check(this);
        return false;
    },

    //override the entity.js function
    pointerMove: function (event) {
        this.hover = true;
        this.selected = true;
        return false;
    },
    //override the entity.js function
    onSelect : function (event) {
        this.onClick(event);
    },

    onClick : function (event) {
        //TODO: Attack Stuff
        var click = this.isSpaceOccupied(this.pos.x, this.pos.y, true);
        if (this.collisionBool && (click !== false)) {
            var attackButton = me.game.world.getChildByName("attackButton")[0];
            attackButton.movePlayerAttack(click);
            me.game.world.removeChild(this);
            me.game.repaint();
        }

    },
    onDestroyEvent : function() {
        game.data.pointerBusy = false;
        me.game.world.updateChildBounds();
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
        switch (response.b.body.collisionType) {
            case me.collision.types.PLAYER_OBJECT:
                //this.collisionBool = false;
                //console.log("player");
                return false;
            case me.collision.types.ENEMY_OBJECT:
                this.collisionBool = true;
                //console.log("enemy");
                return false;
            case me.collision.types.WORLD_SHAPE:
                //this.collisionBool = false;
                //console.log("world");
                return false;
            case me.collision.types.ACTION_OBJECT:
                return false;
            default:
                //console.log("other");
                return false;
        }
    }

});
