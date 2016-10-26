(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	let Obj_proto = Object.prototype;
	let toString = Obj_proto.toString;

	Game.namespace = function (string) {
		let parts = string.split(".")
		let parent = Game;

		if(parts[0] === "Game"){
			parts = parts.slice(1);
		}

		for(let i = 0, length = parts.length; i < length; i += 1){
			if(typeof parent[parts[i]] === "undefined"){
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
	};
	
	Game.is_dict = function (obj){
		return toString.call(obj) === "[object Object]";
	};

	Game.init_assets = function (obj) {
		if(!Game.is_dict(obj)){
			return false;
		}
		Game.namespace("Game.assets.collections");
		let collections = Game.assets.collections = [];

		for(let key in obj){
			collections.push(obj[key]);
		}
	};

	Game.load_first = function (assets) {
		for(let i = 0, length = load_init.length; i < length; i += 1){
			Game.namespace("Game.assets.images");
			let images = Game.assets.images = [];
			images[assets.name] = new Image();
			images[assets.name].src = assets.src;
			images[assets.name].onload = Game.progress_render();
		}
		let length = Game.operate_progress.store_assets_length();
		Game.progress_render(len);
	};

	Game.operate_progress = (function () {
		let length = 0;
		let i = 0;
		
		function store_assets_length() {
			len = Game.assets.collections.length;
			return len;
		}
		function loaded_assets() {
			i = i + 1;
			let parcent = (i / length) * 100;
			return parcent;
		}
		return {
			store_assets_length,
			loaded_assets
		};
	})();

	Game.progress_render = (function () {
		let progress_times = 0;
		let i = 0;
		return function (len) {
			progress_times += 1;
			for(; i < len; i += 1){
				progress_update();
				break;
			}
			function progress_update() {
			}
		}
	})();

	Game.fetch_cell_point = function(w,h,x,y) {
	    let ix = 0;
	    let iy = 0;
	    for(;iy <= h; iy += y){
	        ix = 0;
	        for(; ix <= w; ix += x){
	            point.push({
	                x: ix,
	                y: iy
	            }) 
	        }
	    }
	}


})();