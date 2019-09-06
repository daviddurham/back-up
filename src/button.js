var Button = function(x, y, img) {

	this.x = x || 0;
	this.y = y || 0;
	
	this.img = img;
	
	this.w = this.h = 0;
	
	this.v = true;
	this.isOver = false;
	
	this.text = '';
	this.icon = null;

	target = this;
}

Button.prototype = {
	
	click : function(mx, my) {
		
		if (mx > this.getX() && mx < this.getX() + this.getWidth() && my > this.getY() && my < this.getY() + this.getHeight()) {
			
			return true;
		}
		
		return false;
	},
	
	getX : function() {
		
		return this.x * scale;
	},
	
	getY : function() {
		
		return this.y * scale;
	},
	
	getWidth : function() {
		
		return this.w * scale;
	},
	
	getHeight : function() {
		
		return this.h * scale;
	},

	setText : function(text) {

		this.text = text;
	},
	
	update : function(mx, my) {
		
		if (!this.isOver) {
			
			this.w = this.img.width;
			this.h = this.img.height;
			
			// rolling over?
			if (mx > this.getX() && mx < this.getX() + this.getWidth() && my > this.getY() && my < this.getY() + this.getHeight()) {
				
				this.isOver = true;
			}
		}
		else {
			
			this.w = this.img.width;
			this.h = this.img.height;
			
			// rolled out?
			if (mx < this.getX() || mx > this.getX() + this.getWidth() || my < this.getY() || my > this.getY() + this.getHeight()) {
			
				this.isOver = false;
			}
		}
	},
	
	draw : function() {
		
		if (this.v) {
			
			var oy = 0;

			if (this.isOver) {
				
				oy = 4;
			}

			ctx.drawImage(this.img, this.x * scale, (this.y + oy) * scale, this.img.width * scale, this.img.height * scale);
			printText(this.x + (this.img.width * 0.5), (this.y + oy) + (this.img.height * 0.5) - 8, this.text, true);
		}
	}
}