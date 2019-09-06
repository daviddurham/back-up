var Vector2D = function(x, y) {
	
	this.x = x || 0;
	this.y = y || 0;
};

Vector2D.prototype = {
	
	magnitude : function() {
		
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	},
	
	normalise : function() {
		
		var m = this.magnitude();
		
		this.x = this.x / m;
		this.y = this.y / m;

		return this;	
	},

	dot : function(v) {
		
		return (this.x * v.x) + (this.y * v.y) ;
	},
	
	a : function(useRadians) {
		
		return Math.atan2(this.y,this.x) * (useRadians ? 1 : Vector2DConst.TO_DEG);
		
	},
	
	vector : function(ang) {
		
		this.x = Math.sin(ang * Vector2DConst.TO_RAD);
		this.y = -Math.cos(ang * Vector2DConst.TO_RAD);
	}
};

Vector2DConst = {
	
	TO_DEG : 180 / Math.PI,
	TO_RAD : Math.PI / 180
};