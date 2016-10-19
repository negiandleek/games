import {get_csv_data} from "./init";
import {global} from "./global";

export function load_assets (onComplete) {
	// let total = global.assets.length;
	let load_count = 0;

	function on_load () {
		// load_count = load_count + 1;
		// if(load_count >= total){
			onComplete();
		// }
	}

	try{
		global.assets.forEach((item) => {
			switch(item.type){
				case "image":
					load_img(item, on_load);
					break;
				case "csv":
					load_csv(item, on_load);
					break;
				default:
					throw new Error("Unexpected assets type");
			}
		})
	}catch(e){
		console.error(e);
	}
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
	let image = new Image();
	image.src = assets.src;
	image.onload = onLoad;
}