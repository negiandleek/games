import Point from "./common";
import {global} from "./global";
export class Boss {
	constructor () {
		this.position = new Point();
		this.size = 0;
		this.life = 0;
		this.param = 0;
		this.alive = false;
		this.speed = 0;
	}
	set (obj) {
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
		this.alive = true;
	}
	move () {
		let i, j;
		this.param += 1;
		switch(true){
			case this.param < 100:
				this.position.x = this.position.x -= 1.5;
				break;
			default:
				i = ((this.param - 100) % 360) * Math.PI / 180;
				j = global.$canvas.width / 2;
				this.position.y = j + Math.sin(i) * j;
				break;
		}
	}
}

export class Henchman extends Boss{
	constructor () {
		super();
		this.parent = null;
	}
	set (parent, obj) {
		this.parent = parent;
		super.set(obj);
	}
	move () {
		this.param += 1;
		let i = (this.param % 360) * Math.PI / 180;
		let x = Math.cos(i) * (this.parent.size + this.size);
		let y = Math.sin(i) * (this.parent.size + this.size);
		this.position.x = this.parent.position.x + x;
		this.position.y= this.parent.position.y + y;
	}
}