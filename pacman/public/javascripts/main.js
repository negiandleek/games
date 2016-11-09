import "./game"

(function main () {
	// 初期化
	let root = self;
	root.$ = {};
	
	$.dom = {};
	$.canvases = {};
	$.contexts = {};
	$.w = 512;
	$.h = 512;

	let sprt = Game.sprt;

	window.addEventListener("DOMContentLoaded",()=>{
			$.core = new Game.Core(512, 512);
			let title_menu = new Game.Scene("title_menu",create_title_menu());
			title_menu.on("change_scene", function (e) {
				if($.core.state === "title_menu"){
					this.dom[0].style.display = "block";
				}else{
					this.dom[0].style.display = "none";
				}
			})
			$.core.add_scene(title_menu);

			$.core.store_game_state("title_menu");

			$.game = new Gmae.Game();
	});

	function create_title_menu() {
		let title_menu = [];
		title_menu.push(document.querySelector(".title_menu"));
		title_menu.push(title_menu[0].children[0]);
		title_menu.push(title_menu[0].children[1]);
		title_menu.push(title_menu[0].children[2]);
		
		title_menu[2].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("start");
		})

		title_menu[3].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("start");
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
				$.core.store_game_state("start");
			}
		});

		return title_menu;
	}

	$.dom_loaded = function () {
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

		// $.assets = Game.loading_and_progress(collections, 300, $.operate_game);
	}

// Game moduleで管理する
// 	$.operate_game = function (context) {
// 		let state = context || Game.store_game_state.fetch();
// 		console.log(state);

// 		if(state === "playing"){
// 			let images = $.assets.fetch_images();
// 			let csvs = $.assets.fetch_csvs();
// 			let img_point = Game.create_point(384, 160, 16, 16);
// 			let canvas_point = Game.create_point(512, 512, 16, 16);
// 			let dungeon_img = images.dungeon;
// 			let field_csv = csvs.filed;

// 			Game.render_back(state, dungeon_img, field_csv, img_point, canvas_point);

// 			$.core = new Game.Core();
// 			$.game = new Game.Game();
// 			$.player = new Game.Player(32, 32, "multiple");
// 			$.player.img = images.player;
// 			$.player.x = 16;
// 			$.player.y = 16;
// 			$.player.on("enter_frame", function (){
// 			})

// 			$.core.now($.game);
// 			$.core.add($.player);

// 			$.core.start();
// 		}
// 	}
}());