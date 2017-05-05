game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.soldierButton = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: game.texture,
            region : "buttonSquare_blue",
        } ]);

        // offset of the two used images in the texture
        this.unclicked_region = game.texture.getRegion("buttonSquare_blue");
        this.clicked_region = game.texture.getRegion("buttonSquare_blue_pressed");

        this.anchorPoint.set(0, 0);
        this.setOpacity(0.9);

        this.alwaysUpdate = true;
        this.name = "soldierButton";

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = "Soldier";

        // only the parent container is a floating object
        this.floating = false;
    },

    /**
     * function called when the object is clicked on
     */
    onClick : function (/* event */) {
        this.setRegion(this.clicked_region);
        // account for the different sprite size
        this.pos.y += this.height - this.clicked_region.height ;
        this.height = this.clicked_region.height;

	//36 is the width of the builder sprite, should be standard for foot units
	    var spawnLocation_x = game.data.x_center + (game.data.x_offset / 2) - (36 / 2);
//	var spawnLocation_x = game.data.x_center;
	    var spawnLocation_y = game.data.y_center + game.data.y_offset;
//	var spawnLocation_y = game.data.y_center;

	//Function not implemented yet, so just pseudocode right now
	//if(checkPositionOccupied() )
	//	adjust position by one sprite width to left or right in alternating fashion

//console.log(game.data.x_center + " " + game.data.x_offset + ' ' + game.data.y_center + ' ' + game.data.y_offset);
	    me.game.world.addChild(me.pool.pull("soldierPlayer", spawnLocation_x, spawnLocation_y));

        // don't propagate the event
        return false;
    },

    /**
     * function called when the pointer button is released
     */
    onRelease : function (/* event */) {
        this.setRegion(this.unclicked_region);
        // account for the different sprite size
        this.pos.y -= this.unclicked_region.height - this.height;
        this.height = this.unclicked_region.height;
        var hud =  me.game.world.getChildByName("UIPanel")[0];

        me.game.repaint();
        return false;
    },



    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    },

    removeChildNow : function (child) {
        this._super(me.Container, "removeChildNow", [child]);
        this.updateChildBounds();
    },
    update: function () {
        return this.selected || this.hover;
    }
});
