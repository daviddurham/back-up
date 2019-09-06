var Menu = function() {
	
	this.title1 = images["a/title.png"];
	this.title2 = images["a/up.png"];
	
	this.isReady = false;	
	target = this;
}

Menu.prototype = {
	
	init : function() {
	
	},

	click : function(mx, my) {
		
		if (audioCtx) {

			// Create empty buffer
			var buffer = audioCtx.createBuffer(1, 1, 22050);
			var source = audioCtx.createBufferSource();
			
			source.buffer = buffer;
			source.connect(audioCtx.destination);

			// Play sound
			if (source.start) {

				source.start(0);
			}
		}

		startGame();
	},
	
	draw : function() {
		
		this.drawImage(images["a/sky.png"], 0, 0, 480);

		this.drawImage(this.title1, 140, 220);
		this.drawImage(this.title2, 128, 150);

		printText(260, 169, "BACK", true, 1.5);
		printText(240, 520, "TAP TO PLAY", true);
	},
	
	drawImage : function(img, x, y, w, h) {
		
		var width = w || img.width;
		var height = h || img.height;
		
		ctx.drawImage(img, x * scale, y * scale, ~~(width * scale * 1.5) + 0.5, ~~(height * scale * 1.5) + 0.5);
	},
	
	update : function(mx, my) {
		
	},
	
	cleanUp : function() {
		
	}
}