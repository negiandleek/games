"use strict"

import {init} from "./init";
import {global} from "./global";
import {CONSTANT} from "./constant";

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
	global.ship.position.x = global.mouse.x;
	global.ship.position.y = global.mouse.y;

	//proparty
	global.context.arc(
		global.ship.position.x,
		global.ship.position.y,
		global.ship.size,
		0,
		Math.PI * 2
	);

	// draw
	global.context.fillStyle = CONSTANT.CHARA_COLOR;
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
			if(global.counter % 50 === 0){
				for(let i = 0; i < CONSTANT["ENEMY_MAX_COUNT"]; i += 1){
					if(!global.enemy[i]["alive"]){
						// type
						let j = (global.counter % 100) / 50;
						let enemy_size = 15;
						let p = {};
						p.x = global.$canvas.width;
						p.y = -enemy_size + (global.$canvas.height + enemy_size * 2) * j;

						global.enemy[i].set({
							position: p,
							size: enemy_size,
							type: j,
							speed: 5
						});
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
					if(global.enemy[i].param % 30 === 0){
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
						if(p.length() < global.enemy[j].size){
							global.enemy[j].alive = false;
							global.ship_shot[i].alive = false;

							break;
						}
					}
				}
			}

			// enemy shot and ship
			for(let i = 0; i < CONSTANT.ENEMY_SHOT_MAX_COUNT; i += 1){
				if(global.enemy_shot[i].alive){
					let p = global.ship.position.distance(global.enemy_shot[i].position);
					if(p.length() < global.ship.size){
						game_state(false);

						break;
					}
				}
			}
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
	if(global.counter < 80) return;
	
	global.fire = true;

	global.click = setInterval(()=>{
		global.fire = true;
	},  250);
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