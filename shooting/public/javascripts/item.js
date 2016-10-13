import Point from "./common";

export class Item{
	constructor(){
		this.position = new Point();
		this.type = 1;
		this.size = 0;
		this.speed = 0;
		this.alive = false;
	}
	set(obj){
		for(let prop in obj){
			let variable = obj[prop];

			try{
				if(!this.hasOwnProperty(prop)){
					throw "ship class instance don't have proparty";
				}
			}catch(e){
				console.error(e);
				continue;
			}

			if(variable instanceof Object && !(variable instanceof Array)){
				for(let __prop in variable){
					let __variable = variable[__prop];
					try{
						if(!this[prop].hasOwnProperty(__prop)){
							throw "ship class instance indent don't have proparty"
						}
					}catch(e){
						console.error(e);
						continue;
					}
					this[prop][__prop] = __variable;
				}
			}else{
				this[prop] = variable;
			}
		}
		this.alive = true;
	}
	move(){
		this.position.x = this.position.x - this.speed;
		if(this.position.x < -this.size){
			this.alive = false;
		}
	}
}