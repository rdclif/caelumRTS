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

        // make sure we use screen coordinates
        this.floating = true;

        this.anchorPoint.set(0,0);

        // give a name
        this.name = "HUD";

        this.addChild(new game.HUD.UIPanel(me.game.viewport.width-201, me.game.viewport.height-151, 200, 150));

    }
});



game.HUD.UIPanel = me.Container.extend({
    init: function(x, y, width, height) {
        // call the constructor
        this._super(me.Container, "init", [x, y, width, height]);

        this.anchorPoint.set(0, 0);

        // persistent across level change
        this.isPersistent = true;

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
    knightPanel : function () {
        this.addChild(new game.UI.cancelButton(12,80));
        this.addChild(new game.UI.moveButton(12, 15));
    },
    remove : function () {
        this.removeChildern(this.children[0]);
        this.removeChildern(this.children[0]);
    },

    removeChildern : function (child) {
        this._super(me.Container, "removeChildNow", [child]);
        this.updateChildBounds();
    },
    // update function
    update : function(dt) {
        return this._super(me.Container, "update", [ dt ]) || this.hover;
    }

});
