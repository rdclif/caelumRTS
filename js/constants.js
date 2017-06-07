//Constants stored here - Not actually constants to avoid potential older browser issues with const
//All values related to the game simulation and balance

//Resources
var TIMETHRESHOLD_RESOURCES = 200;
var FOODPERTICK				= 1;
var GOLDPERTICK				= 1;
var PLAYER_START_FOOD		= 100000;
var PLAYER_START_GOLD		= 100000;
var COMPUTER_START_FOOD		= 100000;
var COMPUTER_START_GOLD		= 100000;

//Units
var KNIGHT_HP 			= 100;
var KNIGHT_STRENGTH     = 2;
var KNIGHT_BUILDTIME 	= 1000;
var KNIGHT_COST_GOLD	= 500;
var KNIGHT_COST_FOOD	= 200;

var BUILDER_HP 			= 100;
var BUILDER_BUILDTIME	= 200;
var BUILDER_COST_GOLD	= 100;
var BUILDER_COST_FOOD	= 50;

var CATAPULT_HP			= 100;
var CATAPULT_STRENGTH   = 3;
var CATAPULT_BUILDTIME	= 200;
var CATAPULT_COST_GOLD	= 1000;
var CATAPULT_COST_FOOD	= 500;


var SOLDIER_HP 			= 100;
var SOLDIER_STRENGTH	= 1;
var SOLDIER_COST_GOLD	= 200;
var SOLDIER_COST_FOOD	= 100;

//Buildings
var BUILDING_BUILD_TIME	= 100

var CITY_HP 			= 1000;

var BARRACKS_HP			= 600;
var BARRACKS_COST_GOLD	= 1000;

var FARM_HP 			= 300;
var FARM_BUILDTIME		= 1000;
var FARM_COST_GOLD		= 200;

var MINE_HP				= 400;
var MINE_COST_GOLD		= 200;


// AI Variables
var AI_ACTION_INTERVAL	= 100;
var AI_TARGET_KNIGHT	= 10;
var AI_TARGET_SOLDIER	= 20;
var AI_TARGET_CATAPULT	= 5;
var AI_TARGET_BUILDER	= 3;
var AI_TARGET_FOOD		= 3;
