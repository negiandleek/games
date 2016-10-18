import Point from "./common";

export let global = {
	$canvas: "",
	context: "",
	counter: 0,
	click: "",
	mouse: new Point(),
	ship: [],
	ship_shot: [],
	run: false,
	fps: 1000 / 30,
	fire: false,
	enemy_shot: [],
	game_start: true,
	text:{
		score: {},
		info: {
			align: "center ,sans-serif",
			font: "32px 'ＭＳ ゴシック'",
			style: "rgb(0,0,0)",
			position: {}
		},
		limit_time: {
			align: "center ,sans-serif",
			font: "16px 'ＭＳ ゴシック'",
			style: "rgb(0,0,0)",
			position: {}
		},
		hp: {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		},
		speed:{
			x: 0,
			y: 0,
			w: 0,
			h: 0
		},
		power: {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		}
	},
	csv: [],
	icsv: 0,
	item: [],
	last_time: "",
	init_time: "",
	remaining_time: "",
	boss: [],
	henchman: [],
	clear: false,
	assets: []
}