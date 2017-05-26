
//Arbitrary choice of Entity to hold game logic, don't actually need to render it 
game.AI_main = me.Entity.extend({
	/**
     * constructor
     */
    init: function () {

        this._super(me.Entity, "init", [0, 0, {
            name: "cpu_1",
            width: 0,
            height: 0
        }]);

		this.alpha = 0;
		this.counter = 0;
		this.alwaysUpdate = true;
		this.food = game.data.foodCounter_comp;
        this.gold = game.data.goldCounter_comp;
		this.act = false;
		
		
		this.numTimes = 0;
		
		//Only has default numbers for unit/building counts, need to modify for loading files later on 
		this.numUnits = {Builder: 0, Knight: 1, Catapult: 0};
		this.numBuildings = {Barracks: 0, City: 1, Farm: 0, Mine: 0};
		
    },
	

	onDestroyEvent : function() {
		alert("Making sure cpu dies when game ends");
    },
	
    update : function (dt) {

		//Arbitrary limit on computer thinking speed to avoid bogging down the system
        this.counter += 1;
        if (this.counter == 0 || this.counter >= 100) {
            this.act = true;
            this.counter = 0;
        }

		if(this.act)
		{
			//console.log("Before");
			//console.log(this.numUnits);
			checkComputerRoster(this);
			//console.log("After");
			//console.log(this.numUnits);
			console.log(this.numBuildings);
		
			//Try just creating up to 3 builders (right now unit numbers list is not incremented, so always stays at 0)
			if(this.numUnits.Builder < 3)
			{
				//Get the city and instruct it to build more builders
				//Assumption is that there is only 1 city (by game design)
				var city = me.game.world.getChildByName("cCity");
				//console.log(city);
				if ( city.length > 0 )
				{
					city = city[0];
					//console.log(city);
					var spawnLocation_x = city.pos.x;
					var spawnLocation_y = city.pos.y;
					city.callTraining(spawnLocation_x, spawnLocation_y, "builderComputer", this);
				}
			}
			
			//Try moving a unit somewhere (starting knight)
			var knight = me.game.world.getChildByName("cKnight");
			//console.log(knight);
			if ( knight.length > 0 )
			{
				knight = knight[0];
				//console.log(knight);
				var destinationX = 50;
				var destinationY = 50;
				knight.movePlayerTo(destinationX, destinationY);
			}

			
			var builder = me.game.world.getChildByName("cBuilder");
			//console.log(builder);
			if ( builder.length > 0 )
			{
				builder = builder[builder.length - 1];
				if(!builder.busy)
				{
					//console.log(builder);
					var buildLocation_x = Math.floor(Math.random() * (1400 - 100)) + 100;
					var buildLocation_y = Math.floor(Math.random() * (1400 - 100)) + 100;
					builder.busy = true;
					builder.movePlayerTo(buildLocation_x, buildLocation_y+25);
					builder.buildSomething(buildLocation_x, buildLocation_y, "farmComputerObject");
				}
			}
			
		}
	
	}

	
});