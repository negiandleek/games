"use strict"

import {init} from "./init";
import {global} from "./global";
import {CONSTANT} from "./constant";
import {Item} from "./item";
import {getEnemyCSV} from "./csv";

getEnemyCSV();

export function get_csv_data (result) {
	global.csv_data = result;
}

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

	//proparty
	global.context.arc(
		global.ship.position.x,
		global.ship.position.y,
		global.ship.size,
		0,
		Math.PI * 2
	);

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
	global.context.fill();

	/*ship shot draw*/
	// set
	if(global.fire){
		for(let i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1){
			if(!global.ship_shot[i].alive){
				global.ship_shot[i].set([global.ship.position]);
				break;
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
			// set
			if(global.counter === global.csv_data[global.icsv][0]){
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
			}

			// draw
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
							if(r <= 50){
								let __item = new Item();
								__item.set({
									type: "HP",
									size: 5,
									speed: 3,
									position: global.enemy[j].position
								});
								global.item.push(__item);
							}
							if(r >= 51 && r <= 100){
								let __item = new Item();
								__item.set({
									type: "FIRING",
									size: 5,
									speed: 3,
									position: global.enemy[j].position
								});
								global.item.push(__item);
							}
							break;
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
	}
	if(global.run){
		setTimeout(main, global.fps);
	}
}

function game_state (bool) {
	global.run = typeof bool === "undefined"? false: bool;

	if(global.run){
		global.counter = 0;
		init();
		main();
	}

	if(!global.run && global.counter !== 0){
		display_text(global.text.info, "GAME OVER!!");
	}else if(!global.run && global.counter === 0){
		display_text(global.text.info, "START");
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
		global.fire = true;
		global.last_time = now_date;
	}

	global.click = setInterval(()=>{
		if(!global.ship.invincible){
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

function display_ship_hp(){
	// let hp_list = new Array(global.ship.life);
	let hp_list = new Array(global.ship.life);
	let w = 15;
	let h = 30;
	let x = global.$canvas.offsetLeft + 5;
	let y = global.$canvas.offsetHeight - 70;
	for(let i = 0; i < hp_list.length; i += 1){
		let _x = 20 * i + 5;
		global.context.fillStyle = CONSTANT.ITEM_COLOR1;
		global.context.fillRect(_x, y, w, h);
	}
}

function display_ship_firing_speed(){
	let firing_speed_list = new Array(global.ship.firing_speed * -(1 / 100) + 4);
	let w = 15;
	let h = 30;
	let x = global.$canvas.offsetLeft + 5;
	let y = global.$canvas.offsetHeight - 35;
	for(let i = 0; i < firing_speed_list.length; i += 1){
		let _x = 20 * i + 5;
		global.context.fillStyle = CONSTANT.ITEM_COLOR2;
		global.context.fillRect(_x, y, w, h);
	}
}