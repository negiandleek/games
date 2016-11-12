import "./game"

(function main () {
	// 初期化
	let root = self;
	root.$ = {};
	
	$.dom = {};
	$.canvases = {};
	$.contexts = {};

	let sprt = Game.sprt;
	let collections = Game.init_assets([
		{
			name: "player",
			type: "image",
			src: "./images/player.png"
		},{
			name: "dungeon",
			type: "image",
			src: "./images/dungeon.png"
		},{
			name: "field1",
			type: "xml",
			src: "./field1.xml"
		}
	]);

	$.game = new Game.Game();
	$.core = new Game.Core(512, 512);
	$.core.add_game($.game);

	window.addEventListener("DOMContentLoaded",()=>{
		$.core.dom_loaded();
		
		// title menu用のシーンを作成する
		let title_menu = new Game.Scene("title_menu",create_title_menu());
		title_menu.on("change_scene", function (e) {
			if($.core.state === "title_menu"){
				this.dom[0].style.display = "block";
			}else{
				this.dom[0].style.display = "none";
			}
		})
		
		// coreにtitle menuシーンを追加
		$.core.add_scene(title_menu);

		// タイトル画面を表示するためのstate
		$.core.store_game_state("title_menu");

		// シーンが変わった時のイベントを追加
		$.core.on("change_scene", function(e){
			let state = e.target.state;
			console.log(state);
			if(state === "loading"){
				load(this.game_object);
			}else if(state === "playing"){
				render_filed($.game, this.w, this.h);
				render_middle($.game);
			};
		})
	});

	function load(context){
		context.load(collections, 300, function(result) {
			$.core.store_game_state("loading");
			$.core.render_fore(result);
		});
	}

	function render_filed(context, w, h) {
		let images = context.object.images;
		let csves = context.object.csves;
		let dungeon_img = images.dungeon;
		let field_csv = csves.filed;
		let img_point = Game.create_point(dungeon_img.width, dungeon_img.height, 16, 16);
		let canvas_point = Game.create_point(w, h, 16, 16);

		$.core.render_back("state", dungeon_img, field_csv, img_point, canvas_point);
	}

	// function render_middle(context) {
	// 	$.player = new Game.Player(32, 32, "multiple");
	// 	$.player.img = images.player;
	// 	$.player.x = 16;
	// 	$.player.y = 16;
	// }

	function create_title_menu() {
		let title_menu = [];
		title_menu.push(document.querySelector(".title_menu"));
		title_menu.push(title_menu[0].children[0]);
		title_menu.push(title_menu[0].children[1]);
		title_menu.push(title_menu[0].children[2]);
		
		title_menu[2].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("loading");
		})

		title_menu[3].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("loading");
		})

		title_menu[0].addEventListener("keydown", (e)=> {
			let key_code = e.keyCode;
			// up key 38 down key 40;
			if(key_code === 38){
				Game.atr_toggle("data-select", title_menu, "up");
			}else if(key_code === 40){
				Game.atr_toggle("data-select", title_menu, "down");
			}else if(key_code === 13){
				//TODO: get attr
				$.core.store_game_state("loading");
			}
		});
		return title_menu;
	}
}());

