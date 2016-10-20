import {get_csv_data} from "./init";
import {global} from "./global";

export function load_assets (onComplete) {
	let load_count = 0;

	function on_load () {
		onComplete();
	}

	global.asset.assets.forEach((item) => {
		switch(item.type){
			case "image":
				load_img(item, on_load);
				break;
			case "csv":
				load_csv(item, on_load);
				break;
			case "sound":
				load_sound(item, on_load);
				break;
			default:
				throw new Error("Unexpected assets type");
		}
	})
}

function load_csv (asset, onLoad) {
	let req = new XMLHttpRequest();
	req.open("get", asset.src, true);
	req.send(null);
	
	req.onload = function () {
		global.csv_data = convert_csv_to_array(req.responseText);
		onLoad();
	}
}

function convert_csv_to_array (str) {
	let result = [];
	let split_str = str.split("\n");
	let escape_str;
	for(let i = 1; i < split_str.length; i += 1){
		let split_arr = split_str[i].split(",");
		escape_str = escape(split_arr[1]);
		
		if(!split_arr[0] && escape_str === "%0D") continue;

		result.push(split_arr);

		for(let j = 0; j < 2; j += 1){
			let index = result.length - 1;
			result[index][j] = result[index][j] - 0;
		}

	}
	return result;
}

function load_img (assets, onLoad){
	let req = new XMLHttpRequest();
	req.open("get", assets.src);
	req.send();

	req.onload = function () {
		let image = new Image();
		let svg = new Blob([req.responseText],{type: "image/svg+xml;charset=utf-8"})
		let DOMURL = self.URL || self.webkitURL || self;
		let url = DOMURL.createObjectURL(svg);
		image.src = url;
		global.asset.images = {};
		global.asset.images[assets.name] = image;
		image.onload = function () {
			DOMURL.revokeObjectURL(url);
			onLoad();
		};
	}
}

function load_sound (assets,onLoad){
	let sound = new Audio(assets.src);
	global.asset.sound[assets.name] = sound;
	sound.onload = onLoad;
}