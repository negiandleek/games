import "./game"

(function main () {
	// 初期化
	let root = self;
	root.$ = {};
	
	$.dom = {};
	$.canvases = {};
	$.contexts = {};
	$.last_touch_target;
	let sprt = Game.sprt;
	let collections = Game.init_assets([
		{
			name: "player",
			type: "image",
			src: "./images/player.png"
		},{
			name: "zombie1",
			type: "image",
			src: "./images/zombie1.png"
		},{
			name: "zombie2",
			type: "image",
			src: "./images/zombie2.png"
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
		$.core.setup("touch_move", "touch_end");
		
		// title menu用のシーンを作成する
		let title_menu = new Game.Scene("title_menu",create_title_menu());
		title_menu.on("change_scene", function (e) {
			if($.core.state === "title_menu"){
				$.core.root_node.style.display = "block";
			}else{
				$.core.root_node.style.display = "none";
			}
		})
		
		// coreにtitle menuシーンを追加
		$.core.add_scene(title_menu);

		// タイトル画面を表示するためのstate
		$.core.store_game_state("title_menu");

		// シーンが変わった時のイベントを追加
		// TODO: ここの処理もっと改善できる(game.onload)
		$.core.on("change_scene", function(e){
			let state = e.target.state;
			if(state === "loading"){
				load(this.game_object);
			}else if(state === "playing"){
				// filed
				$.filed = render_filed($.game, this.w, this.h);
				$.game.add_filed($.filed);

				// player
				$.player = render_player($.game);
				$.game.add_player($.player);
				$.player.on("enter_frame", function () {
					$.player.move();
				})

				$.player.move = function() {
					let input = this.input || "down";

					//TODO: 0 1 0 2
					this.sprite_x = this.sprite_pos[input][1].x;
					this.sprite_y = this.sprite_pos[input][1].y;

					if(this.is_moveing){
						switch($.core.frame % 6){
							case 2:
							case 3:
								this.sprite_x = this.sprite_pos[input][0].x;
								this.sprite_y = this.sprite_pos[input][0].y;
								break;
							case 4:
							case 5:
								this.sprite_x = this.sprite_pos[input][2].x;
								this.sprite_y = this.sprite_pos[input][2].y;
								break;
						}
						this.move_by(this.x_movement, this.y_movement);
						let id = $.game.filed_id;
						let filed = $.game.entity.filed[id];
						if((this.x % filed.sprite_w === 0) && (this.y % filed.sprite_h === 0)){
							this.is_moveing = false;
						}
					}else{
						this.x_movement = 0;
						this.y_movement = 0;
						switch($.core.input){
							case 38:
								this.y_movement = -2;
								this.input = "up"
								break;
							case 37:
								this.x_movement = -2
								this.input = "left"
								break;
							case 39:
								this.x_movement = 2
								this.input = "right"
								break;
							case 40:
								this.y_movement = 2
								this.input = "down"
								break;
						}
						if(this.x_movement || this.y_movement){
							let x = this.x + (this.x_movement ? this.x_movement / Math.abs(this.x_movement) * 16: 0);
							let y = this.y + (this.y_movement ? this.y_movement / Math.abs(this.y_movement) * 16: 0);
							let id = $.game.filed_id;
							let filed = $.game.entity.filed[id];
							// playerのspriteサイズとfiledのスプライトサイズの差分を計算
							// filedサイズ<playerサイズかつplayer%filed=0なら問題ない
							let multi_x = $.player.sprite_w / filed.sprite_w;
							let multi_y = $.player.sprite_h / filed.sprite_h;
							let diff_x = multi_x * filed.sprite_w;
							let diff_y = multi_y * filed.sprite_h;

							if(0 <= x && x < filed.width - diff_x && 
								0 <= y && y < filed.height - diff_y &&
								!filed.is_hit(x, y, multi_x, multi_y)){
								this.is_moveing = true;
								this.move();
							}
						}
					}
				}
				// enemy
				$.game.enemy_manager.add_enemy_type({
					name: "zombie1",
					img: $.game.source.images.zombie1,
					tile_w: 32,
					tile_h: 32,
					frame: [{
						up: [{x: 0,	y: 24},{x: 32, y: 24},{x: 64, y: 24}],
						left: [{x: 0,y: 88},{x: 32,y: 88},{x: 62,y: 88}],
						right: [{x: 0,y: 152},{x: 32,y: 152},{x: 62,y: 152}],
						down: [{x: 0,y: 192},{x: 32,y: 192},{x: 62,y: 192}],
					}],
				})
				$.game.enemy_manager.max_num = 3;
				$.game.enemy_manager.add_enemy();

				// fpsを開始する
				$.core.start();
			};
		})

	});

	function load(context){
		context.load(collections, 100, function(result) {
			$.core.store_game_state("loading");
			$.core.render_fore(result);
		});
	}

	function render_filed(context, w, h) {
		let filed = new Game.Filed(512, 512);
		filed.img = context.source.images.dungeon;
		filed.img_pt = Game.create_point(filed.img.width, filed.img.height, 16, 16);
		filed.csv = context.source.csves.filed;
		filed.collision = context.source.csves.collision;
		filed.view_pt = Game.create_point(w, h, 16, 16);
		return filed;
	}

	function render_player(context) {
		let player = new Game.Player(32, 32, "multiple");
		player.img = context.source.images.player;
		player.walk = 0;
		player.sprite_pos = player.generate_view_pt(["down", "left", "right", "up"])
		return player;
	}

	function create_title_menu() {
		let title_menu = [];
		title_menu.push(document.querySelector(".title_menu"));
		title_menu.push(title_menu[0].children[0]);
		title_menu.push(title_menu[0].children[1]);
		title_menu.push(title_menu[0].children[2]);

		$.core.root_node.addEventListener(sprt.TOUCH_START, (e) => {
			$.last_touch_target = title_menu[0];
			e.stopPropagation();
		})
		
		title_menu[2].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("loading");
		})

		title_menu[3].addEventListener(sprt.TOUCH_START, (e)=> {
			e.stopPropagation();
			$.core.store_game_state("setting");
		})

		// TODO:enchant参考にする
		document.addEventListener("keydown", (e)=> {
			if($.last_touch_target === title_menu[0]){
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
			}
		});

		return title_menu;
	}
}());

