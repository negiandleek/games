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
	
	Game.is_array = function (arr) {
		return toString.call(arr) === "[object Array]";
	}

	Game.is_dict = function (obj) {
		return toString.call(obj) === "[object Object]";
	};

	Game.init_assets = function (arr) {
		if(!Game.is_array(arr)){
			return false;
		}
		Game.namespace("Game.assets.collections");
		let collections = Game.assets.collections = [];

		for(let i = 0, len = arr.length; i < len; i += 1){
			collections.push(arr[i]);
		}
	};

	Game.load = function (_time) {
		let length = Game.assets_state.fetch_assets_length();
		let time = _time || 0;

		Game.progress_render.store_interval(time);
		Game.progress_render.draw();

		for(let i = 0; i < length; i += 1){
			Game.namespace("Game.assets.images");
			let images = Game.assets.images = [];
			let assets = Game.assets.collections[i];

			images[assets.name] = new Image();
			images[assets.name].src = assets.src;
			images[assets.name].onload = Game.progress_render.draw();
		}
	};

	Game.assets_state = (function () {
		let length = 0;
		let i = 0;
		
		function fetch_assets_length() {
			try{
				length = Game.assets.collections.length;
			}catch(e) {
				length = 0;
			}
			return length;
		}
		function loaded_assets_parcent() {
			i = i + 1;
			let parcent = (i / length) * 100;
			return parcent;
		}
		return {
			fetch_assets_length,
			loaded_assets_parcent
		};
	})();

	Game.progress_render = (function (self) {
		let progress_times = 0;
		let last_date = new Date().getTime();
		// ロード時間の最小値
		let load_min_time = 300;
		let interval = 0;

		let store_interval = function (time) {
			if(time >= load_min_time){
				load_min_time = time;
			}
			let length = self.assets_state.fetch_assets_length();
			interval = load_min_time / length;
		}

		let draw = function () {
			let now = new Date().getTime();
			progress_times += 1;

			if(last_date + interval <= now){
				while(progress_times >= 1){
					last_date = now;
					progress_times -= 1;
					console.log(self.assets_state.loaded_assets_parcent());
					break;
				}
			}else{
				let diff = now - (last_date + interval);
				setTimeout(draw, diff);
			}
		}

		return {
			store_interval,
			draw
		}

	}(Game));

	Game.fetch_image_point = function(w,h,x,y) {
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