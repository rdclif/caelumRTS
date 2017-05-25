game.playerObject = me.Entity.extend({
    /**
     * constructor
     */
    init: function (x, y, settings) {
        // ensure we do not create a default shape
        // call the super constructor
        this._super(me.Entity, "init", [x, y, settings]);

        // status flags
        this.selected = false;
        this.hover = false;
        this.alwaysUpdate = true;

        this.body.maxVel.x = 3;
        this.body.maxVel.y = 3;
        this.body.accel.x = 1.7;
        this.body.accel.y = 1.7;

        // to memorize where we grab the shape
        this.grabOffset = new me.Vector2d(0,0);

    },

    onActivateEvent: function () {
        //register on mouse/touch event
        me.input.registerPointerEvent("pointerdown", this, this.onSelect.bind(this));
        me.input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        me.input.registerPointerEvent("pointercancel", this, this.onRelease.bind(this));

        // register on the global pointermove event
        this.handler = me.event.subscribe(me.event.POINTERMOVE, this.pointerMove.bind(this));
    },

    /**
     * pointermove function
     */
    pointerMove: function (event) {
            this.hover = false;
            // move event is global (relative to the viewport)
            if (this.getBounds().containsPoint(event.gameX, event.gameY)) {
                // calculate the final coordinates
                var parentPos = this.ancestor.getBounds().pos;
                var x = event.gameX - this.pos.x - parentPos.x;
                var y = event.gameY - this.pos.y - parentPos.y;

                // the pointer event system will use the object bounding rect, check then with with all defined shapes
                for (var i = this.body.shapes.length, shape; i--, (shape = this.body.shapes[i]);) {
                    if (shape.containsPoint(x, y)) {
                        this.hover = true;
                        break;
                    }
                }
            }

            if (this.selected) {
                return false;
            }

    },
    // mouse down function
    onSelect : function (event) {
        if (this.hover === true && (!(game.data.pointerBusy))) {
            this.onClick(this);
            me.game.repaint();
        }

        return true;
    },

    // mouse up function
    onRelease : function (/*event*/) {
        this.selected = false;
        return false;
    },



    setId : function () {
        this.sId = game.data.idCounter;
        game.data.idCounter += 1;
    },

    loadHP : function (amt) {
        this.hp = amt;
    },

    //scan world objects for conflict
    isSpaceOccupied : function (x, y) {
        //var coord = me.game.viewport.localToWorld(x, y);
        for (var i in me.game.world.children) {
            if (me.game.world.children[i].sId || me.game.world.children[i].id) {
                if (me.game.world.children[i].containsPoint(x, y)) {
                    return true;
                }

            }
        }
        return false;
    },


    //This is bad right now... All the bugs!
    collisionEvent : function (object) {
        var height = object.getBounds().height;
        var width = object.getBounds().width;
        var loc = object.getBounds().pos;
        if (object.walk) {
            //TODO

        } else {
            if (width <= 50) {
                width = width * 2;
            }
            if (height <= this.height) {
                height = height * 2;
            }
            if (!(this.collision)) {
                this.collisionCounter = 0;
                this.collisionX = this.newX;
                this.collisionY = this.newY;
            }
            this.collision = true;
            this.collisionCounter += 1;

            if (this.direction === "right") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    if ((Math.abs(this.newY - this.pos.y)) > height) {
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x - 5;
                    } else {
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x - 5;
                    }
                } else {
                    if ((Math.abs(this.newY - this.pos.y)) > height) {
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x - 5;

                    } else {
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x - 5;
                    }
                }
            } else if (this.direction === "left") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    if ((Math.abs(this.newY - this.pos.y)) > height) {
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x + 5;
                    } else {
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x + 5;
                    }
                } else {
                    if ((Math.abs(this.newY - this.pos.y)) > height) {
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x + 5;
                    } else {
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x + 5;
                    }
                }
            } else if (this.direction === "up") {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    if ((Math.abs(this.newX - this.pos.x)) > width) {
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width / 2;
                    }
                } else {
                    if ((Math.abs(this.newX - this.pos.x)) > width) {
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x + width / 2;
                    }
                }
            } else {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    if ((Math.abs(this.newX - this.pos.x)) > width) {
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width / 2;
                    }
                } else {
                    if ((Math.abs(this.newX - this.pos.x)) > width) {
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x + width / 2;
                    }

                }
            }
        }
    },


});
