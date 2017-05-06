 game.selectionBox = me.Renderable.extend({
    init : function(x, y, width, height) {
        // position, width, height
        this._super(me.Renderable, "init", [x, y, width, height]);
        this.z = 100;
    },

    draw : function(renderer) {
        renderer.setColor('#ffffff');
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },

    update : function() {
        return false;
    }
});