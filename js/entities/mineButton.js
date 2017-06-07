game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.mineButton = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y, player) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: game.texture,
            region : "buttonSquare_blue",
            player : {}
        } ]);

        // offset of the two used images in the texture
        this.unclicked_region = game.texture.getRegion("buttonSquare_blue");
        this.clicked_region = game.texture.getRegion("buttonSquare_blue_pressed");


        this.player = player;



        this.name = "mineButton";
        this.alwaysUpdate = true;

        this.anchorPoint.set(0, 0);
        this.setOpacity(0.9);


        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = "Mine";

        // only the parent container is a floating object
        this.floating = false;

        console.log(this);
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
        //console.log(this.player);
        me.game.world.addChild(new game.buildMineIcon(100, 100));
        // don't propagate the event
        return false;
    },

    //move to build callls movePlayerTo, and buildSomething function.
    moveToBuild : function (x, y) {
        //melon likes it better when I create new vars to pass
        var newx = x;
        var newy = y;
        this.player.movePlayerTo(newx,newy+25);
        this.player.buildSomething(newx, newy, "mineObject");
    },

    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    }
});
