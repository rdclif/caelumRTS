/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

        init: function (x, y) {
            // call the constructor
            this._super(me.Container, "init", [x, y]);

            this.height = 125;
            this.width = 190;

            this.pos.x = me.game.viewport.width-this.width;
            this.pos.y = me.game.viewport.height-this.height;


            this.anchorPoint.set(0, 0);

            // persistent across level change
            this.isPersistent = true;

            // make sure our object is always draw first
            this.z = Infinity;

            this.floating = true;

            // give a name
            this.name = "UIPanel";

            // back panel sprite
            this.panelSprite = game.texture.createSpriteFromName("panel_brown");
            this.panelSprite.anchorPoint.set(0, 0);
            // scale to match the container size
            this.panelSprite.scale(
                this.width / this.panelSprite.width,
                this.height / this.panelSprite.height
            );
            this.addChild(this.panelSprite);


            // input status flags
            this.selected = false;
            this.hover = false;
            // to memorize where we grab the shape
            this.grabOffset = new me.Vector2d(0, 0);
        }

});


