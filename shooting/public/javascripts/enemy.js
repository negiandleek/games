import Point from "./common";
import {global} from "./global";

export class Enemy{
	constructor(){
		this.position = new Point();
		this.size = 0;
		this.type = 0;
		this.param = 0;
		this.alive = false;
		this.speed = 0;
	}
	set(obj){
		for(let prop in obj){
			let variable = obj[prop];
			try{
				if(!this.hasOwnProperty(prop)){
					throw "class instance don't have proparty";
				}
			}catch(e){
				console.error(e);
			}

			if(variable instanceof Object && !(variable instanceof Array)){
				for(let __prop in variable){
					let __variable = variable[__prop];

					try{
						if(!this[prop].hasOwnProperty(__prop)){
							throw "indent propart of calss instance don't have proparty";
						}
					}catch(e){
						console.error(e);
					}

					this[prop][__prop] = __variable;
				}
			}else{
				this[prop] = variable;
			}
		}
		this.param = 0;
		this.alive = true;
	}
	move(){
		this.param += 1;
		switch(this.type){
			case 0:
				move_enemy1(this);
				break;
			case 1:
				move_enemy2(this);
				break;
		}
	}
}

function move_enemy1 (self) {
	if(self.param < 50){
		move_center(self);
	}else{
		self.position.x -= self.speed;
	}
	if(self.position.x < - self.size){
		self.alive = false;
	}
}

function move_enemy2 (self) {
	if(self.param < 50){
		move_center(self);
	}else{
		self.position.x -= self.speed;
	}
	if(self.position.x < - self.size){
		self.alive = false;
	}
}


function center_vector (self) {
	let center_x = global.$canvas.width / 2;
	let center_y = global.$canvas.height / 2;
	let distance_x = center_x - self.position.x;
	let distance_y = center_y - self.position.y;
	let length = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
	let n = 1 / length;
	let normalize_x = distance_x * n;
	let normalize_y = distance_y * n;

	return {normalize_x,normalize_y}
}

function move_center (self) {
	let {normalize_x, normalize_y} = center_vector(self);
	self.position.x = self.position.x + normalize_x * self.speed;
	self.position.y = self.position.y + normalize_y * self.speed;
}

function left_end_vector(self,type){

}
function move_upper_left (self) {
	
}
function move_lower_left (self) {

}