
function removeFromWorld( itemName )
{
	var itemList = me.game.world.getChildByName(itemName);
    if (itemList)
	{
		for (i = 0; i < itemList.length; i++)
		{
			me.game.world.removeChild(itemList[i]);
		}
    }
		
}

function createSelectionBox( selectedObject )
{
	//8 Rectangles total
	//Constructor inputs for selectionBox: function (x, y, width, height, hOffset, vOffset, sprite)
	var horizW = selectedObject.width / 3;
	var horizH = selectedObject.height / 10;
	var vertW = horizH;
	var vertH = horizW;
		
	//Upper Left Corner
	var hOffset = 0;
	var vOffset = 0;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													horizW, horizH,
													hOffset, vOffset,
													selectedObject));
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													vertW, vertH,
													hOffset, vOffset,
													selectedObject));
		
	//Upper Right Corner
	hOffset = selectedObject.width - horizW;
	vOffset = 0;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													horizW, horizH,
													hOffset, vOffset,
													selectedObject));
	hOffset = selectedObject.width - vertW;
	vOffset = 0;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													vertW, vertH,
													hOffset, vOffset,
													selectedObject));
		
	//Lower Left Corner
	hOffset = 0;
	vOffset = selectedObject.height;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													horizW, horizH,
													hOffset, vOffset,
													selectedObject));
	hOffset = 0;
	vOffset = selectedObject.height - vertH + vertW;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													vertW, vertH,
													hOffset, vOffset,
													selectedObject));
	
	//Lower Right Corner
	hOffset = selectedObject.width - horizW;
	vOffset = selectedObject.height;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													horizW, horizH, 
													hOffset, vOffset,
													selectedObject));
	hOffset = selectedObject.width - vertW;
	vOffset = selectedObject.height - vertH + vertW;
	me.game.world.addChild( new game.selectionBox(	selectedObject.pos.x + hOffset, 
													selectedObject.pos.y + vOffset, 
													vertW, vertH,
													hOffset, vOffset,
													selectedObject));
													
}


//May not be necessary depending on actual unit count implementation
function incrementComputerUnitList(player, nameStr)
{
	//Assumption is that name of unit/building is string of form "somethingComputer*", e.g. "builderComputer"
	substrIndex = nameStr.indexOf("Computer");
	//Only keep the chars before "Computer"
	nameStr = nameStr.substring(0, substrIndex);
	player.numUnits[nameStr]++;
}


function checkComputerRoster(player)
{
	
	unitName = ["Builder", "Knight", "Catapult"];
	
	for (x = 0; x < unitName.length; x++)
	{

		player.numUnits[unitName[x]] = me.game.world.getChildByName("c" + unitName[x]).length;
	}
	
	buildingName = ["Barracks", "City", "Farm", "Mine"];
	
	for (x = 0; x < buildingName.length; x++)
	{

		player.numBuildings[buildingName[x]] = me.game.world.getChildByName("c" + buildingName[x]).length;
	}

	player.food = game.data.foodCounter_comp;
    player.gold = game.data.goldCounter_comp;
	player.foodIncome = player.numBuildings["Farm"] * FOODPERTICK;
	player.goldIncome = player.numBuildings["Mine"] * GOLDPERTICK;
}

function buildBuilding(buildingName)
{
	//City position is used as a reference for all other building placement
	//Assumption is that there is only 1 city (by game design)
	var city = me.game.world.getChildByName("cCity")[0];
	
	var builder = me.game.world.getChildByName("cBuilder");
	var idleBuilder = false;
	if ( builder.length > 0 )
	{
		for (x = 0; x < builder.length; x++)
		{
			if ( !builder[x].busy )
			{
				builder = builder[x];
				idleBuilder = true;
				break;
			}
		}
		//builder = builder[builder.length - 1];
		//console.log(builder);
		//if(!builder.busy)
		//{
		//console.log("IDLES: " + idleBuilder);
		if(!idleBuilder)
		{
			return;
		}
							
		//var buildLocation_x = Math.floor(Math.random() * (1400 - 100)) + 100;
		//var buildLocation_y = Math.floor(Math.random() * (1400 - 100)) + 100;
		var buildLocation_x = city.pos.x - Math.floor(Math.random() * (700)) - 50;
		var buildLocation_y = city.pos.y - Math.floor(Math.random() * (700)) - 50;
						
		while ((builder.isSpaceOccupied(buildLocation_x, buildLocation_y)))
		{
			buildLocation_x = city.pos.x - Math.floor(Math.random() * (700)) - 50;
			buildLocation_y = city.pos.y - Math.floor(Math.random() * (700)) - 50;							
		}							
		
		console.log("New Assignment");
		console.log(game.data.goldCounter_comp);
		builder.busy = true;
		builder.movePlayerTo(buildLocation_x, buildLocation_y+25);
		console.log("X: " + buildLocation_x + " Y: " + buildLocation_y);
		builder.buildSomething(buildLocation_x, buildLocation_y, buildingName);
		
	}
}