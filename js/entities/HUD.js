/**
 * a HUD container and child items
 */
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({
    init: function () {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        this.alwaysUpdate = true;
        // make sure we use screen coordinates
        //this.floating = true;

        this.anchorPoint.set(0,0);

        this.floating = true;

        // give a name
        this.name = "HUD";

    }
});



game.HUD.UIPanel = me.Container.extend({
    init: function(x, y, width, height) {
        // call the constructor
        this._super(me.Container, "init", [x, y, width, height]);

        this.anchorPoint.set(0, 0);


        // persistent across level change
        this.isPersistent = true;


        this.alwaysUpdate = true;

        this.floating = true;

        // give a name
        this.name = "UIPanel";

        // back panel sprite
        this.panelSprite = game.texture.createSpriteFromName("panel_brown");
        this.panelSprite.anchorPoint.set(0, 0);
        this.panelSprite.name = "panel";
        // scale to match the container size
        this.panelSprite.scale(
            this.width / this.panelSprite.width,
            this.height / this.panelSprite.height
        );
        this.addChild(this.panelSprite);

    },

    barracksPanel : function (barracks) {
        this.remove();
        this.addChild(new game.UI.soldierButton(12,15, barracks));
        this.addChild(new game.UI.knightButton(70,15, barracks));
        this.addChild(new game.UI.catapultButton(70,80,barracks));
        this.addChild(new game.UI.cancelButton(12,80));
    },

    builderPanel : function (builder) {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
        this.addChild(new game.UI.moveButton(12, 15, builder));
        this.addChild(new game.UI.buildButton(70, 15, builder));
    },

    buildPanel : function (builder) {
        this.remove();
        this.addChild(new game.UI.barracksButton(12,15, builder));
        this.addChild(new game.UI.farmButton(70, 15, builder));
        this.addChild(new game.UI.mineButton(70, 80, builder));
        this.addChild(new game.UI.cancelButton(12,80));
    },

    catapultPanel : function (catapult) {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
        this.addChild(new game.UI.moveButton(12, 15, catapult));
        this.addChild(new game.UI.attackButton(70, 15, catapult));
    },

    cityPanel : function (city) {
        this.remove();
        this.addChild(new game.UI.builderButton(12, 15, city));
        this.addChild(new game.UI.cancelButton(12,80));
        //this.addChild(new game.progressBar(150,35));
        //this.addChild(new game.UI.defeatButton(70, 15));
        //this.addChild(new game.UI.victoryButton(70, 80));

    },

    farmPanel : function () {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
    },

    knightPanel : function (knight) {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
        this.addChild(new game.UI.moveButton(12, 15, knight));
        this.addChild(new game.UI.attackButton(70, 15, knight));
    },

    minePanel : function () {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
    },

    soldierPanel : function (soldier) {
        this.remove();
        this.addChild(new game.UI.cancelButton(12,80));
        this.addChild(new game.UI.moveButton(12, 15, soldier));
        this.addChild(new game.UI.attackButton(70, 15, soldier));
    },


    remove : function () {
        while(this.children[0].name !== "panel") {
            this.removeChildren(this.children[0]);
        }
    },

    removeChildren : function (child) {
        this._super(me.Container, "removeChildNow", [child]);
        this.updateChildBounds();
    },
    draw : function (renderer) {
        //keeps HUD in front of all objects
        this.pos.z = Infinity;
        this._super(me.Container, "draw", [ renderer ]);
        this.updateChildBounds();
    }


});

game.HUD.menuPanel = me.Container.extend({
    init: function(x, y, width, height) {
        // call the constructor
        this._super(me.Container, "init", [x, y, width, height]);

        this.anchorPoint.set(0, 0);


        // persistent across level change
        this.isPersistent = true;


        this.alwaysUpdate = true;

        this.floating = true;

        // give a name
        this.name = "menuPanel";

        this.addChild(new game.UI.menuButton(0,0, this));
    },

    menu : function () {
        this.addChild(new game.UI.menuSaveButton(0,35, this));
		this.addChild(new game.UI.menuSoundButton(0,70, this));
		this.addChild(new game.UI.menuQuitButton(0,105, this));
		this.addChild(new game.UI.menuDebugButton(0,140, this));
    },
	
	
	soundmenu :function () {
		this.addChild(new game.UI.soundVolumeUpButton(105,35));
		this.addChild(new game.UI.soundVolumeDownButton(105,70));
		this.addChild(new game.UI.soundMuteButton(105,105));
	},
	
	debugmenu :function () {
		this.addChild(new game.UI.victoryButton(105,140));
		this.addChild(new game.UI.defeatButton(105,175));
	},

    remove : function () {
        while(this.children[0].name !== "menuButton") {
            this.removeChildren(this.children[0]);
        }
    },

    removeAll : function () {
        while(this.children.length > 0) {
            this.removeChildren(this.children[0]);
        }
    },

    removeChildren : function (child) {
        this._super(me.Container, "removeChildNow", [child]);
        this.updateChildBounds();
    },
    draw : function (renderer) {
        //keeps HUD in front of all objects
        this.pos.z = Infinity;
        this._super(me.Container, "draw", [ renderer ]);
        this.updateChildBounds();
    }


});

