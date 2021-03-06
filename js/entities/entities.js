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


    movePlayerToAttack :function (sprite) {
        //console.log("attack called");
		if(sprite == undefined)
		{
			return;
		}
		
        if (sprite.name){
            if (sprite === this.attackObject) {
                //console.log("already attacking this");
            }else {
                if(sprite.name === "cBuilder") {
                    me.game.world.getChildByName("menuPanel")[0].alert("Where is your honor!? I cannot attack a poor defenseless builder...");
                } else {
                    this.attackObject = sprite;
                    this.newX = Math.round(Math.random() * ((sprite.pos.x + sprite.width) - (sprite.pos.x)) + (sprite.pos.x));
                    this.newY = Math.round(Math.random() * ((sprite.pos.y + sprite.height) - (sprite.pos.y)) + (sprite.pos.y));
                    this.collision = false;
                    this.walk = true;
                    this.attack = true;
                    this.fightTimer = 1;
                }
            }
        } else {
            if(sprite.name === "cBuilder") {
                me.game.world.getChildByName("menuPanel")[0].alert("Where is your honor? I cannot attack a poor defenseless builder...");
            } else {
                this.attackObject = sprite;
                this.newX = Math.round(Math.random() * ((sprite.pos.x + sprite.width) - (sprite.pos.x)) + (sprite.pos.x));
                this.newY = Math.round(Math.random() * ((sprite.pos.y + sprite.height) - (sprite.pos.y)) + (sprite.pos.y));
                this.collision = false;
                this.walk = true;
                this.attack = true;
                this.fightTimer = 1;
            }
        }

    },

    attackInRange : function () {
        if (this.attackObject.name) {
            var dist = this.distanceTo(this.attackObject);
            if (dist < this.range) {
                return true;
            }
        }
        return false;
    },

    allStop : function () {
        this.walk = false;
        this.newX = this.pos.x;
        this.newY = this.pos.y;
        this.body.vel.x = 0;
        this.body.vel.y = 0;
        if (this.type !== "structure") {
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }
    },


    //set up fight stuff
    attackCollision : function (sB) {
        if (sB.name) {
            if ((sB.pos.x + (sB.width / 2)) <= (this.pos.x + (this.width / 2))) {
                this.fightDirection = "left";
            } else {
                this.fightDirection = "right";
            }
        }
    },

    outOfPlay : function () {
        var level  = me.levelDirector.getCurrentLevel();
        if (this.pos.y < 0 || this.pos.x < 0) {
            me.game.world.removeChild(this);
        } else if (this.pos.y > level.height || this.pos.x > level.width) {
            me.game.world.removeChild(this);
        }
    },

    //only call on movable objects - called from cancel button
    stopWalkOrFight :function () {
        if (this.name === "Builder") {
            if (this.walk) {
                this.walk = false;
                this.building = false;
                this.collision = false;
                this.newX = this.pos.x;
                this.newY = this.pos.y;
            }
        } else {
            if (this.attack) {
                this.attackObject = {};
                this.newX = this.pos.x;
                this.newY = this.pos.y;
                this.walk = false;
                this.attack = false;
                this.fighting = false;
                this.collision = false;
            } else if (this.walk) {
                this.walk = false;
                this.attack = false;
                this.fighting = false;
                this.collision = false;
                this.newX = this.pos.x;
                this.newY = this.pos.y;
            }
        }
    },

    //
    fightHit : function (sprite, mult) {
        //console.log(sprite);
		if(sprite !== undefined)
		{
			if (sprite.type === "structure") {
			    if (sprite !== undefined) {
                    sprite.renderable.setCurrentAnimation("attacked", "idle");
                }
			}
			var hit = Math.round((Math.random() * 6) + 1);
			hit = hit * mult;
			sprite.hp -= hit;
		}
    },


    catFightHit : function (sprite, mult) {
        //console.log(sprite);
        if (sprite !== undefined){
            if (this.fightDirection === "left") {
                this.renderable.flipX(true);
            } else {
                this.renderable.flipX(false);
            }
            this.renderable.setCurrentAnimation("attack-side", "stand");
            me.game.world.addChild(new game.Rock((this.pos.x + (this.width / 2)), (this.pos.y + (this.height / 2)), (sprite.pos.x + (sprite.width / 2)), (sprite.pos.y + (sprite.height / 2)), sprite));
        }
    },


    checkAttackHP : function () {
        if (this.attackObject.name){
            if (this.attackObject.hp <= 0) {
                this.stopWalkOrFight()
            }
        }
    },

    attackSpriteOutRange : function () {
        if (this.attackObject.name) {
            if(this.attackObject.type !== "structure"){
                if (!(this.attackInRange())) {
                    this.fighting = false;
                }
            }
        }
    },

    //scan world objects for conflict
    //works from input x & y
    //if z = true returns the object clicked on or false
    isSpaceOccupied : function (x,y,z) {
        //var coord = me.game.viewport.localToWorld(x, y);
            for (var i in me.game.world.children) {
                if (me.game.world.children[i].sId || me.game.world.children[i].id) {
                    if (me.game.world.children[i].containsPoint(x, y)) {
                        //console.log(me.game.world.children[i]);
                        if (z) {
                            return me.game.world.children[i];
                        } else {
                            return true;
                        }
                    }

                }
            }
        return false;
    },

    //scan world objects for conflict
    //works on this centered this.x and this.y
    isThisSpaceOccupied : function () {
        var bounds = this.getBounds();
        var top = bounds.top - (bounds.height/2);
        var bottom = bounds.top + (bounds.height/2);
        var left = bounds.left - (bounds.width/2);
        var right = bounds.left + (bounds.width/2);

        for (var i in me.game.world.children) {
            if (me.game.world.children[i].sId || me.game.world.children[i].id) {
                if (me.game.world.children[i].containsPoint(left, top)) {
                    return true;
                } else if (me.game.world.children[i].containsPoint(left, bottom)) {
                    return true;
                } else if (me.game.world.children[i].containsPoint(right, top)) {
                    return true;
                } else if (me.game.world.children[i].containsPoint(right, bottom)) {
                    return true;
                } else if (me.game.world.children[i].containsPoint(bounds.right, bounds.top)) {
                    return true;
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
            //console.log("both objects walking");
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
            //only this object walking
            if (width <= 50) {
                width = width * 2;
            }
            if (height <= this.height) {
                height = height * 4;
            }
            //console.log(this);
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
        return true;
    }


});
