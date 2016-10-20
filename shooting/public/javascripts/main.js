"use strict"

import {init} from "./init";
import {global} from "./global";
import {CONSTANT} from "./constant";
import {Item} from "./item";

document.addEventListener("DOMContentLoaded", function (){
	// canvas init
	global.$canvas = document.getElementById("canvas");
	global.$canvas.width = 500;
	global.$canvas.height = 500;

	global.context = global.$canvas.getContext("2d");

	// event
	global.$canvas.addEventListener("mousemove", mouse_move, true);
	global.$canvas.addEventListener("mousedown", mouse_down, true);
	global.$canvas.addEventListener("mouseup", mouse_up, true);
	document.addEventListener("keydown", key_down, true);

	/*init*/
	//position
	init();

	game_state();
})

function main () {
	global.counter += 1;
	// clear
	global.context.clearRect(0,0, global.$canvas.width, global.$canvas.height);

	global.context.drawImage(
		global.asset.images.space_art,
		0,
		0,
		100,
		100,
		0,
		0,
		500,
		500
	);

	/*ship draw*/
	// start path
	global.context.beginPath();

	// ship position
	global.ship.set({
		position: {
			x: global.mouse.x,
			y: global.mouse.y
		}
	});

	// draw
	if(global.ship.invincible){
		let diff = global.counter - global.ship.tmp;
		let type = global.ship.invincible;
		let color = [];


		if(type === "DAMAGE"){
			color[0] = CONSTANT.CHARA_SHOT_COLOR_MODIFY1;
			color[1] = CONSTANT.CHARA_SHOT_COLOR_MODIFY2;
		}else if(type === "HP"){
			color[0] = CONSTANT.ITEM_COLOR1;
			color[1] = CONSTANT.CHARA_SHOT_COLOR_MODIFY1;
		}else if(type === "FIRING"){
			color[0] = CONSTANT.ITEM_COLOR2;
			color[1] = CONSTANT.CHARA_SHOT_COLOR_MODIFY1;
		}else if(type === "POWER"){
			color[0] = CONSTANT.ITEM_COLOR3;
			color[1] = CONSTANT.CHARA_SHOT_COLOR_MODIFY1;
		}

		if(diff <= 6){
			global.context.fillStyle = color[0];
		}else if(diff >= 7 && diff < 10){
			global.context.fillStyle = color[1];
		}else{
			global.ship.tmp = global.counter;
			global.context.fillStyle = color[0];
		}
	}else{
		global.context.fillStyle = CONSTANT.CHARA_COLOR;
	}

	global.context.drawImage(
		global.asset.images.space_art,
		45,
		270,
		70,
		100,
		global.ship.position.x - 25, 
		global.ship.position.y - 25,
		50,
		50
	);

	/*ship shot draw*/
	// set
	if(global.fire){
		for(let j = 1; j <= global.ship.power; j += 1){
			for(let i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1){
				if(!global.ship_shot[i].alive){
					let p;
					switch(j){
						case 1:
							global.ship_shot[i].set([global.ship.position]);
							break;
						case 2:
							p = {
								x: global.ship.position.x,
								y: global.ship.position.y - 10
							}
							global.ship_shot[i].set([p]);
							break;
						case 3:
							p = {
								x: global.ship.position.x,
								y: global.ship.position.y + 10
							}
							global.ship_shot[i].set([p]);
							break;
					}
					break;
				}
			}
		}
		global.fire = false;
	}

	// start path
	global.context.beginPath();

	for(let i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1){
		if(global.ship_shot[i].alive){
			global.ship_shot[i].move();
			global.context.arc(
				global.ship_shot[i].position.x,
				global.ship_shot[i].position.y,
				global.ship_shot[i].size,
				0,
				Math.PI * 2,
				false
			);
			global.context.closePath();
		}
	}
	global.context.fillStyle = CONSTANT.CHARA_SHOT_COLOR;
	global.context.fill();

	/*enemy draw*/
	// seen branch
	switch(true){
		case global.counter < 50:
			display_text(global.text.info, "READY");
			break;

		case global.counter < 80:
			display_text(global.text.info, "GO");
			break;

		default:
			if(global.game_start){
				global.init_time = new Date().getTime() + 1000;
				global.game_start = false;
			}
			// limit time
			let now = new Date().getTime();
			if(global.remaining_time){
				global.remaining_time = now - global.init_time;
				let csv_length = global.csv_data.length - 1;
				display_remaining_time();

				if(global.remaining_time >= global.csv_data[csv_length][0]){
					game_state(false);
				}
			}else{
				global.remaining_time = now - global.init_time;
			}

			// set
			if(global.counter >= global.csv_data[global.icsv][0] &&
				global.csv_data[global.icsv][1] !== 999 &&
				global.csv_data[global.icsv][1] <= 99 ){
				
				for(let i = 0; i < CONSTANT["ENEMY_MAX_COUNT"]; i += 1){
					if(!global.enemy[i]["alive"]){
						// type
						let j = global.csv_data[global.icsv][1];
						let enemy_size = 15;
						let p = {};
						p.x = global.$canvas.width;
						p.y = -enemy_size + (global.$canvas.height + enemy_size * 2) * j;

						global.enemy[i].set({
							position: p,
							size: enemy_size,
							type: j,
							speed: 3
						});
						global.icsv = global.icsv + 1;
						break;
					}
				}
			}else if(global.counter >= global.csv_data[global.icsv][0] &&
				global.csv_data[global.icsv][1] !== 999 &&
				global.csv_data[global.icsv][1] >= 100){
				
				let p = {
					x: 580,
					y: global.$canvas.height / 2
				};
				global.boss.set({
					position: p,
					size: 50,
					life: 30,
					speed: 5
				});

				for(let i = 0; i < CONSTANT.BOSS_HENCHMAN_COUNT; i+=1){
					let j = 360 / CONSTANT.BOSS_HENCHMAN_COUNT;
					global.henchman[i].set(global.boss, {
						size: 15,
						life: 5,
						param: i * j
					});
				}
				global.icsv = global.icsv + 1;
			}
			// draw enemy
			global.context.beginPath();

			for(let i = 0; i < CONSTANT["ENEMY_MAX_COUNT"]; i += 1){
				if(global.enemy[i].alive){
					global.enemy[i].move();
					global.context.arc(
						global.enemy[i].position.x,
						global.enemy[i].position.y,
						global.enemy[i].size,
						0,
						Math.PI * 2,
						false
					)
					// set shot info
					if(global.enemy[i].param % 50 === 0){
						for(let j = 0; j < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; j += 1){
							if(!global.enemy_shot[j].alive){
								let p = global.enemy[i].position.distance(global.ship.position);
								p.normalize();
								global.enemy_shot[j].set([global.enemy[i].position, p, 5, 5]);

								break;
							}
						}
					}
				}
				global.context.closePath();
			}
			global.context.fillStyle = CONSTANT.ENEMY_COLOR;
			global.context.fill();

			// draw boss
			global.context.beginPath();
			if(global.boss.alive){
				global.boss.move();
				global.context.arc(
					global.boss.position.x,
					global.boss.position.y,
					global.boss.size,
					0, 
					Math.PI * 2,
					false
				);
				global.context.closePath();
			}
			global.context.fillStyle = CONSTANT.BOSS_COLOR;
			global.context.fill();
			
			// draw henchman
			global.context.beginPath();
			
			for(let i = 0; i < 	CONSTANT.BOSS_HENCHMAN_COUNT; i+=1){
				if(global.henchman[i].alive && global.boss.alive){
					global.henchman[i].move();
					
					global.context.arc(
						global.henchman[i].position.x,
						global.henchman[i].position.y,
						global.henchman[i].size,
						0, Math.PI * 2, false
					);
					
					if(global.henchman[i].param % 25 === 0){
						for(let j = 0; j < CONSTANT.ENEMY_SHOT_MAX_COUNT; j+=1){
							if(!global.enemy_shot[j].alive){
								let p = global.henchman[i].position.distance(global.ship.position);
								p.normalize();
								global.enemy_shot[j].set([global.henchman[i].position, p, 5, 5]);
								
								break;
							}
						}
					}
					
					global.context.closePath();
				}
			}

			global.context.fillStyle = 	CONSTANT.BOSS_HENCHMAN_COLOR;
			global.context.fill();

			/*shot*/
			global.context.beginPath();

			for(let i = 0; i < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; i += 1){
				if(global.enemy_shot[i].alive){
					global.enemy_shot[i].move();
					global.context.arc(
						global.enemy_shot[i].position.x,
						global.enemy_shot[i].position.y,
						global.enemy_shot[i].size,
						0,
						Math.PI * 2,
						false
					);
				}
				global.context.closePath();
			}
			global.context.fillStyle = CONSTANT.ENEMY_SHOT_COLOR;
			global.context.fill();

			/*collision detection*/
			// ship shot and enemy
			for(let i = 0; i < CONSTANT.CHARA_SHOT_MAX_COUNT; i += 1){
				if(global.ship_shot[i].alive){
					for(let j = 0; j < CONSTANT.ENEMY_MAX_COUNT; j += 1){
						// enemyとship shotの距離を計算
						let p = global.ship_shot[i].position.distance(global.enemy[j].position);
						if(p.length() < global.enemy[j].size && global.enemy[j].alive){
							global.enemy[j].alive = false;
							global.ship_shot[i].alive = false;
							let r = Math.floor(Math.random() * 100);
							if(r === 1){
								let __item = new Item();
								__item.set({
									type: "HP",
									size: 5,
									speed: 3,
									position: global.enemy[j].position
								});
								global.item.push(__item);
							}else if(r === 2){
								let __item = new Item();
								__item.set({
									type: "FIRING",
									size: 5,
									speed: 3,
									position: global.enemy[j].position
								});
								global.item.push(__item);
							}else if(r === 3){
								let __item = new Item();
								__item.set({
									type: "POWER",
									size: 5,
									speed: 3,
									position: global.enemy[j].position
								});
								global.item.push(__item)
							}
							break;
						}
					}
					for(let j = 0; j < CONSTANT.BOSS_HENCHMAN_COUNT; j += 1){
						if(global.henchman[j].alive){
							let p = global.henchman[j].position.distance(global.ship_shot[i].position);
							if(p.length() < global.henchman[j].size){
								global.henchman[j].life -= 1;
								global.ship_shot[i].alive = false;

								if(global.henchman[j].life < 0){
									global.henchman[j].alive = false;
								}

								break;
							}
						}
					}
					if(global.boss.alive){
						let p = global.boss.position.distance(global.ship_shot[i].position);
						if(p.length() < global.boss.size){
							global.boss.life = global.boss.life - 1;
							
							global.ship_shot[i].alive = false;
							
							if(global.boss.life <= 0){
								global.boss.alive = false;
								global.clear = true;
								game_state(false),500;
							}
						}
					}
				}
			}

			/*item*/
			if(global.item.length !== 0){
				let tmp = [];
				for(let i = 0; i < global.item.length; i+=1){
					global.context.beginPath();
					global.item[i].move();
					global.context.arc(
						global.item[i].position.x,
						global.item[i].position.y,
						global.item[i].size,
						0,
						Math.PI * 2,
						false
					);

					if(global.item[i].alive === true){
						tmp.push(global.item[i]);
					}
					switch (global.item[i].type){
						case "HP":
							global.context.fillStyle = CONSTANT.ITEM_COLOR1;
							break;
						case "FIRING":
							global.context.fillStyle = CONSTANT.ITEM_COLOR2;
							break;
						case "POWER":
							global.context.fillStyle = CONSTANT.ITEM_COLOR3;
					}
					global.context.fill();
				}
				global.item = tmp;
			}
			// ship and item;
			if(global.item.length !== 0 && !global.ship.invincible){
				for(let i = 0; i < global.item.length; i+=1){
					if(global.item[i].alive === true){
						let p = global.item[i].position.distance(global.ship.position);
						if(p.length() <= global.ship.size){
							global.item[i].alive = false;
							global.ship.change_state(global.item[i].type);
						}
					}
				}
			}

			// enemy shot and ship
			for(let i = 0; i < CONSTANT.ENEMY_SHOT_MAX_COUNT; i += 1){
				if(global.enemy_shot[i].alive){
					let p = global.ship.position.distance(global.enemy_shot[i].position);
					if(p.length() < global.ship.size && !global.ship.invincible){
						let life = global.ship.life - 1;
						global.enemy_shot[i].alive = false;
						global.asset.sound.bom_s.currentTime = 0;
						global.asset.sound.bom_s.play()
						if(life <= 0){
							game_state(false);
						}else{
							global.ship.set({life: life});
							global.ship.change_state("DAMAGE");
						}

						break;
					}
				}
			}

			display_ship_hp();
			display_ship_firing_speed();
			display_ship_power();
	}

	if(global.run){
		setTimeout(main, global.fps);
	}
}

