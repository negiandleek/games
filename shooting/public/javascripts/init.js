import Ship from "./ship";
import Ship_shot from "./ship_shot";
import {Enemy} from "./enemy";
import Enemy_shot from "./enemy_shot";
import {global} from "./global";
import {CONSTANT} from "./constant";

export function init() {
	let x = global.$canvas.width / 2;
	let y = global.$canvas.height / 2;
	global.mouse.x = x
	global.mouse.y = y
	global.text.info.position.x = x;
	global.text.info.position.y = y;
	global.icsv = 0;
	global.item = [];
	// ship
	global.ship = new Ship();
	global.ship.set({
		life: 2,
		size: 15,
		firing_speed: 300
	})
	// ship shot
	global.ship_shot = new Array(CONSTANT["CHARA_SHOT_MAX_COUNT"]);
	for(let i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1){
		global.ship_shot[i] = new Ship_shot();
	}

	// enemy
	global.enemy = new Array(CONSTANT["ENEMY_MAX_COUNT"]);
	for(let i = 0; i < CONSTANT["ENEMY_MAX_COUNT"]; i += 1){
		global.enemy[i] = new Enemy();
	}

	// enemy shot
	let enemy_shot = new Array(CONSTANT["ENEMY_SHOT_MAX_COUNT"]);
	for(let i = 0; i < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; i += 1){
		global.enemy_shot[i] = new Enemy_shot();
	}
}