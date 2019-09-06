var Particle = function(asset) {
	
	this.img = asset;
	
	this.x = 0;
	this.y = 0;
	
	this.scale = 1;
	this.ox = this.img.width * -0.5;
	this.oy = this.img.height * -0.5;
	
	this.v = false;
	
	this.life = 1;
	this.maxLife = 1;
	this.fade = 0;
	
	this.dx = 0;
	this.dy = 0;
	
	this.scaling = 1;
}

Particle.prototype = {
	
	init : function() {
		
		
	},
	
	setScale : function(s) {
		
		this.scale = s;
		
		this.ox = (this.img.width * this.scale) * -0.5;
		this.oy = (this.img.height * this.scale) * -0.5;
	},
	
	draw : function() {
		
		if (this.v) {
		
			ctx.drawImage(this.img, (this.x + this.ox) * scale, (this.y + this.oy) * scale, this.img.width * this.scale * scale, this.img.height * this.scale * scale);
		}
	}
}