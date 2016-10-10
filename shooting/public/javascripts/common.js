class Point {
	constructor(){
		this.x = 0;
		this.y = 0;
	}
	// TODO: learn
	distance(p){
		let q = new Point();
		q.x = p.x - this.x;
		q.y = p.y - this.y;
		return q;
	}
	length(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalize() {
	let i = this.length();
		if(i > 0){
			let j = 1 / i;
			this.x *= j;
			this.y *= j;
		}
	}
}

module.exports = Point;