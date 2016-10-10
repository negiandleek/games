import Point from "./common";
import {global} from "./main";

class Enemy{
	constructor(){
		this.position = new Point();
		this.size = 0;
		this.type = 0;
		this.param = 0;
		this.alive = false;
	}
	set(li){
		for(let i = 0; i < 3; i += 1){
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
					this.type = li[i];
					break;
			}
		}
		this.param = 0;
		this.alive = true;
	}
	move(){
		this.param += 1;

		switch(this.type){
			case 0:
				this.position.y += 2;

				if(this.position.y > this.size + global.$canvas.height){
					this.alive = false;
				}
				break;
			case 1:
				this.position.y -=2;

				if(this.position.y < -this.size){
					this.alive = false;
				}
				break;
		}
	}
}

module.exports = Enemy;