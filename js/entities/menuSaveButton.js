game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.menuSaveButton = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y, cont) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: game.texture,
            region : "menu_up",
            container : {}
        } ]);

        // offset of the two used images in the texture
        this.unclicked_region = game.texture.getRegion("menu_up");
        this.clicked_region = game.texture.getRegion("menu_pressed");

        this.container = cont;

        this.pos.z = Infinity;

        this.anchorPoint.set(0, 0);
        //this.setOpacity(0.8);

        this.name = "menuSaveButton";
        this.alwaysUpdate = true;

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = "Save";

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
        //save important data
		game.data.saving = true;
		//me.game.world.getChildByName("menuPanel")[0].alert("Saving, please wait...");
        //me.saveGame.saveAll();
        this.container.remove();
        me.game.repaint();
        //deactivate menu menu button
        var menu = me.game.world.getChildByName("menuButton")[0];
        menu.active = false;
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
