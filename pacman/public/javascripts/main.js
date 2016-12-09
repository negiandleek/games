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

	$.core = new Game.Core(512, 512);
	$.game = new Game.Game();
	$.core.add_game($.game);

	window.addEventListener("DOMContentLoaded",()=>{
		$.core.setup("touch_move", "touch_end");
		
		// タイトル画面を作成する
		let title_menu = new Game.OutScene("title_menu",create_title_menu());
	
		title_menu.on("enter", function (e) {
			let dom = this.dom;
			$.core.root_node.addEventListener(sprt.TOUCH_START, dom.touch_root);

			dom[2].addEventListener(sprt.TOUCH_START, dom.start)
			document.addEventListener("keydown", dom.keydown_menu);

			$.core.show_if();
			this.show();
		});

		title_menu.on("exit", function (e) {
			let dom = this.dom;
			document.removeEventListener("keydown", dom.keydown_menu);
			$.core.root_node.removeEventListener(sprt.TOUCH_START, dom.touch_root);
			
			$.core.hide_if();
			this.hide();
		})

		$.core.push_out_scene(title_menu);

		// ゲームオーバー画面を作成
		$.gameover_menu = new Game.OutScene("gameover_menu",create_gameover_menu());

		$.gameover_menu.on("enter", function (e) {
			let dom = this.dom;
			let {m,s} = Game.conversion_time($.core.elapsed_time, true);
			dom[2].innerHTML = "SCORE: " + m + s;

			$.core.root_node.addEventListener(sprt.TOUCH_START, dom.touch_root);
			dom[3].addEventListener(sprt.TOUCH_START, dom.continue)
			document.addEventListener("keydown", dom.keydown_menu);
		
			$.core.show_if();
			this.show();
		})

		$.gameover_menu.on("exit", function (e) {
			let dom = this.dom;
			document.removeEventListener("keydown", dom.keydown_menu);
			$.core.root_node.removeEventListener(sprt.TOUCH_START, dom.touch_root);
			
			$.core.hide_if();
			this.hide();
		})
		
		$.game.on("enter", function () {
			load(this);
		})

		$.game.on("ready", function () {
			$.stage = $.game.push_stage();
				
			// field
			$.field = $.stage.add_field(render_field($.game, 512, 512))
			
			// player
			if(!$.game.validate("player")){
				$.player = render_player($.game);
				$.game.add_player($.player);
				$.player.on("enter_frame", function () {
					this.move();
				})

				$.player.move = function() {
					let direction = this.direction

					this.sprite_x = this.sprite_pos[direction][1].x;
					this.sprite_y = this.sprite_pos[direction][1].y;
					if(this.is_moveing){
						switch($.core.frame % 6){
							case 2:
							case 3:
								this.sprite_x = this.sprite_pos[direction][0].x;
								this.sprite_y = this.sprite_pos[direction][0].y;
								break;
							case 4:
							case 5:
								this.sprite_x = this.sprite_pos[direction][2].x;
								this.sprite_y = this.sprite_pos[direction][2].y;
								break;
						}
						this.move_by(this.x_movement, this.y_movement);
						let id = $.game.current_id;
						let field = $.game.entity.stage[id].field;
						if((this.x % field.sprite_w === 0) && (this.y % field.sprite_h === 0)){
							this.is_moveing = false;
						}
					}else{
						this.x_movement = 0;
						this.y_movement = 0;
						switch($.core.input){
							case 38:
								this.y_movement = -2;
								this.direction = "up"
								break;
							case 37:
								this.x_movement = -2
								this.direction = "left"
								break;
							case 39:
								this.x_movement = 2
								this.direction = "right"
								break;
							case 40:
								this.y_movement = 2
								this.direction = "down"
								break;
						}
						if(this.x_movement || this.y_movement){
							let x = this.x + (this.x_movement ? this.x_movement / Math.abs(this.x_movement) * 16: 0);
							let y = this.y + (this.y_movement ? this.y_movement / Math.abs(this.y_movement) * 16: 0);
							let id = $.game.current_id;
							let field = $.game.entity.stage[id].field;
							// playerのspriteサイズとfieldのスプライトサイズの差分を計算
							// fieldサイズ<playerサイズかつplayer%field=0なら正しく動作する
							let multi_x = $.player.sprite_w / field.sprite_w;
							let multi_y = $.player.sprite_h / field.sprite_h;
							let diff_x = multi_x * field.sprite_w;
							let diff_y = multi_y * field.sprite_h;
							if(0 <= x && x < field.width - diff_x && 
								0 <= y && y < field.height - diff_y &&
								!field.is_hit(x, y, multi_x, multi_y)){
								this.is_moveing = true;
								this.move();
							}
						}
					}
				}
			}else{
				$.player.x = 16;
				$.player.y = 32;
				$.player.direction = "down";
			}

			// enemy
			$.game.enemy_type.add_type({
				name: "zombie1",
				img: $.game.source.images.zombie1,
				tile_w: 32,
				tile_h: 40,
				frame: {
					down: [{x: 0, y: 24},{x: 32, y: 24},{x: 64, y: 24}],
					left: [{x: 0,y: 88},{x: 32,y: 88},{x: 64,y: 88}],
					right: [{x: 0,y: 152},{x: 32,y: 152},{x: 64,y: 152}],
					up: [{x: 0,y: 216},{x: 32,y: 216},{x: 64,y: 216}],
				},
				collections: {margin_x: 4, margin_y: 4, w: 24, h: 32}
			})

			$.stage.init_enemy();
			$.stage.enemy_manager.max_num = 2;
			$.stage.on("appear_enemy", function (e) {
				this.speed = 2;
				this.on("enter_frame", function () {
					this.frame += 1;
					if(this.frame === 1 || this.frame % 25 === 0){
						this.infruence_map = new Game.InfruenceMap($.core, $.stage.enemy_manager.field, this, $.player);
						this.infruence_map.normalization(true);
						this.infruence_map.generate_shortest_root();
					}
					if(this.running){
						this.move();
					}
				});
				this.move = function (){
					let input = this.input || "down";
					this.tile_x = this.type.frame[input][1].x;
					this.tile_y = this.type.frame[input][1].y;
					if(this.is_moveing){
						switch(this.frame % 6){
							case 2:
							case 3:
								this.tile_x = this.type.frame[input][0].x;
								this.tile_y = this.type.frame[input][0].y;
								break;
							case 4:
							case 5:
								this.tile_x = this.type.frame[input][2].x;
								this.tile_y = this.type.frame[input][2].y;
								break;
						}
						this.move_by(this.x_movement, this.y_movement);
						let id = $.game.current_id;
						let field = $.game.entity.stage[id].field;
						if((this.x % field.sprite_w === 0) && (this.y % field.sprite_h === 0)){
							this.is_moveing = false;
							if($.player.is_intersect(this)){
								$.core.stop();
								$.player.is_moveing = false;
								$.core.push_out_scene($.gameover_menu)
							}
						}
					}else{
						let xx = [0, -1, 1, 0];
						let yy = [1, 0, 0, -1];
						let x = this.x / 16;
						let y = this.y / 16;
						let direction = this.infruence_map.shortest_root[0];
						this.infruence_map.shortest_root.shift();

						this.x_movement = 0;
						this.y_movement = 0;

						switch(direction){
							case 0:
								this.y_movement = -1 * this.speed;
								this.input = "up"
								break;
							case 1:
								this.x_movement = -1 * this.speed;
								this.input = "left"
								break;
							case 2:
								this.x_movement = this.speed;
								this.input = "right"
								break;
							case 3:
								this.y_movement = this.speed;
								this.input = "down"
								break;
						}
						if(this.x_movement || this.y_movement){
							let x = this.x + (this.x_movement ? this.x_movement / Math.abs(this.x_movement) * 16: 0);
							let y = this.y + (this.y_movement ? this.y_movement / Math.abs(this.y_movement) * 16: 0);
							let id = $.game.current_id;
							let field = $.game.entity.stage[id].field;
							// playerのspriteサイズとfiledのスプライトサイズの差分を計算
							// filedサイズ<playerサイズかつplayer%filed=0なら正しく動作する
							let multi_x = $.player.sprite_w / field.sprite_w;
							let multi_y = $.player.sprite_h / field.sprite_h;
							let diff_x = multi_x * field.sprite_w;
							let diff_y = multi_y * field.sprite_h;
							if(0 <= x && x < field.width - diff_x && 
								0 <= y && y < field.height - diff_y &&
								!field.is_hit(x, y, multi_x, multi_y)){
								this.is_moveing = true;
								this.move();
							}
						}
					}
				}
			})

			$.stage.on("enter_frame", function (e) {
				this.frame += 1;
				if(this.frame === 1 || this.frame % 50 === 0){
					$.stage.appear_enemy($.game.view_pt.x + $.core.w, $.game.view_pt.y + $.core.h)
				}
			})
				
			// Gameオブジェクト内のシーンを作成する
			// FIX: eventで管理する
			$.game.show_ui();
			if(!$.game.validate("scene", $.score_ui)){
				$.score_ui = new Game.InScene("score",create_score());
				$.score_ui.show();
				$.score_ui.on("enter_frame", function (e){
					let {m,s} = Game.conversion_time($.core.elapsed_time, true);
					this.parent_node.innerHTML = m + s;
				})

				$.game.add_scene($.score_ui);
			}

			// fpsを開始する
			$.core.start();
		})
	});
	
	// FIX:loadをGame.Coreではなく、Game.Gameで管理する
	function load(context){
		context.load(collections, 100, function(result) {
			$.core.progress_bar = function() {
				let canvas = this.canvas[2];
				let ctx = this.context[2];
				let w = 200;
				let h = 50;
				let x = (canvas.width / 2) - (w / 2);
				let y = (canvas.height / 2) - (h / 2);
				
				// 初期化
				ctx.clearRect(x, y, w, h);
				ctx.strokeStyle = "rgba(33,150,243,1)";
				ctx.fillStyle = "rgba(33,150,243,1)";
				
				// 枠を描く
				ctx.beginPath();
				ctx.strokeRect(x, y, w, h);

				// 進捗分だけ色を塗りつぶす
				let pg_w = w * (arguments[0] / 100);
				ctx.fillRect(x, y, pg_w, h);
				
				if(arguments[0] === 100){
					$.game.dispatch_event(new Game.Event("ready"));
				}
			}
			$.core.progress_bar(result);
		});
	}

	function render_field(context, w, h) {
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
		player.sprite_pos = player.generate_view_pt(["down", "left", "right", "up"])
		player.direction = "down";
		return player;
	}

	function create_title_menu() {
		let title_menu = [];
		title_menu.push(document.querySelector(".title_menu"));
		title_menu.push(title_menu[0].children[0]);
		title_menu.push(title_menu[0].children[1]);
		
		title_menu.touch_root = function(e) {
			$.last_touch_target = title_menu["0"];
			e.stopPropagation();
		}

		title_menu.start = function(e) {
			console.log("start");
			e.stopPropagation();
			$.core.push_out_scene($.game);
		}

		title_menu.keydown_menu = function (e) {
			if($.last_touch_target === title_menu["0"]){
				let key_code = e.keyCode;
				if(key_code === 13){
					console.log("start");
					$.core.push_out_scene($.game);
				}
			}
		};

		return title_menu;
	}

	function create_gameover_menu() {
		let gameover_menu = [];
		gameover_menu.push(document.querySelector(".gameover-menu"));
		gameover_menu.push(gameover_menu[0].children[0]);
		gameover_menu.push(gameover_menu[0].children[1]);
		gameover_menu.push(gameover_menu[0].children[2]);

		gameover_menu.touch_root = function(e) {
			$.last_touch_target = gameover_menu["0"];
			e.stopPropagation();
		}

		gameover_menu.continue = function(e) {
			console.log("continue");
			e.stopPropagation();
			$.core.pop_out_scene();
			$.core.rewind();
		}

		gameover_menu.keydown_menu = function(e) {
			if($.last_touch_target === gameover_menu["0"]){
				let key_code = e.keyCode;
				if(key_code === 13){
					console.log("continue");
					$.core.pop_out_scene();
					$.core.rewind();
				}
			}
		};

		return gameover_menu;
	}

	function create_score () {
		let score_elem = document.querySelector(".score");

		return score_elem;
	}

}());

