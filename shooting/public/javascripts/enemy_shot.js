import Point from "./common";
import {global} from "./global.js";
class Enemy_shot{
	constructor(){
		this.position = new Point();
		this.vector = new Point();
		this.size = 0;
		this.speed = 0;
		this.alive = false;
	}
	set(li){
		for(let i = 0; i < 4; i += 1){
			if(typeof li[i] === "undefined") break;
			switch (i){
				case 0:
					this.position.x = li[i]["x"];
					this.position.y = li[i]["y"];
					break;

				case 1:
					this.vector.x = li[i]["x"];
					this.vector.y = li[i]["y"];
					break;
				
				case 2:
					this.size = li[i];
					break;

				case 3:
					this.speed = li[i];
					break;
			}
		}
		this.alive = true;
	}
	move(){
		this.position.x += this.vector.x * this.speed;
		this.position.y += this.vector.y * this.speed;
		if(
			this.position.x < -this.size ||
			this.position.y < -this.size ||
			this.position.x > this.size + global.$canvas.width ||
			this.position.y > this.size + global.$canvas.height
		){
			this.alive = false;
		}
	}
}
module.exports = Enemy_shot;