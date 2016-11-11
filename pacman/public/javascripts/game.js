(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	// init variable
	Game.assets = {};
	Game.fps;

	let Obj_proto = Object.prototype;
	let Arr_proto = Array.prototype;
	let Func_proto = Function.prototype;
	let toString = Obj_proto.toString;
	let slice = Arr_proto.slice;
	let call = Func_proto.call;
	let request_animation_frame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	let cansel_animation_frame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	let namespace = function (string) {
		if(!Game.is_str(string)){
			throw new Error("TypeError: arguments type not string");
		}
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

	Game.sprt = (function () {
		let sprt = {};
		
		// canvasが対応しているか
		let elem = document.createElement("canvas");
		sprt.canvas = !!(elem.getContext && elem.getContext("2d"));

		// タッチイベントが対応しているか
		let sprt_touch = ("ontouchend" in window) || window.DocumentTouch && document instanceof DocumentTouch;
		
		sprt.TOUCH_START = sprt_touch ? "touchstart": "mousedown";
		sprt.TOUCH_MOVE = sprt_touch ? "touchmove": "mousemove";
		sprt.TOUCH_END = sprt_touch ? "touchend": "mouseup";

		return sprt;
	})();

	Game.now = Date.now || function () {
		return new Date().getTime();
	}
	
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

	Game.is_num = function (obj) {
		return toString.call(obj) === "[object Number]";
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

	let store_progress = function (len) {
		let i = 0;

		return function () {
			let parcent = Math.floor((i / len) * 100);
			i = i + 1;
			return parcent;
		}
	};

	Game.throttle_repeat = function (func, wait){
		let result, args, context;
		let timeout = [];
		let remaining = 0;
	    let total = 0;
	    let previous = 0;
	    let reset;
	    
		let throttled = function() {
	    	let now = Date.now();
	    	let cb;
	    	context = this;
	    	args = Array.prototype.slice.call(arguments);
	    	for(let i = 0, len = args.length; i < len; i += 1){
	    	  if(typeof args[i] === "function"){
	    	    cb = Array.prototype.splice.call(args, i)[0];
	    	  }
	    	}
	    	function reflesh(){
	    	    previous = null;
	    	    total = 0;
	    	}
	      
	      	function later(param) {
	      	    param = param ? param: args;
	        		timeout.shift();
	        		result = func.apply(context, param);
	        		if(cb){
	        		  cb(result)
	        		}
	    	}
	        
	    	remaining = wait - (now - previous);
	    	if(!previous && remaining < wait){
	    	    previous = now;
	    	    result = func.apply(context, args);
	    	    if(cb){
	      		  cb(result)
	      		}
	    	}else{
	    	    total += remaining
	    	    let timer = setTimeout(later.bind(context, args), total);
	    	    timeout.push(timer);
	    	    previous = now;
	    	    if(reset){
	    		    clearTimeout(reset);
	    		  }
	    	  	reset = setTimeout(reflesh, total + wait);
	    	}
	    	return result;
	    }
		return throttled;
	}

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

	// TODO:coreに埋め込む
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
	Game.atr_toggle = function (atr, dom, context) {
		if(arguments.length <= 0) {
			throw new Error("TypeError: 1 arguments required, Game.js");
		}

		let index = 0;
		let next = 0;
		let length = dom.length;

		for(let i = 0; i < length; i += 1){
			let is_atr = dom[i].getAttribute(atr);
			if(is_atr != null){
				index = i;
			}
		}

		if(context === "up"){
			next = index - 1;
			if(next <= 1){
				return;
			}
		}else if(context === "down"){
			next = index + 1;
			if(next >= length){
				return;
			}
		}
		
		dom[index].removeAttribute(atr);
		dom[next].setAttribute(atr, "currnet");
	}


	Game.Event = class {
		constructor(type) {
			this.type = type;
			this.target = null;
			this.x;
			this.y;
		}
		factory(type) {

		}
	}
	
	Game.Event.ENTER_FRAME = "enter_frame";
	Game.Event.CHANGE_SCENE = "change_scene";

	Game.EventTarget = class extends Game.Event{
		constructor () {
			super();
			this.__listners = {};
		}
		on(){
			this.add_event_listner.apply(this, arguments);
		}
		add_event_listner (type, listner) {
			let ref = this.__listners[type];
			if(ref == null){
				this.__listners[type] = [{
					name: listner.name || "nameless",
					listner: listner
				}];
			}else if(ref.indexOf(listners) === -1){
				let handler = {
					name: listner.name || "nameless",
					listner: listner
				}
				ref.unshift(handler);
			}
		}
		remove_event_listner(type, listner){
			let ref = this.__listners[type]
			if(ref != null){
				if(listner == null){
					for(let i = 0, len = ref.length; i < len; i += 1){
						if(ref[i].name === "nameless"){
							ref.splice(i, 1);
						}
					}
				}else{
					let i = ref.indexOf(listner);
					if(i !== -1){
						ref.splice(i, 1);
					}
				}
			}
		}
		dispatch_event(e) {
			e.target = this;
			let ref = this.__listners[e.type];
			if(ref != null){
				for(let i = 0, len = ref.length; i < len; i += 1){
					ref[i].listner.apply(this);
				}
			}
		}
	}

	Game.Render = class extends Game.EventTarget{
		constructor(w, h){
			super();
			this.w = w;
			this.h = h;
			this.canvas = {};
			this.context = {};
			this.node;
		}
		init(){
			this.w = w;
			this.h = h;
			this.canvas = {};
			this.context = {};
			this.node;
		}
		dom_loaded() {
			let node = this.node = document.getElementById("interface");
			let elems_tag = document.getElementsByTagName("canvas");

			node.style.width = this.w + "px";
			node.style.height = this.h + "px";

			for(let i = 0, length = elems_tag.length; i < length; i += 1){
				let id_name = elems_tag[i].id;
				this.store_canvas(id_name);
			}
		}
		store_canvas(name) {
			this.canvas[name] = document.getElementById(name);
			this.canvas[name].width = this.w;
			this.canvas[name].height = this.h;
			this.context[name] = this.canvas[name].getContext("2d");
		}
		store_contexts(dict) {
			if(Game.is_dict(dict)){
				for(let key in dict) {
					this.context.push(dict[key]);
				}
			}
		}
		render_middle() {
			let canvas = this.canvas["middle"];
			let ctx = this.context["middle"];
			let args = slice.call(arguments, 1);
			if(this instanceof Game.Player){
				ctx.drawImage(this.img, 0, 0, 32, 32, this.x, this.y, 32, 32);
			}
		}
		render_fore (type) {
			let canvas = this.canvas.fore;
			let ctx = this.context.fore;
			let args = slice.call(arguments, 1);
			if(type === "loading") {
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
					this.store_game_state("palying");
					this.render_fore("playing")
				}
			}else if(type === "playing") {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	}

	Game.Core = class extends Game.Render{
		constructor(w, h) {
			super(w, h);
			this.frame = 0;
			// this.things = [];
			this.previous = [];
			this.last = 0;
			this.fps = 1000 / 60;
			this.delayed = 0;
			this.animation = null;
			this.current_game = [];
			this.root_scene = [];
			this.state = "init";
		}
		// init, title_menu,loading, playing, gameover, continue_menu, setting
		store_game_state(type) {
			// coreのstateが変わったらchange_sceneイベントを発行する
			if(Game.is_str(type) && this.state !== type){
				this.state = type;
				let e = new Game.Event("change_scene");
				let things = this.current_game;
				let scenes = this.root_scene;

				for(let i = 0, len = things.length; i < len; i += 1){
					things[i].dispatch_event(e);
					// this.next_frame(things[i]);
				}

				for(let i = 0, len = scenes.length; i < len; i += 1){
					scenes[i].dispatch_event(e);
					// this.next_fore_frame(scenes[i]);
				}
			}
			return this;
		}
		fetch_state() {
			return this.state;
		}
		init() {
			this.state = this.store_game_state("init");
			this.frame = 0;
			this.last = new Date().getTime;
			this.current_game = null;
			this.root_scene = [];
			super.init();
		}
		start() {
			let now = new Date().getTime;
			let diff = now - this.last;
			
			if(this.animation != null){
				return;
			}
			
			if(diff > 60 && now !== 0){
				this.delayed = diff;
			}
			this.last = now;
			this.frame = this.frame + 1;
			this.main();
		}
		stop() {
			cansel_animation_frame(this.animation);
			this.animation
		}
		rewind() {
			this.frame = 0;
			this.last = new Date().getTime;
			this.current_game = null;
		}
		add_game(obj) {
			if(Game.is_dict(obj) && obj !== this.current_game){
				this.current_game = obj;
			}
		}
		add_scene(obj){
			if(Game.is_dict(obj) && obj !== this.root_scene){
				this.root_scene.push(obj);
			}
		}
		main(time){
			let e = new Game.Event("enter_frame");
			let things = this.current_game.things;
			for(let i = 0, len = things.length; i < len; i += 1){
				things[i].dispatch_event(e);
				this.next_middle_frame(things[i]);
			}
			this.animation = request_animation_frame(this.main.bind(this));
		}
		next_middle_frame(obj) {
			// TODO:things一つ前と比較（深く）する
			// TODO:constructorによって処理を変える
			if(this.previous !== this.things){
				this.render_middle.call(obj);
			}
			this.previous = this.things;
		}
		// next_fore_frame(obj){
		// 	this.render_fore.call(obj);
		// }
	}

	// 使いまわすシーンを作成(タイトルメニュー、コンテニュー画面?等)
	Game.Scene = class extends Game.EventTarget{
		constructor(type, dom){
			super();
			this.dom = dom
			this.type = type;
		}
	}

	Game.Game = class extends Game.EventTarget{
		constructor(){
			super()
			this.stage;
			this.level;
			this.things = {};
		}
		// 現在のゲームが管理するものを追加する
		add(obj) {
			if(Game.is_dict(obj)){
				this.things.push(obj);
			}
		}
		static loaded_progress(wait, len) {
			let fetch_progress = store_progress(len);
			let t = Game.throttle_repeat(function() {
				return fetch_progress()
			}, wait);

			return t;
		}
		load(col, wait, cb){
			let imgs_len = col.images.length;
			let xml_len = col.xmls.length;

			let loaded = this.constructor.loaded_progress(wait, imgs_len + xml_len);
			loaded(cb);

			let assets = this.things
			assets.images = {};
			assets.csv = {};
			assets.xhr = {};

			// load images
			for(let i = 0; i < imgs_len; i += 1){
				let item = col.images[i];
				
				assets.images[item.name] = new Image();
				assets.images[item.name].src = item.src;
				assets.images[item.name].onload = loaded(cb);
			}

			// load xml;
			for(let i = 0; i < xml_len; i += 1){
				let item = col.xmls[i];

				assets.xhr[item.name] = new XMLHttpRequest();
				assets.xhr[item.name].onload = () => {
					save_csv(assets.xhr[item.name].responseXML, item.name)
					loaded(cb)
				};
				assets.xhr[item.name].open("get", item.src, true);
				assets.xhr[item.name].send();
			}

			// extract csv to xml;
			function save_csv(text, prop) {
				let elem_layer = text.querySelectorAll("layer");

				for(let i = 0, length = elem_layer.length; i < length; i += 1){
					let elem = elem_layer[i];
					let name = elem.attributes.name.nodeValue;
					let csv_str = elem.childNodes[1].innerHTML;

					assets.csv[name] = parse_xml_to_csv(name, csv_str);
				}

				delete assets.xhr.prop;
			}

			let parse_xml_to_csv = function (name, text) {
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
		}
	}

	Game.Player = class extends Game.Game{ 
		constructor(width, height, constant) {
			super();
			this.img;
			this.life;
			this.speed;
			this.size;
			this.x;
			this.y;
			if(constant == null || constant == "single"){
				this.sprite_type = "single";
			}else if(constant === "multiple"){
				this.sprite_type = constant;
			}else{
				throw new Error("TypeError: constant is not type");
			}
		}
		set(obj) {
			if(Game.is_dict(obj)){
				Game.extend(this, obj);
			}
		}
	}

	Game.Enemy = class extends Game.Game{
		constructor(width, height, constant) {
			super();
			this.img;
			this.life;
			this.speed;
			this.size;
			this.x;
			this.y;
			if(constant == null || constant == "single"){
				this.sprite_type = "single";
			}else if(constant === "multiple"){
				this.sprite_type = constant;
			}else{
				throw new Error("TypeError: constant is not type");
			}
		}
		set(obj) {
			if(Game.is_dict(obj)){
				Game.extend(this, obj);
			}
		}
	}

	Game.Item = class extends Game.Game{
		constructor(width, height) {
			super();
			this.img;
			if(constant == null || constant == "single"){
				this.sprite_type = "single";
			}else if(constant === "multiple"){
				this.sprite_type = constant;
			}else{
				throw new Error("TypeError: constant is not type");
			}
		}
		set(obj) {
			if(Game.is_dict(obj)){
				Game.extend(this, obj);
			}
		}
	}
})();