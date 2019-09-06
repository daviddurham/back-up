var Transition = function() {
	
	this.v = false;
	
	// start at the bottom
	this.position = Constants.HEIGHT;
	
	this.speed = 60;
	this.isTop = true;
	
	target = this;
}

Transition.prototype = {
	
	start : function() {
		
		this.position = Constants.HEIGHT;
		this.v = true;
		this.isTop = true;
	},
	
	onComplete : function() {
		
		this.v = false;
	},
	
	onHidden : function() {
		
		transFunc();
	},
	
	draw : function() {
		
		if (this.v) {
		
			// clear between
			var px = 0;
			var py = 0;
			if (this.position > 0) py = (this.position) * scale;
			
			ctx.clearRect(px, py, canvas.width, (this.position + Constants.HEIGHT) * scale);
		}
	},
	
	update : function() {
		
		if (this.v) {
			
			this.position -= this.speed;
			
			if (this.position <= 0 && this.isTop) {
				
				this.onHidden();
				this.isTop = false;
			}
			else if (this.position <= (Constants.HEIGHT) * -1) {
				
				this.onComplete();
			}
		}
	}
}