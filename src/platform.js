var Platform = function(asset) {
	
	this.x = 0;
	this.y = 0;

	this.by = 0;
	
	this.scale = 1;

	this.ox = 0;
	
	this.drop = 0;

    this.img = images[asset];
    
    this.v = true;

    // size
	this.w = this.img.width;
    this.h = this.img.height;
		
	this.type = "basic";
		
	// inactive
	this.isOff = false;
	
	// not being used
	this.isUsed = true;
}

Platform.prototype = {
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y;
	},
	
	setScale : function(s) {
		
		this.scale = s;
		
		this.w = this.img.width * this.scale;
		this.h = this.img.height * this.scale;

		this.ox = (this.w * 0.72) * -0.5;
	},

	destroy : function() {

		// anything to clean-up before we make this null?
		this.img = null;		
	},
	
	draw : function() {
		
		if (this.v && this.isUsed) {
		
			ctx.drawImage(this.img, (this.x + this.ox) * scale, (this.y + this.drop) * scale, this.img.width * this.scale * scale * 0.72, this.img.height * this.scale * scale * 0.72);
		}
	}
}