import Point from "./common";

class Ship{
	constructor(size){
		this.position = new Point();
		this.size = size ? size: 10;
	}
}

module.exports = Ship;