"use strict"

import Point from "./common";
import Ship from "./ship";

let global = {
	$canvas: "",
	context: "",
	mouse: new Point(),
	ship: {},
	run: 1,
	fps: 1000 / 30
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

	// init position
	global.mouse.x = global.$canvas.width / 2;
	global.mouse.y = global.$canvas.height / 2;
	
	// init hisp
	global.ship = new Ship();

	// fps
	if(global.run)setInterval(main, global.fps);
})

function main () {
	// clear
	global.context.clearRect(0,0, global.$canvas.width, global.$canvas.height);

	// ship draw
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
}

function mouse_move (e) {
	// TODO: learn
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down () {
	console.log("mouse_down");
}