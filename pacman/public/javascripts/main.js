import "./game"

let root = self;
self.root = root;

window.addEventListener("DOMContentLoaded", () => {
	root.canvas = document.getElementById("canvas");
	root.canvas.width = 250;
	root.canvas.height = 250;
	root.context = root.canvas.getContext("2d");

	Game.load(300);
});

Game.init_assets([{
	name: "player",
	type: "image",
	src: "./images/player.png"
},{
	name: "dungeon",
	type: "image",
	src: "./images/dungeon.png"
}]);