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

	Game.init = function () {
		let init_assets = function (asset,onLoad) {
			let images = Game.assets.images = [];
			images[asset.name] = new Image();
			images[asset.name].src = asset.src;
			images[asset.name].onload = onLoad;
		}
	};

})();