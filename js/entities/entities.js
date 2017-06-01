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
    //works from input x & y
    isSpaceOccupied : function (x,y) {
        //var coord = me.game.viewport.localToWorld(x, y);

                for (var i in me.game.world.children) {
                    if (me.game.world.children[i].sId || me.game.world.children[i].id) {
                        if (me.game.world.children[i].containsPoint(x, y)) {
                            //console.log(me.game.world.children[i]);
                            return true;
                        }

                    }
                }

        return false;
    },

    //scan world objects for conflict
    //works on this centered this.x and this.y
    isThisSpaceOccupied : function () {
        console.log(this.pos.x);
        var co = me.game.viewport.localToWorld(this.pos.x, this.pos.y);
        for (var x = (co.x-(this.width/2)); x < (co.x + this.width); x+=1) {
            for (var y = (co.y-(this.height/2)); y < (co.y + this.height); y += 1) {
                for (var i in me.game.world.children) {
                    if (me.game.world.children[i].sId || me.game.world.children[i].id) {
                        if (me.game.world.children[i].containsPoint(x, y)) {
                            //console.log(me.game.world.children[i]);
                            return true;
                        }

                    }
                }
            }
        }
        return false;
    },


    //Still has issues, but getting better...
    collisionEvent : function (object) {
        var height = object.getBounds().height;
        var width = object.getBounds().width;
        var loc = object.getBounds().pos;
        if (object.walk === true ){
            console.log("both objects walking");
            if (!(this.collision)) {
                this.collisionX = this.newX;
                this.collisionY = this.newY;
            }
            this.collision = true;

            if (this.direction === "right") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    //walking right and hit upper part of object
                    if((loc.y+height) <= this.newY) {
                        //if the walk-to-point is lower then the object go down and around
                        this.newY = this.pos.y + height;
                        this.newX = this.pos.x - 5;
                    } else {
                        //else go up and around
                        this.newY = this.pos.y - height;
                        this.newX = this.pos.x - 5;
                    }
                } else {
                    //walking right and hit lower part of object
                    if(loc.y >= this.newY) {
                        //if the walk-to-point is higher then the object go up and around
                        this.newY = this.pos.y - height;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go down and around
                        this.newY = this.pos.y + height;
                        this.newX = this.pos.x - 5;
                    }
                }
            } else if (this.direction === "left") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    //walking left and hit upper half of object
                    if((loc.y+height) <= this.newY) {
                        //if the walk-to-point is lower then the object go down and around
                        this.newY = this.pos.y + height;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go up and around
                        this.newY = this.pos.y - height;
                        this.newX = this.pos.x + 5;
                    }

                } else {
                    //walking left and hit lower half of object
                    if(loc.y >= this.newY) {
                        //if the walk-to-point is higher then the object go up and around
                        this.newY = this.pos.y - height;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go down and around
                        this.newY = this.pos.y + height;
                        this.newX = this.pos.x + 5;
                    }
                }
            } else if (this.direction === "up") {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    //walking up and hit left side of object
                    if ((loc.x + width) <= this.newX) {
                        //if the walk-to-point is further right then the object go right and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x + width;
                    } else {
                        //else go left and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width;
                    }
                } else {
                    //walking up and hit right side of object
                    if ((loc.x) >= this.newX) {
                        //if the walk-to-point is further left then the object go left and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width;
                    } else {
                        //else go right and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x + width;
                    }

                }
            } else {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    //walking down and hit left side of object
                    if ((loc.x + width) <= this.newX) {
                        //if the walk-to-point is further right then the object go right and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x + width;
                    } else {
                        //else go left and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width;
                    }

                } else {
                    //walking down and hit right side of object
                    if ((loc.x) >= this.newX) {
                        //if the walk-to-point is further left then the object go left and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width;
                    } else {
                        //else go right and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x + width;
                    }
                }
            }


        }else {

            if (width <= 50) {
                width = width * 2;
            }
            if (height <= this.height) {
                height = height * 4;
            }
            if (!(this.collision)) {
                this.collisionX = this.newX;
                this.collisionY = this.newY;
            }
            this.collision = true;

            if (this.direction === "right") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    //walking right and hit upper part of object
                    if((loc.y+height) <= this.newY) {
                        //if the walk-to-point is lower then the object go down and around
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x - 5;
                    } else {
                        //else go up and around
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x - 5;
                    }
                } else {
                    //walking right and hit lower part of object
                    if(loc.y >= this.newY) {
                        //if the walk-to-point is higher then the object go up and around
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go down and around
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x - 5;
                    }
                }
            } else if (this.direction === "left") {
                if ((loc.y + (height / 2)) > this.pos.y) {
                    //walking left and hit upper half of object
                    if((loc.y+height) <= this.newY) {
                        //if the walk-to-point is lower then the object go down and around
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go up and around
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x + 5;
                    }

                } else {
                    //walking left and hit lower half of object
                    if(loc.y >= this.newY) {
                        //if the walk-to-point is higher then the object go up and around
                        this.newY = this.pos.y - height / 2;
                        this.newX = this.pos.x + 5;
                    } else {
                        //else go down and around
                        this.newY = this.pos.y + height / 2;
                        this.newX = this.pos.x + 5;
                    }
                }
            } else if (this.direction === "up") {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    //walking up and hit left side of object
                    if ((loc.x + width) <= this.newX) {
                        //if the walk-to-point is further right then the object go right and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x + width / 2;
                    } else {
                        //else go left and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width / 2;
                    }
                } else {
                    //walking up and hit right side of object
                    if ((loc.x) >= this.newX) {
                        //if the walk-to-point is further left then the object go left and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        //else go right and around
                        this.newY = this.pos.y + 5;
                        this.newX = this.pos.x + width / 2;
                    }

                }
            } else {
                if ((loc.x + (width / 2)) > this.pos.x) {
                    //walking down and hit left side of object
                    if ((loc.x + width) <= this.newX) {
                        //if the walk-to-point is further right then the object go right and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x + width / 2;
                    } else {
                        //else go left and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width / 2;
                    }

                } else {
                    //walking down and hit right side of object
                    if ((loc.x) >= this.newX) {
                        //if the walk-to-point is further left then the object go left and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x - width / 2;
                    } else {
                        //else go right and around
                        this.newY = this.pos.y - 5;
                        this.newX = this.pos.x + width / 2;
                    }
                }
            }
        }
    },


});
