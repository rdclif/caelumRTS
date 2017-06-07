game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.cancelButton = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y, player) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: game.texture,
            region : "buttonSquare_blue"
        } ]);

        // offset of the two used images in the texture
        this.unclicked_region = game.texture.getRegion("buttonSquare_blue");
        this.clicked_region = game.texture.getRegion("buttonSquare_blue_pressed");

        this.anchorPoint.set(0, 0);
        this.setOpacity(0.9);

        this.name = "cancelButton";
        this.alwaysUpdate = true;

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = "Cancel";

        this.player = player;

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

        var hud = me.game.world.getChildByName("UIPanel")[0];
        hud.remove();
        var hp = me.game.world.getChildByName("hpBar")[0];
        if (hp) {
            me.game.world.removeChild(hp);
        }
	    removeFromWorld("buildmineIcon");
        removeFromWorld("moveIcon");
        removeFromWorld("buildFarmIcon");
        removeFromWorld("buildBarracksIcon");


		//Function in utils.js
		removeFromWorld("selectBox");

		removeFromWorld("attackIcon");

		if (this.player) {
		    if (this.player.walk || this.player.attack) {
                this.player.stopWalkOrFight();
            }
        }

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
