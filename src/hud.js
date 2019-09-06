var HUD = function() {
	
	this.score = 0;
	
	// pause menu
	this.isPaused = false;
	this.btn = new Button(Constants.WIDTH - 74, 10, images["a/pause_out.png"]);
	
	this.bar = images["a/bar.png"];
	this.barBase = images["a/bar_base.png"];
	this.barScale = 0;

	this.showHelp = true;
	
	if (!firstPlay1) {
		
		this.showHelp = false;
	}

	target = this;
}

HUD.prototype = {
	
	setScore : function(val) {
		
		this.score = val;
	},
	
	click : function(mx, my) {
		
		if (this.btn.click(mx, my)) {
			
			game.isRunning = false;
			quitGame();
		}
	},
	
	draw : function() {
		
		if (this.showHelp) {
		
			if (isTouch) {
		
				//printText(240, 400, "TAP AND HOLD TO JUMP", true, 0.6);
			}
			else {
				
				//printText(240, 400, "PRESS AND HOLD ANY KEY TO JUMP", true, 0.6);
			}
		}
		
		this.btn.draw();
		
		printText(240, 64, "" + this.score, true, 1.5);


		ctx.drawImage(this.bar, 26 * scale, (577 * scale) + (this.bar.height * (1 - this.barScale) * scale), (this.bar.width + 1) * scale, this.bar.height * this.barScale * scale);
		ctx.drawImage(this.barBase, 20 * scale, 570 * scale, this.barBase.width * scale, this.barBase.height * scale);
	},
	
	update : function(mx, my) {
		
		this.btn.update(mx, my);
	}
}