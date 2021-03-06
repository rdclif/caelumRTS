game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.attackButton = me.GUI_Object.extend({
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

        this.name = "attackButton";
        this.alwaysUpdate = true;

        this.anchorPoint.set(0, 0);
        this.setOpacity(0.9);

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = "Attack";

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
        removeFromWorld("moveIcon");
        me.game.world.addChild(new game.attackIcon(100, 100));
        // don't propagate the event
        return false;
    },
	
	    //movePointer calls this function - passes mouse x y back so this can call player movePlayerTo function
    movePlayerAttack : function (sprite) {
        if (sprite.body.collisionType === me.collision.types.ENEMY_OBJECT || sprite.body.collisionType === me.collision.types.PLAYER_OBJECT) {
            if (this.player.body.collisionType !== sprite.body.collisionType) {
                this.player.movePlayerToAttack(sprite);
                me.game.world.getChildByName("UIPanel")[0].remove();
                removeFromWorld("attackIcon");
            } else {
                console.log("can't attack own type!");
                me.game.world.getChildByName("UIPanel")[0].remove();
                removeFromWorld("attackIcon");
            }
        } else {
            console.log("can't attack this!");
            me.game.world.getChildByName("UIPanel")[0].remove();
            removeFromWorld("attackIcon");
        }
    },

    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    },
    update: function () {

		if(me.input.isKeyPressed('attack'))
		{
			removeFromWorld("moveIcon");
			me.game.world.addChild(new game.attackIcon(100, 100));
		}
		
        return this.selected || this.hover;
    }
});