function game_state (bool) {
	global.run = typeof bool === "undefined"? false: bool;

	if(global.run){
		global.counter = 0;
		global.game_start = true;
		global.clear = false;
		init();
		main();
	}
	if(!global.run && global.clear){
		display_text(global.text.info, "CLEAR");
	}else if(!global.run && global.counter === 0){
		display_text(global.text.info, "START");
	}else if(!global.run && global.counter !== 0){
		display_text(global.text.info, "GAME OVER!!");
	}
}

function mouse_move (e) {
	// TODO: learn
	if(global.counter < 80) return;
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down () {
	let now_date = new Date().getTime();
	let diff = global.last_time - global.ship.firing_speed;

	if(global.counter < 80 || global.ship.invincible) {
		return;
	}
	
	if((global.last_time + global.ship.firing_speed <= now_date)){
		global.asset.sound.shot_s.currentTime = 0;
		global.asset.sound.shot_s.play()
		global.fire = true;
		global.last_time = now_date;
	}

	global.click = setInterval(()=>{
		if(!global.ship.invincible){
			global.asset.sound.shot_s.currentTime = 0;
			global.asset.sound.shot_s.play()	
			global.fire = true;
		}
	},  global.ship.firing_speed);
}

function mouse_up () {
	clearInterval(global.click);
}

// start or finish or retry
function key_down (e) {
	let key = e.keyCode;
	if(key === 13 && !global.run){
		game_state(true);
	}
}

function display_text (obj,text) {
	let x,y;
	for(let prop in obj){
		switch (prop){
			case "style":
				global.context.fillStyle = obj[prop];
				break;

			case "align":
				global.context.textAlign = obj[prop];
				break;

			case "font":
				global.context.font = obj[prop];
				break;

			case "position":
				x = obj[prop].x;
				y = obj[prop].y;
		}
	}
	global.context.fillText(text, x, y);
}

function display_ship_hp () {
	// let hp_list = new Array(global.ship.life);
	let hp_list = new Array(global.ship.life);

	for(let i = 0; i < hp_list.length; i += 1){
		let _x = global.text.hp.x * i + 5;
		global.context.fillStyle = CONSTANT.ITEM_COLOR1;
		global.context.fillRect(_x, global.text.hp.y, global.text.hp.w, global.text.hp.h);
	}
}

function display_ship_firing_speed () {
	let firing_speed_list = new Array(global.ship.firing_speed * -(1 / 100) + 4);

	for(let i = 0; i < firing_speed_list.length; i += 1){
		let _x = global.text.speed.x * i + 5;
		global.context.fillStyle = CONSTANT.ITEM_COLOR2;
		global.context.fillRect(_x, global.text.speed.y,global.text.speed.w, global.text.speed.h);
	}
}

function display_ship_power () {
	let power_list = new Array(global.ship.power);

	for(let i = 0; i < power_list.length; i += 1){
		let _x = global.text.power.x * i + 5;
		global.context.fillStyle = CONSTANT.ITEM_COLOR3;
		global.context.fillRect(_x, global.text.power.y, global.text.power.w, global.text.power.h);
	}
}

function display_remaining_time () {
	let time = global.csv_data[global.csv_data.length-1][0] - global.remaining_time;
	let m = Math.floor(time / (60 * 1000));
	time = time - (m * 60 * 1000);
	let s = Math.floor(time / 1000);
	let time_str = m + ":" + s;

	global.context.font = global.text.limit_time.font;
	global.context.textAlign = global.text.limit_time.align;
	global.context.fillStyle = global.text.limit_time.style;
	global.context.fillText(time_str, global.text.limit_time.position.x, global.text.limit_time.position.y)
}