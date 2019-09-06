var Wall = function(shade) {
	
	this.x = this.y = 0;

	// base vertical position
	this.by = 0;
	
	// offset
	this.ox = this.oy = 0;
	
	// scale
    this.sx = this.sy = 1;

	this.init(shade);
	
	this.isFront = true;
    this.v = true;
}

Wall.prototype = {
	
	init : function(shade) {
		
		var asset = "w3";
		
		if (shade) {

			asset = "ws";
		}
		else {
	
			var r = Math.random();
			
			if (r < 0.3) {
				
				asset = "w2"
			}
		}

		this.ft = images["a/" + asset + ".png"];
    	//this.bk = images['assets/wall_back.png'];
	},
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y + this.oy;
	},
	
	setScale : function(s) {
		
		this.sx = s;
		
		this.ox = ((this.ft.width * 0.48) * this.sx) * -0.5;
	},
	
	draw : function() {
		
		if (this.v) {
		
			if (!this.isFront) {

				
				//ctx.drawImage(this.bk, (this.x + this.ox) * scale, (this.y + this.oy) * scale, this.bk.width * this.sx * scale, this.bk.height * this.sy * scale);
				
			}
			else {

				//ctx.globalAlpha = 0.5;
				ctx.drawImage(this.ft, (this.x + this.ox) * scale, (this.y + this.oy) * scale, this.ft.width * this.sx * scale * 0.48, this.ft.height * this.sy * scale * 0.48);
				ctx.globalAlpha = 1;
			}
		}
	}
}