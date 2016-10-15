import {get_csv_data} from "./main";

export function getEnemyCSV () {
	let req = new XMLHttpRequest();
	req.open("get", "../enemy.csv",true);
	req.send(null);
	req.onload = function () {
		let result = convertCSVtoArray(req.responseText);
		get_csv_data(result)
	}
}

function convertCSVtoArray (str) {
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