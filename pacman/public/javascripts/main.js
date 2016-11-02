import "./game"

(function main () {
	// 初期化
	let root = self;
	root.$ = {};
	
	$.w = 512;
	$.h = 512;

	window.addEventListener("DOMContentLoaded",()=>{
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
		Game.render_middle();
		// titleやstyleをセットする
		Game.create_title_menu("FAKED PACMAN",$.w, $.h);

		$.assets = Game.loading_and_progress(collections, 300);
	}

	$.canvases = {};
	$.contexts = {};

	$.save_canvas = function (name) {
		let args = Array.prototype.slice.call(arguments, $.save_canvas.length);
		$.canvases[name] = document.getElementById(name);
		$.canvases[name].width = $.w;
		$.canvases[name].height = $.h;
		$.contexts[name] = $.canvases[name].getContext("2d")

		// 最も前にあるcanvasにのみイベントを付与
		if(args.length){
			for(let i = 0, length = args.length; i < length; i += 1){
				$.canvases[name].addEventListener(args[i], Game[args[i]].call($.canvases[name], event))
			}
		}
	}
}());