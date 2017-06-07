
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

function setHardMode()
{
	if (game.data.hardMode)
	{
		//console.log("Hard Mode set");
		AI_ACTION_INTERVAL	= HARD_ACTION_INTERVAL;
		AI_TARGET_KNIGHT	= HARD_TARGET_KNIGHT;
		AI_TARGET_SOLDIER	= HARD_TARGET_SOLDIER;
		AI_TARGET_CATAPULT	= HARD_TARGET_CATAPULT;
		AI_TARGET_BUILDER	= HARD_TARGET_BUILDER;
		AI_TARGET_FARM		= HARD_TARGET_FARM;
		AI_TARGET_MINE		= HARD_TARGET_MINE;
	}
	else
	{
		//console.log("Normal mode");
		AI_ACTION_INTERVAL	= NORMAL_ACTION_INTERVAL;
		AI_TARGET_KNIGHT	= NORMAL_TARGET_KNIGHT;
		AI_TARGET_SOLDIER	= NORMAL_TARGET_SOLDIER;
		AI_TARGET_CATAPULT	= NORMAL_TARGET_CATAPULT;
		AI_TARGET_BUILDER	= NORMAL_TARGET_BUILDER;
		AI_TARGET_FARM		= NORMAL_TARGET_FARM;
		AI_TARGET_MINE		= NORMAL_TARGET_MINE;
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
	
	unitName = ["Builder", "Knight", "Soldier", "Catapult"];
	
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

function buildBuilding(buildingName, player)
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

		if(!idleBuilder)
		{
			return;
		}
		
		var buildLocation_x = city.pos.x + 100; 
		var buildLocation_y	= city.pos.y - 100;			
		while ( 	(builder.isSpaceOccupied(buildLocation_x, buildLocation_y)) 
				|| 	(checkInProgressSpaceOccupied(player.inProgress_Locations, buildLocation_x, buildLocation_y)) )
		{
			//buildLocation_x = city.pos.x - Math.floor(Math.random() * (200)) - 50;
			//buildLocation_y = city.pos.y - Math.floor(Math.random() * (200)) - 50;
			
			//Flip a coin, if 0, change the x location, if 1, change the y location
			var coin = Math.floor(Math.random() * 2);
			if( coin == 0)
			{
				buildLocation_x -= AI_BUILDING_SPACING;
			}
			else
			{
				buildLocation_y -= AI_BUILDING_SPACING;	
			}				
		}							
		

		builder.busy = true;
		builder.movePlayerTo(buildLocation_x, buildLocation_y+25);

		builder.buildSomething(buildLocation_x, buildLocation_y, buildingName);
		player.inProgress_Locations.push([buildLocation_x, buildLocation_y]);
		
	}
}

function checkInProgressSpaceOccupied(locations, x_pos, y_pos)
{
	//Locations is an array storing pairs of (x, y) values of building sites, so two buildings are not built on the same location
	for(x = 0; x < locations.length; x++)
	{
		if(x_pos == locations[x][0] && y_pos == locations[x][1])
		{
			return true;
		}
	}
	
	return false;
}

//May or may not be necessary
function buildUnit(unitName)
{
	var barracks = me.game.world.getChildByName("cBarracks");
}

function moveUnit(unitName, destinationX, destinationY)
{
	var unitList = me.game.world.getChildByName(unitName);
	if ( unitList.length > 0 )
	{
		for(x = 0; x < unitList.length; x++)
		{
			unit = unitList[x];
			if (!(unit.walk)) 
			{
				//console.log("Old X: " + destinationX + " Old Y: " + destinationY);
				while( unit.isSpaceOccupied(destinationX, destinationY) )
				{
					destinationX += 10;
					destinationY += 10;
				}
				//console.log("New X: " + destinationX + " New Y: " + destinationY);
				unit.movePlayerTo(destinationX, destinationY);
			}
		}
	}
}

function attackWithUnit(unitName, targetUnit)
{
	var unitList = me.game.world.getChildByName(unitName);
	if ( unitList.length > 0 )
	{
		for(x = 0; x < unitList.length; x++)
		{
			unit = unitList[x];
			//console.log(unit);
			//console.log(targetUnit);
			unit.movePlayerToAttack(targetUnit);
		}
	}
}