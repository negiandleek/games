import "./game"

(function main () {
	// 初期化
	let root = self;
	root.$ = {};

	window.addEventListener("DOMContentLoaded",()=>{
		$.dom_loaded();
	});

	$.dom_loaded = function () {
		let elems_tag = document.getElementsByTagName("canvas");
		let collections = Game.init_assets([{
			name: "player",
			type: "image",
			src: "./images/player.png"
		},{
			name: "dungeon",
			type: "image",
			src: "./images/dungeon.png"
		}]);

		for(let i = 0, length = elems_tag.length; i < length; i += 1){
			let id_name = elems_tag[i].id;
			$.save_canvas(id_name);
		}
		$.assets = Game.loading_and_progress(collections, 300);

		Game.store_canvases($.canvases);
		Game.store_contexts($.contexts);
		Game.render_middle();
	}
	
	let w = 250;
	let h = 250;
	$.canvases = {};
	$.contexts = {};

	$.save_canvas = function (name) {
		$.canvases[name] = document.getElementById(name);
		$.canvases[name].width = w;
		$.canvases[name].height = h;
		$.contexts[name] = $.canvases[name].getContext("2d");
	}
}());