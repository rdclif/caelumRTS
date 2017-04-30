game.DefeatScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        //TItle screen
	var backgroundImage = new me.Sprite(0, 0, {
	    image: me.loader.getImage('defeat_screen'),
	});
	
	backgroundImage.anchorPoint.set(0, 0);
	backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);

	// add to the world container
	me.game.world.addChild(backgroundImage, 1);

	// create a basic GUI Object
	var myButton = me.GUI_Object.extend(
	{
		init:function (x, y)
		{
			var settings = {}
			settings.image = "button_0";
	//		settings.framewidth = 100;
	//		settings.frameheight = 50;
			// super constructor
			this._super(me.GUI_Object, "init", [x, y, settings]);
			// define the object z order
			this.pos.z = 4;
		},

		// output something in the console
		// when the object is clicked
		onClick:function (event)
		{
			me.state.change(me.state.MENU);
			// don't propagate the event
			return false;
		}
	});

	// add the object at pos (10,10)
	me.game.world.addChild(new myButton(me.game.viewport.width / 2,350));



	// add a new renderable component with the scrolling text
	me.game.world.addChild(new (me.Renderable.extend ({

		// constructor
		init : function () {
			this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

			this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

		},


		update : function (dt) {
			return true;
		},

		draw : function (renderer) {
			this.font.draw(renderer, "Defeat", me.game.viewport.width / 2 - 40, 40);
			this.font.draw(renderer, "Click anywhere to return to Main Menu.", 20, 380);
		},
	

	
		onDestroyEvent : function () {
			return true;
		}
        })), 2);

	me.input.bindKey(me.input.KEY.ENTER, "enter", true);
	me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);
	this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
		if (action === "enter") {
			me.state.change(me.state.MENU);
		}
	});

    },


    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindPointer(me.input.pointer.LEFT);
        me.event.unsubscribe(this.handler);
		// TODO
    }
});
