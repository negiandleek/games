(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	let Obj_proto = Object.prototype;
	let Arr_proto = Array.prototype;
	let toString = Obj_proto.toString;
	let slice = Arr_proto.slice;

	Game.store_state = function () {
		let state = "menu";
		return state;
	}

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

		let collections = {
			images: [],
			xmls: []
		};


		for(let i = 0, length = arr.length; i < length; i += 1){
			switch(arr[i].type) {
				case "image":
					collections.images.push(arr[i]);
					break;

				case "xml":
					collections.xmls.push(arr[i]);
					break;
			}
		}
		return collections;
	};

	Game.loading_and_progress = function (col, mili) {
		let imgs_length = col.images.length;
		let xml_length = col.xmls.length;
		let time = mili || 0;
		let loaded = Game.progress_render(time, imgs_length + xml_length);
		loaded();
		
		let assets = {
			images: {},
			csv: {},
			xhr: {},
			fetch_images: function () {
				return assets.images;
			},
			fetch_csv: function () {
				return assets.csv;
			}
		};

		// load images
		for(let i = 0; i < imgs_length; i += 1){
			let item = col.images[i];
			
			assets.images[item.name] = new Image();
			assets.images[item.name].src = item.src;
			assets.images[item.name].onload = loaded();
		}

		// load xml;
		for(let i = 0; i < xml_length; i += 1){
			let item = col.xmls[i];

			assets.xhr[item.name] = new XMLHttpRequest();
			assets.xhr[item.name].onload = () => {
				save_csv(assets.xhr[item.name].responseXML, item.name)
				loaded();
			};
			assets.xhr[item.name].open("get", item.src, true);
			assets.xhr[item.name].send();
		}

		// extract csv to xml;
		let save_csv = function (text, prop) {
			let elem_layer = text.querySelectorAll("layer");

			for(let i = 0, length = elem_layer.length; i < length; i += 1){
				let elem = elem_layer[i];
				let name = elem.attributes.name.nodeValue;
				let csv_str = elem.childNodes[1].innerHTML;

				assets.csv[name] = parce_csv(name, csv_str);
			}

			delete assets.xhr.prop;
		}

		let parce_csv = function (name, text) {
			assets.csv[name] = [];
			let one_arr = text.split("\n");
			let two_arr = [];

			one_arr.shift();
			one_arr.pop();

			for(let i = 0, length = one_arr.length; i < length; i += 1) {
				one_arr[i] = one_arr[i].substring(0, one_arr[i].length - 1);
				two_arr[i] = one_arr[i].split(",");
				for(let j = 0; j < two_arr[i].length; j += 1){
					two_arr[i][j] = two_arr[i][j] - 0;
				}
			}
			return two_arr;
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

	Game.fetch_image_point = function(w, h, x, y) {
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

	Game.render_fore = function (context) {
		let canvas = Game.canvas[2];
		let ctx = Game.contexts[2];
		let args = slice.call(arguments, 1);
		if(context === "progress") {
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
			
			if(args[0] === 100){
				setTimeout(Game.render_fore, 100, "start_menu");
			}
		} else if(context === "start_menu") {
			ctx.clearRect(0, 0, 250, 250);
		}
	}
})();