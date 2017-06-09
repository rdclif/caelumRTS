game.UI = game.UI || {};

/**
 * a basic button control
 */
game.UI.alertBox = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y, cont, string) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: "dialog",
            height: 100,
            width: 400,
            framewidth: 400,
            container : {}
        } ]);

        this.container = cont;

        this.anchorPoint.set(0, 0);
        //this.setOpacity(0.8);

        this.name = "alertBox";
        this.alwaysUpdate = true;

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";
        this.font.textBaseline = "middle";

        this.label = string;
		
		this.active = false;
        this.z = Infinity;

        // only the parent container is a floating object
        this.floating = false;
    },

    /**
     * function called when the object is clicked on
     */
    onClick : function (/* event */) {
        this.container.remove();
        //console.log(this);
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

game.UI.storyBox = me.GUI_Object.extend({
    /**
     * constructor
     */
    init: function(x, y, cont, string) {
        this._super(me.GUI_Object, "init", [ x, y, {
            image: "dialog",
            height: 100,
            width: 400,
            framewidth: 400,
            container : {}
        } ]);

        this.container = cont;

        this.anchorPoint.set(0, 0);
        //this.setOpacity(0.8);

        this.name = "storyBox";
        this.alwaysUpdate = true;

        this.font = new me.Font("kenpixel", 12, "black");
        this.font.textAlign = "center";

        this.label = string;

        this.active = false;
        this.z = Infinity;

        // only the parent container is a floating object
        this.floating = false;
    },

    /**
     * function called when the object is clicked on
     */
    onClick : function (/* event */) {
        this.container.remove();
        //console.log(this);
        return false;
    },



    draw: function(renderer) {
        this._super(me.GUI_Object, "draw", [ renderer ]);
        this.font.draw(renderer,
            this.label,
            this.pos.x + this.width / 2,
            (this.pos.y + this.height / 2 - 35)
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

game.UI.hudText = me.Renderable.extend({

    // constructor
    init: function (x, y, w, h, string) {
        this._super(me.Renderable, 'init', [x, y, w, h]);

        this.font = new me.Font("kenpixel", 9, "#8B0000");

        this.label = string;

        this.name = "hudText";

    },


    update: function (dt) {
        return true;
    },

    draw: function (renderer) {
        this.font.draw(renderer, this.label, this.pos.x, this.pos.y);
    },


    onDestroyEvent: function () {
        return true;
    }
});


