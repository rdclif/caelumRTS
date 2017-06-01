game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        //TItle screen
	var backgroundImage = new me.Sprite(0, 0, {
	    image: me.loader.getImage('title_screen'),
	});
	
	backgroundImage.anchorPoint.set(0, 0);
	backgroundImage.scale(backgroundImage.width/me.game.viewport.width,2);

	// add to the world container
	me.game.world.addChild(backgroundImage, 1);

	// add buttons
	me.game.world.addChild(new game.UI.startButton(me.game.viewport.width/2-100, me.game.viewport.height/2));
	me.game.world.addChild(new game.UI.startButtonHard(me.game.viewport.width/2-100, me.game.viewport.height/2+55));
	me.game.world.addChild(new game.UI.loadButton(me.game.viewport.width/2-100, me.game.viewport.height/2+110));


	// add a new renderable component with the scrolling text
	me.game.world.addChild(new (me.Renderable.extend ({

		// constructor
		init : function () {
			this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

			this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));

			// a tween to animate the arrow
			this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();

			this.scroller = "Placeholder Text";
			this.scrollerpos = 600;
		},

			// some callback for the tween objects
			scrollover : function () {
			// reset to default value
			this.scrollerpos = 640;
			this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
		},

		update : function (dt) {
			return true;
		},

		draw : function (renderer) {
			this.font.draw(renderer, "Caelum - RTS", me.game.viewport.width/2-130, 80);
			//this.font.draw(renderer, "Click anywhere to start playing.", 20, 380);
//			this.font.draw(renderer, this.scroller, this.scrollerpos, 440);
		},
	

	
		onDestroyEvent : function () {
			//just in case
			this.scrollertween.stop();
		}
        })), 2);


    },


    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {

		// TODO
    }
});
