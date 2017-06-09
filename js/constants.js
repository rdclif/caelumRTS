//Constants stored here - Not actually constants to avoid potential older browser issues with const
//All values related to the game simulation and balance

//Resources
var TIMETHRESHOLD_RESOURCES = 200;
var FOODPERTICK				= 15;
var FOODPERTICK_CITY		= 30;
var GOLDPERTICK				= 25;
var GOLDPERTICK_CITY		= 40;
var PLAYER_START_FOOD		= 1000;
var PLAYER_START_GOLD		= 1000;
var COMPUTER_START_FOOD		= 2000;
var COMPUTER_START_GOLD		= 2000;

//Units
var KNIGHT_HP 			= 150;
var KNIGHT_STRENGTH     = 2;
var KNIGHT_RANGE		= 50;
var KNIGHT_BUILDTIME 	= 1000;
var KNIGHT_COST_GOLD	= 500;
var KNIGHT_COST_FOOD	= 500;

var BUILDER_HP 			= 100;
var BUILDER_BUILDTIME	= 200;
var BUILDER_COST_GOLD	= 100;
var BUILDER_COST_FOOD	= 250;

var CATAPULT_HP			= 75;
var CATAPULT_STRENGTH   = 5;
var CATAPULT_RANGE		= 200;
var CATAPULT_BUILDTIME	= 200;
var CATAPULT_COST_GOLD	= 650;
var CATAPULT_COST_FOOD	= 650;


var SOLDIER_HP 			= 100;
var SOLDIER_STRENGTH	= 1;
var SOLDIER_RANGE		= 50;
var SOLDIER_COST_GOLD	= 300;
var SOLDIER_COST_FOOD	= 300;

//Buildings
var BUILDING_BUILD_TIME	= 100

var CITY_HP 			= 2000;

var BARRACKS_HP			= 600;
var BARRACKS_COST_GOLD	= 600;

var FARM_HP 			= 300;
var FARM_BUILDTIME		= 1000;
var FARM_COST_GOLD		= 200;

var MINE_HP				= 400;
var MINE_COST_GOLD		= 200;


// AI Variables
//Normal AI values
var NORMAL_ACTION_INTERVAL	= 700;
var NORMAL_TARGET_KNIGHT	= 3;
var NORMAL_TARGET_SOLDIER	= 4;
var NORMAL_TARGET_CATAPULT	= 2;
var NORMAL_TARGET_BUILDER	= 1;
var NORMAL_TARGET_FARM		= 2;
var NORMAL_TARGET_MINE		= 2;
var NORMAL_UNIT_THRESHOLD	= 5;
var NORMAL_START_FOOD		= 2000;
var NORMAL_START_GOLD		= 2000;

//Hard AI values
var HARD_ACTION_INTERVAL	= 100;
var HARD_TARGET_KNIGHT		= 10; 
var HARD_TARGET_SOLDIER		= 20; 
var HARD_TARGET_CATAPULT	= 5;
var HARD_TARGET_BUILDER		= 3;
var HARD_TARGET_FARM		= 3;
var HARD_TARGET_MINE		= 3;
var HARD_UNIT_THRESHOLD		= 3;
var HARD_START_FOOD			= 5000;
var HARD_START_GOLD			= 5000;

// Just default values, will be immediately changed in utils.js
var AI_ACTION_INTERVAL	= 100;
var AI_TARGET_KNIGHT	= 10;
var AI_TARGET_SOLDIER	= 20;
var AI_TARGET_CATAPULT	= 5;
var AI_TARGET_BUILDER	= 3;
var AI_TARGET_FARM		= 1;
var AI_TARGET_MINE		= 1;
var AI_UNIT_THRESHOLD	= 3;

var AI_BUILDING_SPACING	= 200;

