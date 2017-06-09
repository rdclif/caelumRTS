
game.save = game.save || {};

game.save.object = function () {
    this.data = [];
    this.name = "save";

};


game.save.object.prototype.removeSave = function () {
    //remove for replace
    me.save.remove("idCounter");
    me.save.remove("Gold");
    me.save.remove("Food");
    me.save.remove("sprites");
    me.save.remove("Hard");
};

game.save.object.prototype.saveAll = function () {
    //clear out old save
    this.removeSave();
	
    //clear storage for reload
    while (this.data.length > 0) {
        this.data.pop();
    }
    me.save.add({"idCounter": game.data.idCounter});
    me.save.add({"Gold": game.data.goldCounter});
    me.save.add({"Food": game.data.foodCounter});
    me.save.add({"Hard": game.data.hardMode});

    //save important data
    for (var x in me.game.world.children) {
        if (me.game.world.children[x].sId) {
            this.data.push({
                "id" : me.game.world.children[x].id,
                "pool" : me.game.world.children[x].pool,
                "x" : me.game.world.children[x].pos.x,
                "y" : me.game.world.children[x].pos.y,
                "hp" : me.game.world.children[x].hp
            });

        }
    }
    //save sprites to local storage
    me.save.add({"sprites" : this.data});
	
	
	me.game.world.getChildByName("menuPanel")[0].alert("Game saved successfully!");

};

game.save.object.prototype.load = function () {

    var sprites = JSON.parse(localStorage.getItem("me.save.sprites"));
    if (sprites) {
        game.data.loadSave = 1;
        me.state.change(me.state.PLAY);
    }
    else {

        console.log("no save found");
    }
};
