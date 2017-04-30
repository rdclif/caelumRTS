
game.selectIcon = me.Entity.extend({
    init: function(x, y, width) {
        //call the constructor
	this._super(game.playerObject, 'init', [x, y, {
            image : "barYellow_verticalBottom",
            name : "selectIcon",
            width : width,
            height : 10,
            framewidth : 36
        }]);

        this.anchorPoint.set(0, 0);


        this.alwaysUpdate = true;


    },

    update : function(dt) {
        return this._super(me.Entity, "update", [ dt ]);
    }



});
