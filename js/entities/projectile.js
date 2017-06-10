game.Rock = me.Entity.extend({
    init : function (x, y, newx, newy, object) {
        this._super(me.Entity, "init", [x, y, { width: game.Rock.width, height: game.Rock.height }]);
        this.body.collisionType = me.collision.types.NO_OBJECT;
        this.renderable = new (me.Renderable.extend({
            init : function () {
                this._super(me.Renderable, "init", [0, 0, game.Rock.width, game.Rock.height]);
            },
            destroy : function () {},
            draw : function (renderer) {
                var color = renderer.getColor();
                renderer.setColor('#808080');
                renderer.fillRect(0, 0, this.width, this.height);
                renderer.setColor(color);
            }
        }));
        this.alwaysUpdate = true;
        this.newX = newx;
        this.newY = newy;

        this.body.maxVel.x = 4;
        this.body.maxVel.y = 4;
        this.body.accel.x = 2;
        this.body.accel.y = 2;

        this.attackObject = object;
    },

    update : function (time) {

        var distx = this.newX - this.pos.x;
        var disty = this.newY - this.pos.y;
        if (Math.abs(distx) > this.width/4 || Math.abs(disty) > this.height/4) {
            this.moveObject(distx, disty);
        } else {
            if (this.attackObject.type === "structure") {
                if (this.attackObject !== undefined) {
                    this.attackObject.renderable.setCurrentAnimation("attacked", "idle");
                }
            }
            var hit = Math.round((Math.random() * 6) + 1);
            hit = hit * CATAPULT_STRENGTH;
            if (this.attackObject.hp !== undefined) {
                this.attackObject.hp -= hit;
            }
            me.game.world.removeChild(this);
        }

        this.body.update();
        me.collision.check(this);

        return true;
    },

    moveObject : function(distx, disty){
        var angle = Math.atan2(disty, distx);

        //this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
        this.body.vel.x = Math.cos(angle) * this.body.accel.x * me.timer.tick;
        this.body.vel.y = Math.sin(angle) * this.body.accel.y * me.timer.tick;

    }


});

game.Rock.width = 5;
game.Rock.height = 5;