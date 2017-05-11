game.attackIcon = me.Entity.extend({
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

    },
    onActivateEvent: function () {
        //register on mouse/touch event
        me.input.registerPointerEvent("pointerdown", this, this.onClick.bind(this));
    },

    update : function (dt) {
        var x = me.game.viewport.localToWorld(me.input.pointer.pos.x,me.input.pointer.pos.y);
        this.pos.x = x.x;
        this.pos.y = x.y;
        return true;
    },

    onClick : function (event) {
        var x = me.game.viewport.localToWorld(me.input.pointer.pos.x,me.input.pointer.pos.y);
        //TODO: Attack Stuff

        me.game.world.removeChild(this);
        me.game.repaint();

    },
    onDestroyEvent : function() {
        me.game.world.updateChildBounds();
        me.input.releasePointerEvent("pointerdown", this);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        return false;
    }

});
