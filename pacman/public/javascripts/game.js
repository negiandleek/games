(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	// init variable
	Game.assets = {};

	let Obj_proto = Object.prototype;
	let Arr_proto = Array.prototype;
	let Func_proto = Function.prototype;
	let toString = Obj_proto.toString;
	let slice = Arr_proto.slice;
	let call = Func_proto.call;

	Game.store_game_state = (function () {
		// init, title_menu,loading, playing, gameover, continue_menu, setting
		let state = "init";
		
		let stored_game_state = function(type, cb) {
			if(Game.is_str(type)){
				state = type;
			}
			if(Game.is_func(cb)){
				cb();
			}
			return Game.store_game_state;
		}

		stored_game_state.fetch = function() {
			return state;
		}
		return stored_game_state;
	}());

	let namespace = function (string) {
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
	
	Game.is_str = function (obj) {
		return toString.call(obj) === "[object String]";
	}

	Game.is_bool = function (obj) {
		return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
	}

	Game.is_array = function (arr) {
		return toString.call(arr) === "[object Array]";
	}

	Game.is_dict = function (obj) {
		return toString.call(obj) === "[object Object]";
	};

	Game.is_func = function (obj) {
		return typeof obj == "function" || false;
	}

	Game.extend = function(context, obj){
		let astr = "[object Array]";
		for(let key in obj){
			if(obj.hasOwnProperty(key)){
				if(typeof obj[key] === "object"){
					let tmp;
					tmp = toString.call(obj[key] === astr)? []: {};
					tmp = obj[key];
					Game.extend(context, tmp);
				}else{
					if(!context.hasOwnProperty(key)){
						throw new Error("ReferenceError: key proparty is not defined)");
					}
					context[key] = obj[key];
				}
			}
		}
		return context;
	}

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

	Game.loading_and_progress = function (col, mili, cb) {
		let imgs_length = col.images.length;
		let xml_length = col.xmls.length;
		let time = mili || 0;

		if(!Game.is_func(cb)){
			cb = null;
		}

		let loaded = progress_throttle(time, imgs_length + xml_length, cb);
		
		loaded();
		
		let assets = {
			images: {},
			csv: {},
			xhr: {},
			fetch_images: function () {
				return assets.images;
			},
			fetch_csvs: function () {
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
				if(i !== length - 1){
					one_arr[i] = one_arr[i].substring(0, one_arr[i].length - 1);
				}
				two_arr[i] = one_arr[i].split(",");
				for(let j = 0, len = two_arr[i].length; j < len; j += 1){
					// tiledのcsvは(0, 0)が1として扱われる
					two_arr[i][j] = two_arr[i][j] - 1;
				}
			}
			return two_arr;
		}

		return assets;
	};

	let store_progress = function (len) {
		let i = 0;

		return function () {
			let parcent = Math.floor((i / len) * 100);
			i = i + 1;
			return parcent;
		}
	};

	let progress_throttle = function (mill, len, cb) {
		let call_times = 0;
		let last_date = new Date().getTime();
		// ロード時間の最小値
		let load_min_time = 300;
		let interval = 0;
		let fetch_progress = store_progress(len);

		interval = Math.max(mill, load_min_time) / len;

		return progress_throttle = function (context) {
			if(context != null && context !== false){
				Game.assets[context] = this;
			}
			let now = new Date().getTime();
			call_times += 1;
			if(last_date + interval <= now){
				while(call_times >= 1){
					let parcent = fetch_progress();
					last_date = now;
					call_times -= 1;

					render_fore("progress",parcent);

					// 全て読み込み終えたら描画後にcallback関数を実行する
					if(parcent === 100 && cb != null){
						cb();
					}
					break;
				}
			}else{
				let diff = now - (last_date + interval);
				setTimeout(progress_throttle, diff);
			}
		}
	};

	Game.create_point = function (w, h, p_w, p_h) {
	    let ix = 0;
	    let iy = 0;
	    let point = [];
	    let width = w - p_w;
	    let height = h - p_h;

	    for(;iy <= height ; iy += p_h){
	        ix = 0;
	        for(; ix <= width; ix += p_w){
	            point.push({
	                x: ix,
	                y: iy
	            }) 
	        }
	    }
	    return point;
	}

	Game.store_canvases = function (dict) {
		namespace("Game.canvas");
		let canvas = Game.canvas = [];

		if(Game.is_dict(dict)){
			for(let key in dict) {
				canvas.push(dict[key]);
			}
		}
	}

	Game.store_contexts = function (dict) {
		namespace("Game.contexts");
		let contexts = Game.contexts = [];

		if(Game.is_dict(dict)){
			for(let key in dict) {
				contexts.push(dict[key]);
			}
		}
	}

	Game.render_back = function (context) {
		let canvas = Game.canvas[0];
		let ctx = Game.contexts[0];
		let args = slice.call(arguments, 1);
		
		if(context == null){
			throw new Error("TypeError: context is not defined, Game.js");
		}

		if(context === "playing"){
			let csv = args[1];
			let img_point = args[2];
			let canvas_point = args[3];
			let index = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			for(let i = 0, len = csv.length; i < len; i += 1){
				for(let j = 0, _len = csv[i].length; j < _len; j += 1){
					render(img_point[csv[i][j]], canvas_point[index],16, 16);
					index = index + 1;
				}
			}
		}
		function render(img_p, can_p, w, h) {
			ctx.drawImage(args[0], img_p.x, img_p.y, w, h, can_p.x, can_p.y, w, h);
		}
	}

	let render_middle = function (context) {
		let canvas = Game.canvas[1];
		let ctx = Game.contexts[1];
		let args = slice.call(arguments, 1);
	}

	let render_fore = function (context) {
		let canvas = Game.canvas[2];
		let ctx = Game.contexts[2];
		let args = slice.call(arguments, 1);
		if(context === "progress") {
			Game.store_game_state("loading");

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
				render_fore("title_menu");
			}
		}else if(context === "title_menu") {
			Game.store_game_state("title_menu");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}else if(context === "playing") {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	Game.click = function (e) {
	}

	Game.create_title_menu = function (title, w, h, setting){
		let state = true;

		if(title == null) {
			throw new Error("TypeError: title is not defined, Game.js");
		}
		if(arguments.length < 3){
			throw new Error("TypeError: 3 arguments required, Game.js");
		}

		let ui = document.getElementById("ui");
		ui.style.width = w + "px";
		ui.style.height = h + "px";


		let h1 = document.querySelector(".title_menu__header > h1");
		h1.textContent = title;

		if(setting == null){
			setting = false;
		}

		if(Game.is_bool(setting) && setting === false){
			let parent_elem = document.querySelector(".title_menu");
			let child_elem = document.querySelector(".title_menu__setting");
			parent_elem.removeChild(child_elem);
			state = false;
		}
		return function () {
			return state;
		};
	}
	Game.dom_atr_toggle = function (atr, context) {
		if(arguments.length <= 1) {
			throw new Error("TypeError: 2 arguments required, Game.js");
		}
		let length = Game.dom_atr_toggle.length;
		if(!Game.is_str(context)){
			context = null;
			length -= 1;
		}

		let args = slice.call(arguments, length);

		if(context === "class" || context == null) {
			for(let i = 0, length = args.length; i < length; i += 1){

			}
		}else if(context === "data") {
			for(let i = 0, length = args.length; i < length; i += 1){
				let is_atr = args[i].getAttribute(atr);
				if(is_atr != null){
					args[i].removeAttribute(atr);
				}else{
					args[i].setAttribute(atr, "currnet");
				}
			}
		}
	}
	Game.change_state_by_dom = function (dom, atr) {
		let state;
		if(atr){
			let currnet = dom.querySelector("[" + atr + "='currnet']");
			state = currnet.getAttribute("data-state");
		}else{
			state = dom.getAttribute("data-state");
		}
		return Game.store_game_state(state).fetch();
	}
	Game.player = class {
		constructor(img, x, y) {
			this.img = img;
			this.x = x;
			this.y = y;	
			this.speed;
			this.size;
		}
		set(obj) {
			if(Game.is_dict(obj)){
				Game.extend(this, obj);
			}
		}
	}
})();