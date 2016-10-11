import Point from "./common";

export let global = {
	$canvas: "",
	context: "",
	counter: 0,
	click: "",
	mouse: new Point(),
	ship: {},
	ship_shot: {},
	run: false,
	fps: 1000 / 30,
	fire: false,
	enemy_shot: {},
	text:{
		score: {},
		info: {
			align: "center ,sans-serif",
			font: "30px 'ＭＳ ゴシック'",
			style: "rgb(0,0,0)",
			position: {}
		}
	}
}