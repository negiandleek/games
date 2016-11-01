// title menu dom
export let create_html = function (context) {
	if(context === "title_menu") {
		document.createElement("div");
		let title_menu = document.createElement("div");
		title_menu.classList.add("menu");

		let menu__title = document.createElement("div");
		menu__title.classList.add("menu__title");

		let p1 = document.createElement("p");			

		menu__title.appendChild(p1);

		let menu__start = document.createElement("div");
		menu__start.classList.add("menu__start");

		let p2 = document.createElement("p");			
		p2.textContent = "START"

		menu__start.appendChild(p2);

		let menu__setting = document.createElement("div");
		menu__setting.classList.add("menu__setting");

		let p3 = document.createElement("p");
		p3.textContent = "SEETING";	

		menu__setting.appendChild(p3);

		title_menu.appendChild(menu__title)
		title_menu.appendChild(menu__start);
		title_menu.appendChild(menu__setting);

		return title_menu;
	}
};

export let create_css = function (context) {
	if(context === "title_menu_css") {
		
		let css = {
			menu: {
				position: "absolute",
				width: "80%",
				left: "50%",
				top: "50%",
				text_align: "center",
				font_size: "1.5em",
				_webkit_transform: "translate(-50%,-50%)",
				_ms_transform: "translate(-50%,-50%)",
				transform: "translate(-50%,-50%)",
			},
			menu__title:{
				font_size: "2em",
				padding: "8px 16px",
				margin_bottom: "8px",
			},
			menu__start: {
				padding: "8px 16px",
				margin_bottom: "8px",
				font_size: "1.5em",
			},
			menu__setting: {
				padding: "8px 16px",
				font_size: "1.5em",
				margin_bottom: "8px"
			}
		}

		return css;
	}
};