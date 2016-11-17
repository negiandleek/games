(function () {
	let root = self;

	let Game = {};
	root.Game = Game;

	// init variable
	Game.assets = {};
	Game.sprt = (function () {
		let sprt = {};

		// deviceの種類
		let device_type = [ "desktop", "tablet", "mobile","other"];
		let user_agent = (navigator.userAgent || navigator.vendor || window.opera || "").toLowerCase()

		function detecter(agent) {
			if(agent.indexOf("iphone") > -1){
				return device_tpe[2];
			}else if(agent.indexOf("ipad") > -1){
				return device_type[1];
			}else if((agent.indexOf('android') > -1) && (agent.indexOf('mobile') > -1)){
				return device_type[2];
			}else if((agent.indexOf('android') > -1) && (agent.indexOf('mobile') == -1)){
				return device_type[1];
			}else if((agent.indexOf('chrome') > -1) && (agent.indexOf('edge') == -1)){
				return device_type[0];
			}else if(agent.indexOf('firefox') > -1){
				return device_type[0];
			}else if((agent.indexOf('safari') > -1) && (agent.indexOf('chrome') == -1)){
				return device_type[0];
			}else if(agent.indexOf('opera') > -1){
				return device_type[0];
			}else{
				return device_type[3];
			}
		}
		sprt.device = detecter(user_agent);
		// canvasが対応しているか
		let elem = document.createElement("canvas");
		sprt.canvas = !!(elem.getContext && elem.getContext("2d"));

		// タッチイベントが対応しているか
		let sprt_touch = ("ontouchend" in window) || window.DocumentTouch && document instanceof DocumentTouch;
		
		sprt.TOUCH_START = sprt_touch ? "touchstart": "mousedown";
		sprt.TOUCH_MOVE = sprt_touch ? "touchmove": "mousemove";
		sprt.TOUCH_END = sprt_touch ? "touchend": "mouseup";

		sprt.game_events = {
			touch_start: sprt.TOUCH_START,
			touch_move: sprt.TOUCH_MOVE,
			touch_end: sprt.TOUCH_END,
			key: "keybord"
		};

		return sprt;
	})();

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

	// Game.merge_instance = function() {
	// 	let m = {};
	// 	let args = arguments;
	// 	for(let i = 0, len = args.length; i < len; i += 1){
	// 		let t = {};
	// 		let own = {}
	// 		let class_name;
	// 		if(!Game.is_dict(args[i])){
	// 			throw new Error("TypeError: arguments is not object, Game.js");
	// 			break;
	// 		}
	// 		// console.log(args[i]);
	// 		for(let key in args[i]){
	// 			if(args[i].hasOwnProperty(key)){
	// 				if(key !== "__listners" && key !== "img"){
	// 					t[key] = args[i][key];
	// 				}
	// 			}
	// 		}
	// 		class_name = args[0].constructor.name.toLowerCase();
	// 		console.log(class_name);
	// 		own[class_name] = [];
	// 		own[class_name].push(t);
	// 		m = Object.assign(m, own);
	// 	}
	// 	return m;
	// }

	Game.detect_diff = function (previous, now){
		let r = [];

		for(let key in now){
			if(!previous[key]){
				r.push(key);
				continue;
			}else{
				let len = now[key].length;
				// 配列の長さが違う
				if(now[key].length !== previous[key].length){
					r.push(key);
					continue;
				}else{
					let pl = previous[key].length;
					for(let i = 0; i < pl; i += 1){
						let jp = JSON.stringify(previous[key][i]);
						let jn = JSON.stringify(now[key][i]);
						console.log(jp === jn);
						if(jp !== jn){
							r.push(key);
							console.log(r);
							break;
						}
					}
				}
			}
		}

		for(let key in previous){
			if(!now[key]){
				r.push(key);
			}
		}

		return r;
	}


	Game.Event = class {
		constructor(type) {
			this.type = type || null;
			this.target = null;
			this.x;
			this.y;
		}
	}
	
	// event type list
	Game.Event.ENTER_FRAME = "enter_frame";
	Game.Event.CHANGE_SCENE = "change_scene";
	Game.Event.TOUCH_START = "touch_start";
	Game.Event.TOUCH_MOVE = "touch_move";
	Game.Event.TOUCH_END = "touch_end";
	Game.Event.KEY_DOWN = "key_down";
	Game.Event.KEY_UP = "key_up";

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
			let ref = this.__listners[e.type];
			e.target = this;
			// Coreクラスのイベントをdispatchする
			if(ref != null){
				for(let i = 0, len = ref.length; i < len; i += 1){
					ref[i].listner.call(this, e);
				}
			}
		}
	}

	Game.Render = class extends Game.EventTarget{
		constructor(w, h){
			super();
			this.w = w;
			this.h = h;
			this.canvas = [];
			this.context = [];
			this.root_node;
			this.cache_middle;
			this.cache_back;
		}
		init(){
			this.w = w;
			this.h = h;
			this.canvas = [];
			this.context = [];
			this.root_node;
		}
		store_dom() {
			let root_node = this.root_node = document.getElementById("interface");
			let elems_tag = document.getElementsByTagName("canvas");
			root_node.style.width = this.w + "px";
			root_node.style.height = this.h + "px";

			for(let i = 0, length = elems_tag.length; i < length; i += 1){
				let id_name = elems_tag[i].id;
				this.store_canvas(id_name);
			}
		}
		store_canvas(name) {
			let len = this.canvas.push(document.getElementById(name)) - 1;
			this.canvas[len].width = this.w;
			this.canvas[len].height = this.h;
			this.context.push(this.canvas[len].getContext("2d"));
		}
		static diff_back(object) {
			if(!this.cache_back){
				let t = {};
				let r = [];
				this.cache_back = object;
				for(let key in object){
					r.push(key);
				}
				return r;
			}else{
				return Game.detect_diff(this.cache_back, object);
			}
		}
		render_back() {
			let canvas = this.canvas[0];
			let ctx = this.context[0];
			let gmo = this.game_object
			// FIX: 差分計算
			// let diff_key = this.constructor.diff_back(gmo.entity);
			// let len = diff_key.length;
			if(this.state === "playing"){
				// for(let i = 0; i < len; i += 1){
				let id = gmo.filed_id;
				let f =  gmo.entity.filed[id];
				// if(diff_key[i] === "filed" && f){
				let index = 0;
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for(let i = 0, len = f.csv.length; i < len; i += 1){
					for(let j = 0, _len = f.csv[i].length; j < _len; j += 1){
						render(f.img, f.img_pt[f.csv[i][j]], f.view_pt[index],16, 16);
						index = index + 1;
					}
				}
				// }
				// }
			}

			function render(img, img_pt, view_pt, w, h) {
				ctx.drawImage(img, img_pt.x, img_pt.y, w, h, view_pt.x, view_pt.y, w, h);
			}
		}
		static diff_middle(object) {
			if(!this.cache_middle){
				let t = {};
				let r = [];
				this.cache_middle = object;
				for(let key in object){
					r.push(key);
				}
				return r;
			}else{
				return Game.detect_diff(this.cache_middle, object);
			}
		}
		render_middle() {
			// FIX: 差分計算
			let canvas = this.canvas[1];
			let ctx = this.context[1];
			// let entity = this.game_object.entity
			let gmo = this.game_object;
			if(this.state === "playing"){
				// let diff_key = this.constructor.diff_middle(entity);
				// let len = diff_key.length;
				// if(len !== 0){
				// for(let i = 0; i < len; i += 1){
				// if(diff_key[i] === "player" && entity.player){
				let p = gmo.entity.player;
				let id = gmo.player_id;
				// for(let j = 0,len = p.length; j < len; j += 1){
				ctx.clearRect(0, 0, 512, 512);
				ctx.drawImage(p[id].img, p[id].sprite_x, p[id].sprite_y, p[id].sprite_w, p[id].sprite_h, p[id].x, p[id].y, 32, 32);
				// 			}
				// 		}
				// 	}
				// }
			}
		}
		render_fore () {
			let canvas = this.canvas[2];
			let ctx = this.context[2];
			// FIX:argsをGame.Game.progress_rateで管理する
			let args = slice.call(arguments, 0);
			if(this.state === "loading") {
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
					this.store_game_state("playing");
					this.render_fore()
				}

			}else if(this.state === "playing") {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	}

	Game.Core = class extends Game.Render{
		constructor(w, h) {
			super(w, h);
			this.frame = 0;
			this.previous = [];
			this.last = 0;
			this.fps = 1000 / 60;
			this.delayed = 0;
			this.animation = null;
			this.game_object = [];
			this.scene_object = [];
			this.state = "init";
			this.last_touch_target
			this.running = false;
			this.input;
			// document.addEventListener(Game.sprt.TOUCH_START, (e) => {
			// 	this.last_touch_target = e.target;
			// })
		}
		setup() {
			let events = Object.assign({},Game.sprt.game_events);
			let len = arguments.length;
			super.store_dom();

			if(!this.canvas[2]){
				throw new Error("ReferenceError: canvas[2] is not defined, Game.js");
			}
			if(len !== 0){
				for(let i = 0; i < len; i += 1){
					for(let key in events){
						if(key === arguments[i]){
							delete events[key];
						}
					}
				}
			}
			
			for(let key in events){
				if(key === "touch_start"){
					this.canvas[2].addEventListener(events[key], (e) => {
						this.dispatch_event(new Game.Event("touch_start"));
						e.preventDefault();
						e.stopPropagation();
					});
				}else if(key === "touch_move"){
					this.canvas[2].addEventListener(events[key], (e) => {
						this.dispatch_event(new Game.Event("touch_move"));
						e.preventDefault();
						e.stopPropagation();
					});
				}else if(key === "touch_end"){
					this.canvas[2].addEventListener(events[key], (e) => {
						this.dispatch_event(new Game.Event("touch_end"));
						e.preventDefault();
						e.stopPropagation();
					});
				}else if(key === "key"){
					document.addEventListener("keydown", (e) => {
						if(!this.running) {
							return;
						}
						this.input = e.keyCode;
						this.dispatch_event(new Game.Event("key_down"));
						e.preventDefault();
						e.stopPropagation();
					});

					document.addEventListener("keyup", (e) => {
						if(!this.running){
							return;
						}
						this.input = null;
						this.dispatch_event(new Game.Event("key_up"));
						e.preventDefault();
						e.stopPropagation();
					});
				}
			}
		}
		// init, title_menu,loading, paly, gameover, continue_menu, setting
		store_game_state(type) {
			// coreのstateが変わったらchange_sceneイベントを発行する
			if(Game.is_str(type) && this.state !== type){
				this.state = type;
				let e = new Game.Event("change_scene");
				let things = this.game_object;
				let scenes = this.scene_object;

				this.dispatch_event(e);

				for(let i = 0, len = things.length; i < len; i += 1){
					things[i].dispatch_event(e);
					// this.next_frame(things[i]);
				}

				for(let i = 0, len = scenes.length; i < len; i += 1){
					scenes[i].dispatch_event(e);
					// this.next_fore_frame(scenes[i]);
				}
			
				if(type === "playing"){
					this.running = true;
				}else{
					this.running = false;
				}
			}
		}
		fetch_state() {
			return this.state;
		}
		init() {
			this.state = this.store_game_state("init");
			this.frame = 0;
			this.last = new Date().getTime;
			this.game_object = null;
			this.scene_object = [];
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
			this.main();
		}
		stop() {
			cansel_animation_frame(this.animation);
			this.animation
		}
		rewind() {
			this.frame = 0;
			this.last = new Date().getTime;
			this.game_object = null;
		}
		add_game(obj) {
			if(Game.is_dict(obj) && obj !== this.game_object){
				this.game_object = obj;
			}
		}
		// TODO: add_gameと同じようにする
		add_scene(obj){
			if(Game.is_dict(obj) && obj !== this.scene_object){
				this.scene_object.push(obj);
			}
		}
		main(time){
			let e = new Game.Event("enter_frame");
			let entity = this.game_object.entity;
			this.frame = this.frame + 1;
			
			for(let key in entity){
				for(let i = 0, len = entity[key].length; i < len; i += 1){
					entity[key][i].dispatch_event(e);
					this.next_frame();
				}
			}
			this.animation = request_animation_frame(this.main.bind(this));
		}
		next_frame() {
			this.render_back();
			this.render_middle();
			this.render_fore();
		}
	}

	Game.Input = class extends Game.EventTarget{
		constructor(){
			super();
			this.input;
			this._binds = {}
		}
		bind(key_c, name) {

		}
		unbind(key_c){

		}
	}

	// 使いまわすシーンを作成(タイトルメニュー、コンテニュー画面?等)
	Game.Scene = class extends Game.EventTarget{
		constructor(type, dom){
			super();
			this.entity = dom
			this.type = type;
		}
		// add(dom){
		// 	//TODO: domかどうか調べる
		// 	this.entity.push(obj);
		// }
	}

	// 現在のゲームが使用するオブジェクトを管理する
	// 例えばステージ1-2
	// TODO:preload, load, progress追加する
	Game.Game = class extends Game.EventTarget{
		constructor(){
			super()
			this.filed_id = 0;
			this.player_id = 0;
			this.item_id;
			this.level;
			this.source = [];
			this.entity = {
				player: [],
				enemy: [],
				item: [],
				filed: []
			}
			// enemyを管理するオブジェクト
			this.enemy_manager = new Game.Enemy_Manager();
		}
		// 現在のゲームが管理するものを追加する
		add_player(obj) {
			if(Game.is_dict(obj)){
				if(obj instanceof Game.Player){
					this.entity.player.push(obj);
				}
			}
		}
		add_filed(obj) {
			if(Game.is_dict(obj)){
				if(obj instanceof Game.Filed){
					this.entity.filed.push(obj);
				}
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

			let assets = this.source
			assets.images = {};
			assets.csves = {};
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

					assets.csves[name] = parse_xml_to_csv(name, csv_str);
				}

				delete assets.xhr.prop;
			}

			let parse_xml_to_csv = function (name, text) {
				assets.csves[name] = [];
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

	Game.Filed = class Filed extends Game.EventTarget{
		constructor(w, h, sw, sh) {
			super();
			this.img;
			this.img_pt;
			this.csv;
			this.view_pt;
			this.width = w;
			this.height = h
			this.sprite_w = sw || 16;
			this.sprite_h = sh || 16;
			this.collision;
		}
		is_hit(x, y, multi_x, multi_y){
			let pos_list = [];
			for(let i = 0; i < multi_y; i += 1){
				for(let j = 0; j < multi_x; j += 1){
					let p = {}
					p.x = (x + (j * this.sprite_w)) / this.sprite_w;
					p.y = (y + (i * this.sprite_h)) / this.sprite_h;
					pos_list.push(p);
				}
			}
			for(let i = 0, len = pos_list.length; i < len; i += 1){
				let p = pos_list[i];
				// 0以外すべて障害があるとみなす
				// csvを生成する時に、csv pointをずらしているのを元に戻す
				if(this.collision[p.y][p.x] + 1){
					return true;
				};
			}
			return false;
		}
	}

	Game.Player = class Player extends Game.EventTarget{ 
		constructor(w, h, constant) {
			super();
			// スプライトを変更する時などに用いる
			this.change = false;
			this.img;
			this.life;
			this.x = 16;
			this.y = 16;
			// TODO:タイルのほうがわかりやすい
			this.sprite_w = w || 16;
			this.sprite_h = h || 16;
			this.sprite_x = 0;
			this.sprite_y = 0;
			if(constant == null || constant == "single"){
				this.sprite_type = "single";
			}else if(constant === "multiple"){
				this.sprite_type = constant;
			}else{
				throw new Error("TypeError: constant is not type");
			}
		}
		move_by(x, y) {
			this.x = this.x + x;
			this.y = this.y + y
		}
		// なくても問題ない
		generate_view_pt(_direction){
			// {up: [{x: 16, y: 32},{x: 32, y: 48}],{down: }
			let view_pt = {
				up: [],
				right: [],
				down: [],
				left: []
			};

			let x = this.sprite_w;
			let y = this.sprite_h;

			let direction = _direction || ["down", "left", "right", "up"];

			if(Game.is_array(direction)){
				for(let i = 0, len = direction.length; i < len; i += 1){
					if(view_pt[direction[i]] == null){
						throw new Error("TypeError: arguments is not type")
					}
					for(let j = 0, max_x = this.img.width / x; j < max_x; j += 1){
						let position = {};
						position.y = i * y;
						position.x = j * x;
						view_pt[direction[i]][j] = position;
					}
				}

				return view_pt;
			}
		}
	}

	let instance_enemy_type = null;
	Game.Enemy_Type = class EnemyType extends Game.EventTarget{
		constructor(){
			super();
			this.enemy_type = {};
			if(!instance_enemy_type){
				instance_enemy_type = this;
			}
			return instance_enemy_type;
		}
		add_enemy_type(obj) {
			if(Game.is_dict(obj)){
				this.enemy_type[obj.name] = obj;
			}else if(Game.is_array(obj)){

			}
		}
		remove_enemy_type(name) {
			if(Game.is_str(name)){
				delete this.enemy_type[name]
			}
		}
	}

	Game.Enemy_Manager = class MangeEnemy extends Game.Enemy_Type{
		constructor() {
			super();
			this.max_num = 0;
			this.num = 0;
			this.enemys = [];
		}
		add_enemy() {
			let num = this.max_num - this.num;
			for(let i = 0; i < num; i += 1){
				if(!this.enemys[i]){
					this.enemys[i] = new Game.Enemy("zombie1");
				}
			}
		}
		remove_enemy() {

		}
	}

	Game.Enemy = class Enemy extends Game.Enemy_Type{
		constructor(type) {
			super();
			console.log(this.enemy_type);
			// Game.extend(this.enemy_type.type)
		}
		move() {

		}
	}

	Game.Item = class Item extends Game.EventTarget{
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
	}
})();