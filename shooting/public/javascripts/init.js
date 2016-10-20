import Ship from "./ship";
import Ship_shot from "./ship_shot";
import {Enemy} from "./enemy";
import Enemy_shot from "./enemy_shot";
import {Boss, Henchman} from "./boss";
import {global} from "./global";
import {CONSTANT} from "./constant";
import {load_assets} from "./assets";

export function init() {
	let x = global.$canvas.width / 2;
	let y = global.$canvas.height / 2;
	global.mouse.x = x
	global.mouse.y = y
	global.text.info.position.x = x;
	global.text.info.position.y = y;
	global.icsv = 0;
	global.item = [];
	global.last_time = new Date().getTime(),
	global.init_time = new Date().getTime();
	// ship
	global.ship = new Ship();
	global.ship.set({
		life: 2,
		size: 15,
		power: 1,
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
	global.enemy_shot = new Array(CONSTANT["ENEMY_SHOT_MAX_COUNT"]);
	for(let i = 0; i < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; i += 1){
		global.enemy_shot[i] = new Enemy_shot();
	}

	// boss init
	global.boss = new Boss();

	// boss bit init;
	global.henchman = new Array(CONSTANT.BOSS_HENCHMAN_COUNT);
	for(let i = 0; i < CONSTANT.BOSS_HENCHMAN_COUNT; i += 1){
		global.henchman[i] = new Henchman();
	}

	//dispaly
	global.text.limit_time.position.x = global.$canvas.offsetLeft + global.$canvas.width - 50;
	global.text.limit_time.position.y = global.$canvas.offsetHeight - 5;

	global.text.hp.x =	global.$canvas.offsetLeft + 20;
	global.text.hp.y = global.$canvas.offsetHeight - 105;
	global.text.hp.w = 20;
	global.text.hp.h = 30;

	global.text.speed.x = global.$canvas.offsetLeft + 20;
	global.text.speed.y = global.$canvas.offsetHeight - 70;
	global.text.speed.w = 20;
	global.text.speed.h = 30;

	global.text.power.x = global.$canvas.offsetLeft + 20;
	global.text.power.y = global.$canvas.offsetHeight - 35;
	global.text.power.w = 20;
	global.text.power.h = 30;

	//csv,image
	global.asset.assets = [{
		type: "csv", 
		name: "enemy",
		src: "./enemy.csv"
	},{
		type: "image",
		name: "space_art",
		src: "./images/spaceArt.txt"
	},{
		type: "sound",
		name: "shot_s",
		src: "./images/shot.mp3"
	},{
		type: "sound",
		name: "bom_s",
		src: "./images/bom.mp3"
	}];
	global.asset.sound = {};
	let completed_assets = (function () {
		let length = global.asset.assets.length;
		let count = 0;
		let timer;
		function progress () {
			count += 1;
			let percent = (count / length) * 100;
		}
		return {
			progress
		}
	})();
	
	load_assets(completed_assets.progress);
}