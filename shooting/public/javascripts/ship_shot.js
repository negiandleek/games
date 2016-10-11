import Point from "./common";
import {global} from "./global";

class Ship_shot{
	constructor(size){
		this.position = new Point();
		this.size = size ? size : 3;
		this.speed = 10;
		this.alive = false;
	}
	set(li){
		for(let i = 0; i < 3; i+=1){
			if(typeof li[i] === "undefined") break;

			switch (i){
				case 0:
					this.position.x = li[i]["x"];
					this.position.y = li[i]["y"];
					break;

				case 1:
					this.size = li[i];
					break;

				case 2:
					this.speed = li[i];
					break;
			}
		}
		this.alive = true;
	}
	move(){
		this.position.x = this.position.x + this.speed;
		if(this.position.x > this.size + global.$canvas.width){
			this.alive = false;
		}
	}
}

module.exports = Ship_shot;