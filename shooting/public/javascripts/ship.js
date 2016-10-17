import Point from "./common";

class Ship{
	constructor(){
		this.position = new Point();
		this.size = 0;
		this.life = 0;
		this.max_life = 3
		this.firing_speed = 0;
		this.max_firing_speed = 0;
		this.power = 0;
		this.max_power = 3;
		this.invincible = false;
		this.tmp = 0;
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
	}
	change_state(type){
		switch (type){
			// hp down
			case "DAMAGE":
				this.invincible_state(type, 1000);
				break;
			// hp up
			case "HP":
				let _life = this.life + 1;
				this.life = _life <= this.max_life ? _life: this.life;
				this.invincible_state(type, 750);
				break;
			// attack evolution 
			case "FIRING":
				let _firing_speed = this.firing_speed - 100;
				this.firing_speed = _firing_speed >= 100 ? _firing_speed: this.firing_speed;
				this.invincible_state(type, 750);
				break;
			case "POWER":
				let _power = this.power + 1;
				this.power = _power <= this.max_power ? _power: this.power;
				this.invincible_state(type, 750);
				break
		}
	}
	invincible_state(item_type,time){
		this.invincible = item_type;
		setTimeout(()=>{
			this.invincible = false
		},time)
	}
}

module.exports = Ship;