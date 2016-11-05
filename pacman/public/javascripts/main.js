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

	window.addEventListener("DOMContentLoaded",()=>{
			$.dom_store();
			$.dom_loaded();
	});

	$.dom_loaded = function () {
		let elems_tag = document.getElementsByTagName("canvas");
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

		for(let i = 0, length = elems_tag.length; i < length; i += 1){
			let id_name = elems_tag[i].id;
			if(i === length - 1){
				$.save_canvas(id_name, "click");
			}else{
				$.save_canvas(id_name);
			}
		}
		Game.store_canvases($.canvases);
		Game.store_contexts($.contexts);
		// titleやstyleをセットする
		$.is_setting = Game.create_title_menu("FAKED PACMAN", $.w, $.h);

		$.assets = Game.loading_and_progress(collections, 300, $.operate_game);
	}

	$.save_canvas = function (name) {
		let args = Array.prototype.slice.call(arguments, $.save_canvas.length);
		$.canvases[name] = document.getElementById(name);
		$.canvases[name].width = $.w;
		$.canvases[name].height = $.h;
		$.contexts[name] = $.canvases[name].getContext("2d")

		// 最も前にあるcanvasにのみイベントを付与
		if(args.length){
			for(let i = 0, length = args.length; i < length; i += 1){
				$.canvases[name].addEventListener(args[i], ()=>{
					Game[args[i]].call($.canvases[name], event)
				})
			}
		}
	}

	$.dom_store = function () {
		$.dom.ui = document.getElementById("ui");
		$.dom.title_menu = document.querySelector(".title_menu");
		$.dom.title_menu_header = $.dom.title_menu.children[0];
		$.dom.title_menu_start = $.dom.title_menu.children[1];
		$.dom.title_menu_setting = $.dom.title_menu.children[2];
	}

	// Game moduleで管理する
	$.operate_game = function (context) {
		let state = context || Game.store_game_state.fetch();
		console.log(state);

		$.dom.title_menu.style.display = "none";

		if(state === "title_menu") {
			setTimeout(()=>{
				$.dom.title_menu_start.focus()
			},0);

			$.dom.title_menu.addEventListener("click", (e)=> {
				e.stopPropagation();
				$.operate_game(Game.change_state_by_dom(e.target))
			})

			$.dom.title_menu.addEventListener("keydown", (e)=> {
				let key_code = e.keyCode;
				// up key 38
				// down key 40
				if(key_code === 38 || key_code === 40 && $.is_setting()){
					Game.dom_atr_toggle("data-select", "data", $.dom.title_menu_start, $.dom.title_menu_setting);
				}else if(key_code === 13){
					$.operate_game(Game.change_state_by_dom($.dom.title_menu, "data-select"));
				}else{
					return false;
				}
			});
			$.dom.title_menu.style.display = "block";
		}else if(state === "playing"){
			let images = $.assets.fetch_images();
			let csvs = $.assets.fetch_csvs();
			let img_point = Game.create_point(384, 160, 16, 16);
			let canvas_point = Game.create_point(512, 512, 16, 16);
			let dungeon_img = images.dungeon;
			let field_csv = csvs.filed;

			Game.render_back(state, dungeon_img, field_csv, img_point, canvas_point);
			$.player = new Game.player(32, 32, "multiple");
			$.player.img = images.player;
			$.player.x = 16;
			$.player.y = 16;
		}
	}
}());