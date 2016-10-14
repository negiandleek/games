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
			case 2:
				move_enemy3(this);
				break;
			case 3:
				move_enemy4(this);
				break;
		}
	}
}

function move_enemy1 (self) {
	if(self.param < 50){
		move_center(self);
	}else{
		move_upper_left(self);
	}
	if(self.position.x < -self.size  || self.position.y < -self.size){
		self.alive = false;
	}
}

function move_enemy2 (self) {
	if(self.param < 50){
		move_center(self);
	}else{
		move_lower_left(self)
	}
	if(self.position.x < -self.size  || self.position.y < -self.size){
		self.alive = false;
	}
}

function move_enemy3(self){
	move_wave(self,1);

	if(self.position.x < -self.size  || self.position.y < -self.size){
		self.alive = false;
	}
}

function move_enemy4(self){
	move_wave(self,-1);

	if(self.position.x < -self.size  || self.position.y < -self.size){
		self.alive = false;
	}
}

function move_center (self) {
	let {normalize_x, normalize_y} = center_vector(self);
	self.position.x = self.position.x + normalize_x * self.speed;
	self.position.y = self.position.y + normalize_y * self.speed;
}

function move_upper_left (self) {
	let {normalize_x, normalize_y} = left_end_vector(self, "up");
	self.position.x = self.position.x + normalize_x * self.speed;
	self.position.y = self.position.y + normalize_y * self.speed;
}
function move_lower_left (self) {
	let {normalize_x, normalize_y} = left_end_vector(self, "down");
	self.position.x = self.position.x + normalize_x * self.speed;
	self.position.y = self.position.y + normalize_y * self.speed;
}

function move_wave(self, type){
	let center_y = global.$canvas.height / 2;
	let range = 125;
	self.position.y = center_y + Math.sin(self.param / 30) * range * type;
	self.position.x = self.position.x - self.speed;
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

function left_end_vector(self,type){
	let distance_x;
	let distance_y;
	let length;
	let n;
	let normalize_x;
	let normalize_y;
	let diameter = self.size * 2;
	if(type === "up"){
		let left_upper_left_x = global.$canvas.offsetLeft - diameter;
		let left_upper_left_y = global.$canvas.offsetTop - diameter;
		distance_x = left_upper_left_x - self.position.x;
		distance_y = left_upper_left_y - self.position.y;
		length = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
		n = 1 / length;
		normalize_x = distance_x * n;
		normalize_y = distance_y * n;
	}else if(type === "down"){
		let left_lower_left_x = global.$canvas.offsetLeft - diameter;
		let left_lower_left_y = global.$canvas.offsetHeight + global.$canvas.offsetTop + diameter;
		distance_x = left_lower_left_x - self.position.x;
		distance_y = left_lower_left_y - self.position.y;
		length = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
		n = 1 / length;
		normalize_x = distance_x * n;
		normalize_y = distance_y * n;
	}

	return {normalize_x, normalize_y}
}