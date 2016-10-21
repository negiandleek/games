let root = self;

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
}())