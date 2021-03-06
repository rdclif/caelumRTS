game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.menuSoundButton = me.GUI_Object.extend({
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

        this.label = "Sound";
		this.active = false;

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
        //TODO:  Sound Stuff
		
		if (this.active)
		{
			//alert("deleting");
			this.active = false;
			//console.log(this.container);
			
			//Relies on fact that the first 3 elements in array are the new buttons
			for (i = 0; i < 3; i++)
			{
				this.container.removeChild( this.container.getChildAt(i) );
				
			}
			
			//Possible alternate method, but doesn't work with what we have now, since it would require reorganization of children, may be worthwhile to do later
			/*
			this.container.forEach(function (child) {
				// do something with the child
				
				console.log(child);
				//child.remove();
			});*/

		}
		else
		{
			this.active = true;
		    this.container.soundmenu();
		}
		
        me.game.repaint();
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
