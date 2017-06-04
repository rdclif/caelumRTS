
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
		console.log(game.data.goldCounter_comp);
		this.act = false;
		
		
		this.numTimes = 0;
		
		//Only has default numbers for unit/building counts, need to modify for loading files later on 
		this.numUnits = {Builder: 0, Knight: 1, Catapult: 0};
		this.numBuildings = {Barracks: 0, City: 1, Farm: 0, Mine: 0};
		this.foodIncome = 0;
		this.goldIncome = 0;							  
    },
	

	onDestroyEvent : function() {
		alert("Making sure cpu dies when game ends");

    },
	
    update : function (dt) {

		//Arbitrary limit on computer thinking speed to avoid bogging down the system
        this.counter += 1;
        if (this.counter >= 100) {
            this.act = true;
            this.counter = 0;
        }

		if(this.act)
		{
			checkComputerRoster(this);
			
			//City position is used as a reference for all other building placement
			//Assumption is that there is only 1 city (by game design)
			var city = me.game.world.getChildByName("cCity")[0];
			
			//Enemy city position is used as a reference for all movement
			//Assumption is that there is only 1 enemy city (by game design)
			var enemyCity = me.game.world.getChildByName("City")[0];

			//Try just creating up to 3 builders (right now unit numbers list is not incremented, so always stays at 0)
			if(this.numUnits.Builder < 3)
			{
				//Get the city and instruct it to build more builders

				//console.log(city);
				var spawnLocation_x = city.pos.x;
				var spawnLocation_y = city.pos.y;
				city.callTraining(spawnLocation_x, spawnLocation_y, "builderComputer", this);
				
			}
			
			//Try moving a unit somewhere (starting knight)
			var knight = me.game.world.getChildByName("cKnight");
			//console.log(knight);
			if ( knight.length > 0 )
			{
				knight = knight[0];
				if (!(knight.walk)) {
                    //console.log(knight);
                    var destinationX = 50;
                    var destinationY = 50;
                    knight.movePlayerTo(destinationX, destinationY);
                }
			}

			
			var builder = me.game.world.getChildByName("cBuilder");
			if (this.foodIncome < FOODPERTICK * 4 || this.goldIncome < GOLDPERTICK * 4)
			{
				if (this.foodIncome < this.goldIncome)
				{
				
					//console.log(this.foodIncome);
					buildBuilding("farmComputerObject");
				}
				else
				{
					buildBuilding("mineComputerObject");					
				}
				/*
				if ( builder.length > 0 )
				{
					builder = builder[builder.length - 1];
					if(!builder.busy)
					{
							
						//var buildLocation_x = Math.floor(Math.random() * (1400 - 100)) + 100;
						//var buildLocation_y = Math.floor(Math.random() * (1400 - 100)) + 100;
						var buildLocation_x = city.pos.x - Math.floor(Math.random() * (200)) - 50;
						var buildLocation_y = city.pos.y - Math.floor(Math.random() * (200)) - 50;
						
						while ((builder.isSpaceOccupied(buildLocation_x, buildLocation_y)))
						{
							buildLocation_x = city.pos.x - Math.floor(Math.random() * (200)) - 50;
							buildLocation_y = city.pos.y - Math.floor(Math.random() * (200)) - 50;							
						}							
						
						builder.busy = true;
						builder.movePlayerTo(buildLocation_x, buildLocation_y+25);
						builder.buildSomething(buildLocation_x, buildLocation_y, "farmComputerObject");
					}
				}
				*/
			}
			
		}
	
	}

	
});