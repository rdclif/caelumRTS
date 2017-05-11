
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

    //save important data
    for (var x in me.game.world.children) {
        if (me.game.world.children[x].id) {
            this.data.push({
                "id" : me.game.world.children[x].id,
                "pool" : me.game.world.children[x].pool,
                "x" : me.game.world.children[x].pos.x,
                "y" : me.game.world.children[x].pos.y
            });

        }
    }
    //save sprites to local storage
    me.save.add({"sprites" : this.data});

};

game.save.object.prototype.load = function () {

    var sprites = JSON.parse(localStorage.getItem("me.save.sprites"));
    if (sprites) {
        var idcounter = JSON.parse(localStorage.getItem("me.save.idCounter"));
        var food = JSON.parse(localStorage.getItem("me.save.Food"));
        var gold = JSON.parse(localStorage.getItem("me.save.Gold"));
        console.log(sprites);
        var old;
        for (var y in me.game.world.children) {
            if (me.game.world.children[y].id) {
                old = me.game.world.children[y];
                console.log(old);
                me.game.world.removeChild(old);
            }
        }
        me.game.world.removeChild(old);

        game.data.idCounter = idcounter;
        game.data.goldCounter = gold;
        game.data.foodCounter = food;

        for (var x = 0; x < sprites.length; x += 1) {
            var sprite = sprites[x];
            me.game.world.addChild(me.pool.pull(sprite.pool, sprite.x, sprite.y));
        }
    }
    else {
        console.log("no save found");
    }
};
