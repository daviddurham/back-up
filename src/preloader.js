var Preloader = function(root, w, h) {
	
	this.root = root;
	
	this.w = w; 
	this.h = h;
	
	this.progress = 0;
	
	this.total = 0;
	this.loaded = 0;
	
	this.isReady = false;
	this.isComplete = false;
	
	target = this;
	
	this.bar = new Image();
	this.bar.onload = function() {
		
		target.isReady = true;
	}
	
	this.bar.src = "a/grey_pixel.png";
};

Preloader.prototype = {
	
	draw : function() {
		
		this.drawImage(this.bar, (Constants.w / 2) - (this.w / 2), (Constants.h / 2) - (this.h / 2), this.w * this.progress, this.h);
	},
	
	drawImage : function(img, x, y, w, h) {
		
		ctx.drawImage(img, x * this.root.scale, y * this.root.scale, w * this.root.scale, h * this.root.scale);
	},
	
	update : function(loaded, total) {
		
		this.loaded = loaded;
		this.total = total;
		
		this.progress = this.loaded / this.total;
		
		if (this.total > 0 && this.progress == 1) {
			
			this.isComplete = true;
		}
	}
}