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