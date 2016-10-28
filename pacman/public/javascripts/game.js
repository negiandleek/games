(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	let Obj_proto = Object.prototype;
	let Arr_proto = Array.prototype;
	let toString = Obj_proto.toString;
	let slice = Arr_proto.slice;

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

		let collections = [];

		for(let i = 0, len = arr.length; i < len; i += 1){
			collections.push(arr[i]);
		}

		return collections;
	};

	Game.loading_and_progress = function (col, mili) {
		let length = col.length;
		let time = mili || 0;
		
		let loaded = Game.progress_render(time, length);
		loaded();

		let assets = {
			images: {},
			fetch_images: function () {
				return assets.images;
			}
		};

		for(let i = 0; i < length; i += 1){
			let item = col[i];
			assets.images[item.name] = new Image();
			assets.images[item.name].src = item.src;
			assets.images[item.name].onload = loaded();
		}

		return assets;
	};

	Game.store_progress = function (len) {
		let i = 0;

		return function () {
			let parcent = Math.floor((i / len) * 100);
			i = i + 1;
			return parcent;
		}
	};

	Game.progress_render = function (mill, len) {
		let call_times = 0;
		let last_date = new Date().getTime();
		// ロード時間の最小値
		let load_min_time = 300;
		let interval = 0;
		let fetch_progress = Game.store_progress(len);

		interval = Math.max(mill, load_min_time) / len;

		return Game.progress_render = function () {
			let now = new Date().getTime();
			call_times += 1;
			if(last_date + interval <= now){
				while(call_times >= 1){
					last_date = now;
					call_times -= 1;
					Game.render_fore("progress",fetch_progress());
					break;
				}
			}else{
				let diff = now - (last_date + interval);
				setTimeout(Game.progress_render, diff);
			}
		}
	};

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

	Game.store_canvases = function (dict) {
		Game.namespace("Game.canvas");
		let canvas = Game.canvas = [];

		if(Game.is_dict(dict)){
			for(let key in dict) {
				canvas.push(dict[key]);
			}
		}
	}

	Game.store_contexts = function (dict) {
		Game.namespace("Game.contexts");
		let contexts = Game.contexts = [];

		if(Game.is_dict(dict)){
			for(let key in dict) {
				contexts.push(dict[key]);
			}
		}
	}

	Game.render_back = function () {

	}

	Game.render_middle = function () {
		let canvas = Game.canvas[1];
		let ctx = Game.contexts[1];
	}

	Game.render_fore = function (type) {
		let canvas = Game.canvas[2];
		let ctx = Game.contexts[2];
		let args = slice.call(arguments, 1);
		if(type === "progress") {
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
			let pg_w = w * (args[0] / 100);
			ctx.fillRect(x, y, pg_w, h);
		}
	}
})();