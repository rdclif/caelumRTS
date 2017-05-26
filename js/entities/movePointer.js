game.moveIcon = game.playerObject.extend({
    /**
     * constructor
     */
    init : function (x, y) {
        // call the constructor
        this._super(game.playerObject, 'init', [x, y, {
            image : "iconCross_brown",
            name : "moveIcon",
            width : 16,
            height : 15,
            framewidth : 16
        }]);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.anchorPoint.set(0, 0);
        this.float = false;
        this.body.collisionType = me.collision.types.ACTION_OBJECT;
        this.collisionBool = true;


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
        // handle collisions against other shapes
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
        if (this.collisionBool && !(this.isSpaceOccupied(this.pos.x, this.pos.y))){
            var moveButton = me.game.world.getChildByName("moveButton")[0];
            var x = me.game.viewport.localToWorld(me.input.pointer.pos.x, me.input.pointer.pos.y);
            //not sure why but melon likes it better when I pass these as variables
            var xvar = x.x;
            var yvar = x.y;
            moveButton.movePlayer(xvar, yvar);
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
                this.collisionBool = false;
                //console.log("player");
                return false;
            case me.collision.types.ENEMY_OBJECT:
                this.collisionBool = false;
                //console.log("enemy");
                return false;
            case me.collision.types.WORLD_SHAPE:
                this.collisionBool = false;
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
