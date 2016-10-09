"use strict"

import Point from "./common";
import Ship from "./ship";
import Ship_shot from "./ship_shot";

export let global = {
	$canvas: "",
	context: "",
	mouse: new Point(),
	ship: {},
	ship_shot: {},
	run: 1,
	fps: 1000 / 30,
	fire: false
}

const CONSTANT = {
	CHARA_SHOT_MAX_COUNT: 5
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

	/*init*/
	//position
	global.mouse.x = global.$canvas.width / 2;
	global.mouse.y = global.$canvas.height / 2;
	
	// ship
	global.ship = new Ship();

	// ship shot
	global.ship_shot = new Array(CONSTANT["CHARA_SHOT_MAX_COUNT"]);
	for(let i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1){
		global.ship_shot[i] = new Ship_shot();
	}

	/*fps*/
	if(global.run)setInterval(main, global.fps);
})

function main () {
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

	global.context.fill();
}

function mouse_move (e) {
	// TODO: learn
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down () {
	global.fire = true
}