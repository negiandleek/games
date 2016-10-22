let root = root || {};

root.namespace = function (string) {
	let parts = string.split(".")
	let parent = root;

	if(parts[0] === "root"){
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

(function () {
	window.addEventListener("DOMContentLoaded", () => {
		root.canvas = document.getElementById("canvas");
		root.canvas.width = 250;
		root.canvas.height = 250;
		root.context = root.canvas.getContext("2d");
	});
	global.assets = {};
	global.assets.asset = {
		type: "image",
		src: "./images/instant"
	}

	let load = function () {

	}

	let init = function (asset,onLoad) {
		let images = global.assets.images = [];
		images[asset.name] = new Image();
		images[asset.name].src = asset.src;
		images[asset.name].onload = onLoad;
	}

	x
}())