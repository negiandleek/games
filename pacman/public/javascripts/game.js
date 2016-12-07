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

	let keys = Object.keys; 
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

	Game.conversion_time = function (num, zero) {
		let h = Math.floor(num / (60 * 60 * 1000));
		num = num - h * 60 * 60 * 1000;
		let m = Math.floor(num / (60  * 1000));
		num = num - m * 60 * 1000;
		let s = Math.floor(num / 1000);

		if(zero){
			h = ("0" + h).slice(-2);
			m = ("0" + m).slice(-2);
			s = ("0" + s).slice(-2);
		}

		return{h, m, s}
	}

	Game.extend = function(destination, source, instead){
		let astr = "[object Array]";
		let toStr = Object.prototype.toString;
		for(let i in source){
			if(source.hasOwnProperty(i)){
				if(source[i] instanceof HTMLImageElement){
					if(!destination.hasOwnProperty(i) && !instead){
						throw new Error("ReferenceError: proparty is not defined, Game.js");
					}
					destination[i] = source[i];
				}else if(typeof source[i] === "object"){
		 	 		destination[i] = (toStr.call(source[i])) == astr ? []: {}
		  			Game.extend(destination[i], source[i], instead)
				}else{
					if(!destination.hasOwnProperty(i) && !instead){
						throw new Error("ReferenceError: proparty is not defined, Game.js");
					}
		  			destination[i] = source[i]
				}
			}
		}
		return destination;
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
	Game.Event.TOUCH_START = "touch_start";
	Game.Event.TOUCH_MOVE = "touch_move";
	Game.Event.TOUCH_END = "touch_end";
	Game.Event.KEY_DOWN = "key_down";
	Game.Event.KEY_UP = "key_up";

	Game.EventTarget = class {
		constructor () {
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
			}else if(ref.indexOf("listners") === -1){
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
			let self;
			if(!e.self){
				e.target = self = this;
			}else{
				e.target = self = e.self;
			}
			delete e.self;
			// Coreクラスのイベントをdispatchする
			if(ref != null){
				for(let i = 0, len = ref.length; i < len; i += 1){
					ref[i].listner.call(self, e);
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
		show_if() {
			this.root_node.style.display = "block";
		}
		hide_if() {
			this.root_node.style.display = "none";
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
			let id = gmo.current_id;
			let f =  gmo.entity.stage[id].field;
			let index = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for(let i = 0, len = f.csv.length; i < len; i += 1){
				for(let j = 0, _len = f.csv[i].length; j < _len; j += 1){
					render(f.img, f.img_pt[f.csv[i][j]], f.view_pt[index],16, 16);
					index = index + 1;
				}
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
			let canvas = this.canvas[1];
			let ctx = this.context[1];
			let gmo = this.game_object;
				ctx.clearRect(0, 0, 512, 512);
				
			// playerに関する描画
			let p = gmo.entity.player;
			let a = [];
			let b = [];
			for(let i = 0, len = p.length; i < len; i += 1){
				let childs = p[i].child;
				a = [];
				a[0] = p[i];
				for(let j = 0, _len = childs.length; j < _len; j += 1){
					a[j + 1] = childs[j];
				}
				b.push(a);
			}


			for(let i = 0, len = b.length; i < len; i += 1){
				for(let j = 0, _len = b[i].length; j < _len; j += 1){
					let tmp = b[i][j];
					ctx.drawImage(tmp.img,
						tmp.sprite_x,tmp.sprite_y, 
						tmp.sprite_w,tmp.sprite_h, 
						tmp.x, tmp.y,
						tmp.sprite_w, tmp.sprite_h
					);
				}
			}

			// player以外の描画
			let id = gmo.current_id;
			let s = gmo.entity.stage[id];
			for(let i = 0, len = s.enemys.length; i < len; i += 1){
				ctx.drawImage(s.enemys[i].type.img, 
					s.enemys[i].tile_x, s.enemys[i].tile_y, s.enemys[i].tile_w, s.enemys[i].tile_h,
					s.enemys[i].x, s.enemys[i].y, s.enemys[i].width, s.enemys[i].height);
			}
		}
		render_fore (cb) {
			let canvas = this.canvas[2];
			let ctx = this.context[2];
			ctx.clearRect(0, 0, canvas.width, canvas.height);
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
			this.last_touch_target
			this.running = false;
			this.elapsed_time = 0;

			// タイトル画面やコンテニュー画面などのout scenesを管理する
			this.current_out_scene = null;
			this.out_scenes = [];

			if(!Game.Core.instance){
				Game.Core.instance = this;
			}

			return Game.Core.instance;
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
		// init() {
		// 	this.frame = 0;
		// 	this.last = new Date().getTime;
		// 	this.game_object = null;
		// 	this.scene_object = [];
		// 	super.init();
		// }
		start() {
			let now = Game.now();
			let diff = now - this.last;

			this.running = true;

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
			this.running = false;
		}
		rewind() {
			this.frame = 0;
			this.last = Game.now();
			this.start();
		}
		add_game(obj) {
			if(Game.is_dict(obj) && obj !== this.game_object){
				this.game_object = obj;
			}
		}
		push_out_scene(dict){
			if(Game.is_dict(dict)){
				if(this.current_out_scene){
					this.current_out_scene.dispatch_event(new Game.Event("exit"));
				}
				this.current_out_scene = dict;
				this.current_out_scene.dispatch_event(new Game.Event("enter"));
				return this.out_scenes.push(dict);
			}
		}
		pop_out_scene() {
			if(!this.current_out_scene){
				return this.current_out_scene;
			}
			this.current_out_scene.dispatch_event(new Game.Event("exit"));
			this.remove_out_scene(this.current_out_scene);
			this.current_out_scene = this.out_scenes[this.out_scenes.length - 1];
			if(this.current_out_scene){
				this.current_out_scene.dispatch_event(new Game.Event("enter"));
			}
		}
		remove_out_scene(dict){
			if(Game.is_dict(dict) && dict instanceof Game.OutScene){
				if(this.currnet_out_scene === dict){
					return this.current_out_scene;
				}else{
					let i = this.out_scenes.indexOf(dict);
					if(i !== -1){
						this.out_scenes.splice(i, 1);
						return this.out_scenes;
					}else{
						return null;
					}
				}
			}
		}
		main(time){
			let e = new Game.Event("enter_frame");
			let entity = this.game_object.entity;
			let id = this.game_object.current_id;
			this.frame = this.frame + 1;
			entity.stage[id].dispatch_event(e);

			let enemys = entity.stage[id].enemys;
			for(let i = 0, len = enemys.length; i < len; i += 1){
				enemys[i].dispatch_event(e);
				this.next_frame();
			}

			let field = entity.stage[id].field;
			field.dispatch_event(e);
			this.next_frame();

			for(let i = 0, len = entity.player.length; i < len; i += 1){
				let player = entity.player[i];
				player.dispatch_event(e);
				for(let j = 0, _len = player.child.length; j < _len; j += 1){
					if(_len){
						// FIX
						player.child[j].dispatch_event(e);
					}
				}
			}

			if(!this.running){
				return false;
			}
			this.elapsed_time = Game.now() - this.last;
			this.animation = request_animation_frame(this.main.bind(this));
		}
		next_frame() {
			this.render_back();
			this.render_middle();
			this.render_fore();
		}
	}
	Game.Core.instance = null;

	Game.Keyboard = class extends Game.EventTarget{
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

	// 使いまわすゲーム外のシーンを作成(タイトルメニュー、コンテニュー画面?等)
	Game.OutScene = class extends Game.EventTarget{
		constructor(type, dom){
			super();
			this.dom = dom
			this.type = type;
		}
		show(){
			this.dom[0].style.display = "block";
		}
		hide(){
			this.dom[0].style.display = "none";
		}
	}
	// ゲーム内のシーンを作成（ステータス、イベントリ）
	Game.Block = class extends Game.EventTarget{
		constructor(type, dom){
			super();
			this.entity = dom
			this.type = type;
		}
	}
	// Game.Blockを一つにまとめて管理するクラス(ステータスとイベントリを表示するメニュー画面)
	Game.InScene = class extends Game.Block{
		constructor(type, dom){
			super();
			this.parent_node = dom;
			this.child_node = [];
			this.type = type;
		}
		add(dom){
			//TODO: domかどうか調べる
			this.child_node.push(dom);
		}
		show(){
			this.parent_node.style.display = "block";
		}
		hide(){
			this.parent_node.style.display = "hide";
		}
	}

	// ゲームが使用する全体のオブジェクトを管理する
	Game.Game = class extends Game.EventTarget{
		constructor(x, y){
			super()
			this.view_pt = {
				x: x || 0,
				y: y || 0
			};
			this.filed_id = 0;
			this.current_id = 0;
			this.source = [];
			// entity.stageオブジェクト一つで現在のゲームのオブジェクトを管理する
			// stage:1-2, dungeon:目覚めの森
			this.entity = {
				scene: [],
				player: [],
				stage: {},
			}
			this.enemy_type = Game.EnemyTypeManage;
			this.root_game_scene = document.getElementById("ui");
		}
		show_ui(){
			this.root_game_scene.style.display = "block";
		}
		hide_ui(){
			this.root_game_scene.style.display = "none";
		}
		// ゲームが管理するものを追加する
		// プレイヤーはステージに影響を受けないので独立させる
		add_player(dict) {
			if(Game.is_dict(dict)){
				if(dict instanceof Game.Player){
					this.entity.player.push(dict);
				}
			}
		}
		remove_player(dict) {}
		// ステージを管理する
		push_stage() {
			let id = Math.random().toString(36).substr(2, 9);
			this.current_id = id;
			this.entity.stage[id] = new Game.Stage();
			return this.entity.stage[id];
		}
		remove_stage(remove_id) {
			if(this.current_id === id){
				return false;
			}
			delete this.entity.stage[id];
			return this.entity.stage;
		}
		current_stage(id) {
			if(this.current_id === id){
				return this.entity.stage[this.current_id];
			}

			this.current_id = id;
			return this.entity.stage[id];
		}
		add_scene(dict){
			if(Game.is_dict(dict)){
				if(dict instanceof Game.InScene){
					this.entity.scene.push(dict);
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

	Game.EnemyManager = class MangeEnemy extends Game.EventTarget{
		constructor(field, stage) {
			super();
			this.max_num = 0;
			this.enemys = [];
			this.field = field;
			this.stage = stage;
			this.map = [];
			this.commands = [];
		}
		generate_position(range_x, range_y, name) {
			let y = Math.floor(Math.random() * range_x / this.field.sprite_w) * this.field.sprite_w;
			let x = Math.floor(Math.random() * range_y / this.field.sprite_h) * this.field.sprite_h;
			let type = Game.EnemyTypeManage.get_type(name).type
			let len = this.enemys.length;
			let multi_x = type.tile_w / this.field.sprite_w;
			let multi_y = type.tile_h / this.field.sprite_h;
			// TODO:playerとの衝突による生成やり直し
			if(len){
				for(let i = 0; i < len; i+=1){
					if(this.enemys[i].x === x && this.enemys[i].y === y){
						return this.generate_position(range_x, range_y, name);
					}
				}
			}
			if(this.field.is_hit(x, y, multi_x, multi_y)){
				return this.generate_position(range_x, range_y, name);
			}
			return {x,y}
		}
		appear_enemy(range_x, range_y, _type) {
			let type = _type || "zombie1";
			let num = this.max_num - this.num;
			let len = this.enemys.length;
			if(len < this.max_num){
				let {x,y} = this.generate_position(range_x, range_y, type);
				this.enemys[len] = new Game.Enemy(type, x, y);
				this.enemys[len].add(this.stage);
				return this.enemys[len];
			}else{
				return false
			}
		}
		disappear_enemy() {

		}
	}

	Game.Enemy = class Enemy extends Game.EnemyManager{
		constructor(type, x, y) {
			super();
			// TODO: this.enemy_class, this.enemy_class.design
			let enemy_class = Game.EnemyTypeManage.get_type(type);
			this.type = enemy_class.type;
			this.enemy_class = enemy_class;
			this.x = x;
			this.y = y;
			this.tile_x = this.type.frame.down[2].x;
			this.tile_y = this.type.frame.down[0].y;
			this.width = this.tile_w = this.type.tile_w;
			this.height = this.tile_h = this.type.tile_h;
			this.frame = 0;
			this.alive = true;
			this.running = true;
			this.display = true;
		}
		move_by(x, y) {
			this.x = this.x + x;
			this.y = this.y + y;
		}
		add(source){
			this.enemy_class.notify_appear_enemy.call(this, source);
		}
	}

	Game.InfruenceMapManger = class InfruenceMapManger extends Game.EventTarget{
		constructor(){
			super();
		}
		dijkstra() {
		    while(true){
		        let process_node = null;
		        let index = {i: 0, j: 0};
		       
		        for(let i=0; i<this.column; i+=1){
		           
		            for(let j=0; j<this.row; j+=1){
		                let node = this.nodes[i][j];
		                
		                if(node.done || node.cost < 0){
		                    continue;
		                }
		                
		                if(!process_node){
		                    process_node = node;
		                    index.i = i;
		                    index.j = j;
		                    continue;
		                }
		                
		                if(node.cost < process_node.cost){
		                    process_node = node;
		                    index.i = i;
		                    index.j = j;
		                }
		                
		            }
		        }
		        
		        if(!process_node){
		            break;
		        }
		        
		        process_node.done = true;
		        
		        let xx = [0, -1, 1, 0];
				let yy = [1, 0, 0, -1];
		        for(let k = 0; k < 4; k += 1){
		            let y = index.i;
		            let x = index.j;
		            
		            if(0 <= y + yy[k] && y + yy[k] < this.row &&
		            	0 <= x + xx[k] && x + xx[k] < this.column){
		                let node = this.nodes[y + yy[k]][x + xx[k]]
		                let cost = process_node.cost + this.nodes[y + yy[k]][x + xx[k]].edge;
		                
		                this.max_cost = Math.max(this.max_cost, cost);

		                if((node.cost < 0) || (node.cost > cost)){
		                    node.cost = cost;
		                    node.previous = {
		                        y: y,
		                        x: x
		                    };
		                }
		            }
		        }
		    }
		    return this.nodes;
		}
		normalization(reverse){
			for(let i = 0; i < this.column; i += 1){
				for(let j = 0; j < this.row; j += 1){
					if(this.nodes[i][j] === -1){
						this.nodes[i][j].cost = 0;
					}
					this.infruence_nodes[i][j] = Math.floor((this.nodes[i][j].cost / this.max_cost) * 100) / 100;
					if(reverse){
						this.infruence_nodes[i][j] = Math.floor((1 - this.infruence_nodes[i][j]) * 100) / 100;
					}
				}
			}
			return this.infruence_nodes;
		}
		generate_threat_degrees(factor, target_nodes){
			if(!target_nodes || target_nodes === this.nodes){
				target_nodes = this.nodes
			}
			for(let i = 0; i < this.column; i += 1){
				for(let j = 0; j < this.row; j += 1){
					this.threat_nodes[i][j] = this.threat_nodes[i][j] + target_nodes[i][j] * factor;
				}
			}
		}
		generate_shortest_root() {
			let target_node = null;
		    let y;
		    let x;
		    let direction;

		    for(let i = 0; i < this.column; i+=1){
		        for(let j = 0; j < this.row; j += 1){
		            let node = this.nodes[i][j];
		            if(!node.target){
		                continue;
		            };
		            y = i;
		            x = j;
		        }
		    }

		    while(1){
		        if(!this.nodes[y][x].previous){
		            break;
		        };
		        		        
		        let xx = [0, 1, -1, 0];
				let yy = [1, 0, 0, -1];

				let previous_y = this.nodes[y][x].previous.y - y;
				let previous_x = this.nodes[y][x].previous.x - x;

				for(let i = 0; i < 4; i += 1) {
					if(previous_y === yy[i] && previous_x === xx[i]){
                        direction = i;
                        break;
                    }
                }
                this.shortest_root.unshift(direction);
		        y = y + yy[direction];
		        x = x + xx[direction];
		    }

		    return this.shortest_root;
		}
	}

	Game.InfruenceMap = class InfruenceMap extends Game.InfruenceMapManger{
		constructor(core, subject, target){
			super();
			this.nodes = [];
			this.infruence_nodes = [];
			this.threat_nodes = [];
			this.column = core.h / 16;
			this.row = core.w / 16;
			this.max_cost = 0;
			this.shortest_root = [];

			for(let i = 0; i < this.column; i += 1){
				this.nodes[i] = [];
				this.infruence_nodes[i] = [];
				this.threat_nodes[i] = [];
				for(let j = 0; j < this.row; j += 1){
					this.nodes[i][j] = new Game.InfruenceMapNode();
					this.infruence_nodes[i][j] = 0;
					this.threat_nodes[i][j] = 0;
				}
			}

			// 初期化
			if(subject && target){
				let sy = Math.floor(subject.y / 16);
				let sx = Math.floor(subject.x / 16);
				let ty = Math.floor(target.y / 16);
				let tx = Math.floor(target.x / 16);
				this.nodes[sy][sx].cost = 0;
				this.nodes[ty][tx].target = true;

				super.dijkstra();
			}
		}
	}

	Game.InfruenceMapNode = class InfruenceMapNode{	
		constructor(){
			this.cost = -1;
			this.edge = 1;
			this.done = false;
			this.previous;
			this.target = false;
		}
	}

	Game.InputEnemyType = class InputEnemyType extends Game.EventTarget{
		constructor(){
			super();
		}
		notify_add_type() {
			let e = new Game.Event("add_enemy_type");
			Game.Core.instance.dispatch_event(e);
		}
		notify_remove_type() {
			let e = new Game.Event("remove_enemy_type");
			Game.Core.instance.dispatch_event(e);
		}
		notify_appear_enemy(source) {
			let e = new Game.Event("appear_enemy");
			e.self = this;
			source.dispatch_event(e);
		}
		notify_disappear_enemy() {
			let e = new Game.Event("disappear_enemy");
			Game.Core.instance.dispatch_event(e);
		}
	} 

	Game.EnemyTypeManage = class EnemyTypeManage extends Game.InputEnemyType{
		constructor(obj){
			super();
			delete obj.name;
			this.type = obj;
		}
		static add_type(obj) {
			if(Game.is_dict(obj)){
				if(!Game.EnemyTypeManage.instance[obj.name]){
					Game.EnemyTypeManage.instance[obj.name] = new Game.EnemyTypeManage(obj);
				}
			}else if(Game.is_array(obj)){
				for(let i = 0, len = obj.length; i < len; i += 1){
					if(!Game.EnemyTypeManage.instance[obj[i][name]]){
						Game.EnemyTypeManage.instance[obj[i][name]] = new Game.EnemyTypeManage(obj);
					}
				}
			}
		}
		static remove_type(name) {
			if(Game.is_str(name)){
				delete Game.EnemyTypeManage.instance[name]
			}
		}
		static get_type(name){
			if(Game.is_str(name)){
				return Game.EnemyTypeManage.instance[name];
			}
		}
	}
	Game.EnemyTypeManage.instance = {};

	Game.Stage = class Stage extends Game.EventTarget{
		constructor(){
			super();
			this.enemys = [];
			this.items = [];
			this.frame = 0;
		}
		add_field(dict) {
			if(Game.is_dict(dict)){
				if(dict instanceof Game.Filed){
					this.field = dict;
					return this.field;
				}
			}
		}
		init_enemy() {
			// enemyのクラスを管理
			if(!this.enemy_manager){
				this.enemy_manager = new Game.EnemyManager(this.field, this);
			}
		}
		appear_enemy(range_x, range_y){
			if(!this.enemy_manager){
				throw("enemyクラスが初期化されていません")
			}
			let enemy = this.enemy_manager.appear_enemy(range_x, range_y);
			if(enemy){
				this.enemys.push(enemy);
			}
		}
	}

	Game.Filed = class Filed extends Game.EventTarget{
		constructor(w, h, sw, sh) {
			super();
			this.frame = 0;
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
			// マス目左上(m * tile_w,  n* tile_h)に合わせる
			let position_x = Math.floor(x / this.sprite_w) * this.sprite_w;
			let position_y = Math.floor(y / this.sprite_h) * this.sprite_h;
			// field csv の2次元配列のインデックスを計算
			for(let i = 0; i < multi_y; i += 1){
				for(let j = 0; j < multi_x; j += 1){
					let p = {}
					p.x = (position_x + (j * this.sprite_w)) / this.sprite_w;
					p.y = (position_y + (i * this.sprite_h)) / this.sprite_h;
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
			return false
		}
	}

	Game.Player = class Player extends Game.EventTarget{ 
		constructor(w, h) {
			super();
			this.img;
			this.life;
			this.x = 16;
			this.y = 32;
			// TODO:タイルのほうがわかりやすい
			this.sprite_w = w || 16;
			this.sprite_h = h || 16;
			this.sprite_x = 0;
			this.sprite_y = 0;
			this.child = [];
			this.frame = 0;
		}
		move_by(x, y) {
			this.x = this.x + x;
			this.y = this.y + y
		}
		is_intersect(target){			
			if(Math.abs(this.x - target.x) < this.sprite_w / 2 + target.tile_w 
				&&  Math.abs(this.y - target.y) < this.sprite_h / 2 + target.tile_h){
				return true;
			}else{
				return false;
			}
		}
		add_child(dict) {
			if(Game.is_dict(dict)){
				if(dict instanceof Game.Player){
					this.child.push(dict);
				}
			}
		}
		remove_child(dict){
			let i;
			if(Game.is_dict(dict) && dict instanceof Game.Player){
				if((i = this.child.indexOf(dict)) != -1){
					this.child.splice(i, 1);
					if(!this.child){
						this.child = []
					}
				}
			}
		}
		// FIX:削除
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

	Game.Item = class Item extends Game.EventTarget{
		constructor(width, height) {
			super();
			this.img;
		}
	}

})();