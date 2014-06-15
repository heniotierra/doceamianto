Crafty.c("Shine", {
  
	init: function(){
		this.alpha = 0;
	},

	reveal: function(){
		this.alpha = 0.5;
	},
	 
	fullShine: function(){
		this.addComponent("Delay, Tween, TweenSpriteColor");
		this.alpha = 1;
		this.sprgba(182,239,251,0.5);
		this.fadeOff();
	},
	 
	fadeOff: function(){
		var colors = [],
		    h = 0,
		    fps = Crafty.timer.FPS();
		colors[0] = { r: 151, g: 151, b: 151, a: .7 },	// gray
		colors[1] = { r: 141, g: 66, b: 135, a: .7 },	// dark magenta
		colors[2] = { r: 94, g: 1, b: 86, a: .7 },	// darker magenta
		colors[3] = { r: 22, g: 55, b: 122, a: .7 },	// dark blue
		colors[4] = { r: 22, g: 55, b: 122, a: 1 };	// transparent
		
		this.delay(function(){
			this.tweenSpriteColor(colors[h], fps/2);
			++h;
		    }, 1000, 3, function(){
			this.one("TweenSpriteColorEnd", function(){
				this.removeComponent("Delay")
				    .tweenSpriteColor(colors[4], fps)
				    .one("TweenSpriteColorEnd", function(){
					this.removeComponent("Tween")
					    .alpha = 0;
				    });
				    
			});
		    });
		    
	}
	
})