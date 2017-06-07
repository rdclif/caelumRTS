
//Arbitrary choice of Entity to hold game logic, don't actually need to render it 
game.AI_main = me.Entity.extend({
	/**
     * constructor
     */
    init: function () {

        this._super(me.Entity, "init", [0, 0, {
            name: "cpu",
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
		
		this.numUnits = {Builder: 0, Knight: 1, Soldier: 0, Catapult: 0};
		this.numBuildings = {Barracks: 0, City: 1, Farm: 0, Mine: 0};
		
		this.inProgress_Units = {Builder: 0, Knight: 0, Soldier: 0, Catapult: 0};
		this.inProgress_Buildings = {Barracks: 0, City: 0, Farm: 0, Mine: 0};
		this.inProgress_Locations = new Array();
		
		this.foodIncome = 0;
		this.goldIncome = 0;							  
    },
	

	onDestroyEvent : function() {
		//alert("Making sure cpu dies when game ends");

    },
	
    update : function (dt) {

		//Check victory conditions
		var city = me.game.world.getChildByName("cCity");
		var enemyCity = me.game.world.getChildByName("city");
	
		//If player city is destroyed, go to defeat screen
		if(city.length < 1)
		{
			me.state.change(me.state.GAME_END);		
		}
		if(enemyCity.length < 1)
		{
			me.state.change(me.state.GAMEOVER);
		}
	
	
		//Arbitrary limit on computer thinking speed to avoid bogging down the system
        this.counter += 1;
		//console.log(this.counter);
        if (this.counter >= AI_ACTION_INTERVAL) 
		{
            this.act = true;
            this.counter = 0;
        }

		if(this.act)
		{
			checkComputerRoster(this);
			
			//City position is used as a reference for all other building placement
			//Assumption is that there is only 1 city (by game design)
			city = me.game.world.getChildByName("cCity")[0];
			
			//Enemy city position is used as a reference for all movement
			//Assumption is that there is only 1 enemy city (by game design)
			enemyCity = me.game.world.getChildByName("city")[0];

			//Build some builders to construct rest of infrastructure
			if(this.numUnits.Builder < AI_TARGET_BUILDER)
			{
				//Get the city and instruct it to build more builders
				var spawnLocation_x = city.pos.x;
				var spawnLocation_y = city.pos.y;
				city.callTraining(spawnLocation_x, spawnLocation_y, "builderComputer", this);
				
			}
			
			/*
			//Try moving a unit somewhere (starting knight)
			var knightList = me.game.world.getChildByName("cKnight");
			//console.log(knight);
			if ( knightList.length > 0 )
			{
				for(x = 0; x < knightList.length; x++)
				{
					knight = knightList[x];
					if (!(knight.walk)) {
						//console.log(knight);
						var destinationX = 50;
						var destinationY = 50;
						knight.movePlayerTo(destinationX, destinationY);
					}
				}
			}
			
			var soldierList = me.game.world.getChildByName("cSoldier");
			if ( soldierList.length > 0 )
			{
				for(x = 0; x < soldierList.length; x++)
				{
					soldier = soldierList[x];
					if (!(soldier.walk)) {
						var destinationX = 50;
						var destinationY = 50;
						soldier.movePlayerTo(destinationX, destinationY);
					}
				}
			}

			var soldierList = me.game.world.getChildByName("cSoldier");
			if ( soldierList.length > 0 )
			{
				for(x = 0; x < soldierList.length; x++)
				{
					soldier = soldierList[x];
					if (!(soldier.walk)) {
						var destinationX = 50;
						var destinationY = 50;
						soldier.movePlayerTo(destinationX, destinationY);
					}
				}
			}
			*/

			var dest_x = enemyCity.pos.x;
			var dest_y = enemyCity.pos.y;
			//moveUnit("cKnight", 50, 50);
			//moveUnit("cKnight", dest_x, dest_y);
			attackWithUnit("cKnight", enemyCity);
			moveUnit("cSoldier", dest_x, dest_y);
			moveUnit("cCatapult", dest_x, dest_y);
			
			//Build up economy first
			//if (this.foodIncome < FOODPERTICK * 1 || this.goldIncome < GOLDPERTICK * 1)
			if( (this.numBuildings.Mine + this.inProgress_Buildings.Mine) < AI_TARGET_MINE )
			{
				buildBuilding("mineComputerObject", this);
			}
			
			else if( (this.numBuildings.Farm + this.inProgress_Buildings.Farm) < AI_TARGET_FARM )
			{
				buildBuilding("farmComputerObject", this);
			}
			
			//Prioritize production structures next
			else if ( (this.numBuildings.Barracks + this.inProgress_Buildings.Barracks) < 1)
			{
				buildBuilding("barracksComputerObject", this);
			}
			
			if (this.numBuildings.Barracks >= 1)
			{
				var barracks = me.game.world.getChildByName("cBarracks")[0];
				var bar_spawnLocation_x = barracks.pos.x;
				var bar_spawnLocation_y = barracks.pos.y;
				
				//console.log("Knights: " + this.numUnits.Knight);
				//console.log("Soldiers: " + this.numUnits.Soldier);
				if(this.numUnits.Knight < AI_TARGET_KNIGHT)
				{
					barracks.callTraining(bar_spawnLocation_x, bar_spawnLocation_y, "knightComputer");
					this.inProgress_Units.Knight += 1;
				}
				else if(this.numUnits.Soldier < AI_TARGET_SOLDIER)
				{
					barracks.callTraining(bar_spawnLocation_x, bar_spawnLocation_y, "soldierComputer");
					this.inProgress_Units.Soldier += 1;
				}
				else if(this.numUnits.Catapult < AI_TARGET_CATAPULT)
				{
					barracks.callTraining(bar_spawnLocation_x, bar_spawnLocation_y, "catapultComputer");
					this.inProgress_Units.Catapult += 1;
				}
			}
			
			
			this.act = false;
		}
		
		
		

	}

	
});