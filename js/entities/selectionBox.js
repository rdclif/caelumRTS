 game.selectionBox = me.Renderable.extend({
	 
	init : function (x, y, width, height, hOffset, vOffset, sprite) {
    // call the constructor
	this._super(me.Renderable, "init", [x, y, width, height]);
		// ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        this.float = false;
		this.name = "selectBox";
        this.sprite = sprite;
		
		this.hOffset = hOffset;
		this.vOffset = vOffset;
		
    },

    draw : function(renderer) {
        renderer.setColor('#a7b2ba');
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },
	
	onDestroyEvent : function() {
        me.game.world.updateChildBounds();
    },
	
    update : function(dt) {
		this.pos.x = this.sprite.pos.x + this.hOffset;
        this.pos.y = this.sprite.pos.y + this.vOffset;
    }
});