(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point() {
	_classCallCheck(this, Point);

	this.x = 0;
	this.y = 0;
};

module.exports = Point;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.global = undefined;

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _ship = require("./ship");

var _ship2 = _interopRequireDefault(_ship);

var _ship_shot = require("./ship_shot");

var _ship_shot2 = _interopRequireDefault(_ship_shot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var global = exports.global = {
	$canvas: "",
	context: "",
	mouse: new _common2.default(),
	ship: {},
	ship_shot: {},
	run: 1,
	fps: 1000 / 30,
	fire: false
};

var CONSTANT = {
	CHARA_SHOT_MAX_COUNT: 5
};

document.addEventListener("DOMContentLoaded", function () {
	// canvas init
	global.$canvas = document.getElementById("canvas");
	global.$canvas.width = 500;
	global.$canvas.height = 500;

	global.context = global.$canvas.getContext("2d");

	// event
	global.$canvas.addEventListener("mousemove", mouse_move, true);
	global.$canvas.addEventListener("mousedown", mouse_down, true);

	/*init*/
	//position
	global.mouse.x = global.$canvas.width / 2;
	global.mouse.y = global.$canvas.height / 2;

	// ship
	global.ship = new _ship2.default();

	// ship shot
	global.ship_shot = new Array(CONSTANT["CHARA_SHOT_MAX_COUNT"]);
	for (var i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1) {
		global.ship_shot[i] = new _ship_shot2.default();
	}

	/*fps*/
	if (global.run) setInterval(main, global.fps);
});

function main() {
	// clear
	global.context.clearRect(0, 0, global.$canvas.width, global.$canvas.height);

	/*ship draw*/
	// start path
	global.context.beginPath();

	// ship position
	global.ship.position.x = global.mouse.x;
	global.ship.position.y = global.mouse.y;

	//proparty
	global.context.arc(global.ship.position.x, global.ship.position.y, global.ship.size, 0, Math.PI * 2);

	// draw
	global.context.fill();

	/*ship shot draw*/
	// set
	if (global.fire) {
		for (var i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1) {
			if (!global.ship_shot[i].alive) {
				global.ship_shot[i].set([global.ship.position]);
				break;
			}
		}
		global.fire = false;
	}
	// start path
	global.context.beginPath();

	for (var _i = 0; _i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; _i += 1) {
		if (global.ship_shot[_i].alive) {
			global.ship_shot[_i].move();
			global.context.arc(global.ship_shot[_i].position.x, global.ship_shot[_i].position.y, global.ship_shot[_i].size, 0, Math.PI * 2, false);
			global.context.closePath();
		}
	}

	global.context.fill();
}

function mouse_move(e) {
	// TODO: learn
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down() {
	global.fire = true;
}

},{"./common":1,"./ship":3,"./ship_shot":4}],3:[function(require,module,exports){
"use strict";

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ship = function Ship(size) {
	_classCallCheck(this, Ship);

	this.position = new _common2.default();
	this.size = size ? size : 10;
};

module.exports = Ship;

},{"./common":1}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _main = require("./main");

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ship_shot = function () {
	function Ship_shot(size) {
		_classCallCheck(this, Ship_shot);

		this.position = new _common2.default();
		this.size = size ? size : 3;
		this.speed = 10;
		this.alive = false;
	}

	_createClass(Ship_shot, [{
		key: "set",
		value: function set(li) {
			for (var i = 0; i < 3; i += 1) {
				if (typeof li[i] === "undefined") break;

				switch (i) {
					case 0:
						this.position.x = li[i]["x"];
						this.position.y = li[i]["y"];
						break;

					case 1:
						this.size = li[i];
						break;

					case 2:
						this.speed = li[i];
						break;
				}
			}
			this.alive = true;
		}
	}, {
		key: "move",
		value: function move() {
			this.position.x = this.position.x + this.speed;
			if (this.position.x > this.size + _main.global.$canvas.width) {
				this.alive = false;
			}
		}
	}]);

	return Ship_shot;
}();

module.exports = Ship_shot;

},{"./common":1,"./main":2}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9jb21tb24uanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9tYWluLmpzIiwiLmJyb3dzZXJpZnktY2FjaGUvc2hpcC5qcyIsIi5icm93c2VyaWZ5LWNhY2hlL3NoaXBfc2hvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNBTSxLLEdBQ0wsaUJBQWE7QUFBQTs7QUFDWixNQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsTUFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLEM7O0FBR0YsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7QUNQQTs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sSUFBSSwwQkFBUztBQUNuQixVQUFTLEVBRFU7QUFFbkIsVUFBUyxFQUZVO0FBR25CLFFBQU8sc0JBSFk7QUFJbkIsT0FBTSxFQUphO0FBS25CLFlBQVcsRUFMUTtBQU1uQixNQUFLLENBTmM7QUFPbkIsTUFBSyxPQUFPLEVBUE87QUFRbkIsT0FBTTtBQVJhLENBQWI7O0FBV1AsSUFBTSxXQUFXO0FBQ2hCLHVCQUFzQjtBQUROLENBQWpCOztBQUlBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVc7QUFDeEQ7QUFDQSxRQUFPLE9BQVAsR0FBaUIsU0FBUyxjQUFULENBQXdCLFFBQXhCLENBQWpCO0FBQ0EsUUFBTyxPQUFQLENBQWUsS0FBZixHQUF1QixHQUF2QjtBQUNBLFFBQU8sT0FBUCxDQUFlLE1BQWYsR0FBd0IsR0FBeEI7O0FBRUEsUUFBTyxPQUFQLEdBQWlCLE9BQU8sT0FBUCxDQUFlLFVBQWYsQ0FBMEIsSUFBMUIsQ0FBakI7O0FBRUE7QUFDQSxRQUFPLE9BQVAsQ0FBZSxnQkFBZixDQUFnQyxXQUFoQyxFQUE2QyxVQUE3QyxFQUF5RCxJQUF6RDtBQUNBLFFBQU8sT0FBUCxDQUFl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O0FBQ0QsUUFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBOzs7eUJBQ0s7QUFDTCxRQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBSyxLQUF6QztBQUNBLE9BQUcsS0FBSyxRQUFMLENBQWMsQ0FBZCxHQUFrQixLQUFLLElBQUwsR0FBWSxhQUFPLE9BQVAsQ0FBZSxLQUFoRCxFQUFzRDtBQUNyRCxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0E7QUFDRDs7Ozs7O0FBR0YsT0FBTyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIFBvaW50IHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLnggPSAwO1xuXHRcdHRoaXMueSA9IDA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDsiLCJcInVzZSBzdHJpY3RcIlxuXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgU2hpcF9zaG90IGZyb20gXCIuL3NoaXBfc2hvdFwiO1xuXG5leHBvcnQgbGV0IGdsb2JhbCA9IHtcblx0JGNhbnZhczogXCJcIixcblx0Y29udGV4dDogXCJcIixcblx0bW91c2U6IG5ldyBQb2ludCgpLFxuXHRzaGlwOiB7fSxcblx0c2hpcF9zaG90OiB7fSxcblx0cnVuOiAxLFxuXHRmcHM6IDEwMDAgLyAzMCxcblx0ZmlyZTogZmFsc2Vcbn1cblxuY29uc3QgQ09OU1RBTlQgPSB7XG5cdENIQVJBX1NIT1RfTUFYX0NPVU5UOiA1XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpe1xuXHQvLyBjYW52YXMgaW5pdFxuXHRnbG9iYWwuJGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuXHRnbG9iYWwuJGNhbnZhcy53aWR0aCA9IDUwMDtcblx0Z2xvYmFsLiRjYW52YXMuaGVpZ2h0ID0gNTAwO1xuXG5cdGdsb2JhbC5jb250ZXh0ID0gZ2xvYmFsLiRjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdC8vIGV2ZW50XG5cdGdsb2JhbC4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2VfbW92ZSwgdHJ1ZSk7XG5cdGdsb2JhbC4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VfZG93biwgdHJ1ZSk7XG5cblx0Lyppbml0Ki9cblx0Ly9wb3NpdGlvblxuXHRnbG9iYWwubW91c2UueCA9IGdsb2JhbC4kY2FudmFzLndpZHRoIC8gMjtcblx0Z2xvYmFsLm1vdXNlLnkgPSBnbG9iYWwuJGNhbnZhcy5oZWlnaHQgLyAyO1xuXHRcblx0Ly8gc2hpcFxuXHRnbG9iYWwuc2hpcCA9IG5ldyBTaGlwKCk7XG5cblx0Ly8gc2hpcCBzaG90XG5cdGdsb2JhbC5zaGlwX3Nob3QgPSBuZXcgQXJyYXkoQ09OU1RBTlRbXCJDSEFSQV9TSE9UX01BWF9DT1VOVFwiXSk7XG5cdGZvcihsZXQgaSA9IDA7IGkgPCBDT05TVEFOVFtcIkNIQVJBX1NIT1RfTUFYX0NPVU5UXCJdOyBpICs9IDEpe1xuXHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0gPSBuZXcgU2hpcF9zaG90KCk7XG5cdH1cblxuXHQvKmZwcyovXG5cdGlmKGdsb2JhbC5ydW4pc2V0SW50ZXJ2YWwobWFpbiwgZ2xvYmFsLmZwcyk7XG59KVxuXG5mdW5jdGlvbiBtYWluICgpIHtcblx0Ly8gY2xlYXJcblx0Z2xvYmFsLmNvbnRleHQuY2xlYXJSZWN0KDAsMCwgZ2xvYmFsLiRjYW52YXMud2lkdGgsIGdsb2JhbC4kY2FudmFzLmhlaWdodCk7XG5cblx0LypzaGlwIGRyYXcqL1xuXHQvLyBzdGFydCBwYXRoXG5cdGdsb2JhbC5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG5cdC8vIHNoaXAgcG9zaXRpb25cblx0Z2xvYmFsLnNoaXAucG9zaXRpb24ueCA9IGdsb2JhbC5tb3VzZS54O1xuXHRnbG9iYWwuc2hpcC5wb3NpdGlvbi55ID0gZ2xvYmFsLm1vdXNlLnk7XG5cblx0Ly9wcm9wYXJ0eVxuXHRnbG9iYWwuY29udGV4dC5hcmMoXG5cdFx0Z2xvYmFsLnNoaXAucG9zaXRpb24ueCxcblx0XHRnbG9iYWwuc2hpcC5wb3NpdGlvbi55LFxuXHRcdGdsb2JhbC5zaGlwLnNpemUsXG5cdFx0MCxcblx0XHRNYXRoLlBJICogMlxuXHQpO1xuXG5cdC8vIGRyYXdcblx0Z2xvYmFsLmNvbnRleHQuZmlsbCgpO1xuXG5cdC8qc2hpcCBzaG90IGRyYXcqL1xuXHQvLyBzZXRcblx0aWYoZ2xvYmFsLmZpcmUpe1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBDT05TVEFOVFtcIkNIQVJBX1NIT1RfTUFYX0NPVU5UXCJdOyBpICs9IDEpe1xuXHRcdFx0aWYoIWdsb2JhbC5zaGlwX3Nob3RbaV0uYWxpdmUpe1xuXHRcdFx0XHRnbG9iYWwuc2hpcF9zaG90W2ldLnNldChbZ2xvYmFsLnNoaXAucG9zaXRpb25dKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdsb2JhbC5maXJlID0gZmFsc2U7XG5cdH1cblx0Ly8gc3RhcnQgcGF0aFxuXHRnbG9iYWwuY29udGV4dC5iZWdpblBhdGgoKTtcblxuXHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJDSEFSQV9TSE9UX01BWF9DT1VOVFwiXTsgaSArPSAxKXtcblx0XHRpZihnbG9iYWwuc2hpcF9zaG90W2ldLmFsaXZlKXtcblx0XHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0ubW92ZSgpO1xuXHRcdFx0Z2xvYmFsLmNvbnRleHQuYXJjKFxuXHRcdFx0XHRnbG9iYWwuc2hpcF9zaG90W2ldLnBvc2l0aW9uLngsXG5cdFx0XHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0ucG9zaXRpb24ueSxcblx0XHRcdFx0Z2xvYmFsLnNoaXBfc2hvdFtpXS5zaXplLFxuXHRcdFx0XHQwLFxuXHRcdFx0XHRNYXRoLlBJICogMixcblx0XHRcdFx0ZmFsc2Vcblx0XHRcdCk7XG5cdFx0XHRnbG9iYWwuY29udGV4dC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cdH1cblxuXHRnbG9iYWwuY29udGV4dC5maWxsKCk7XG59XG5cbmZ1bmN0aW9uIG1vdXNlX21vdmUgKGUpIHtcblx0Ly8gVE9ETzogbGVhcm5cblx0Z2xvYmFsLm1vdXNlLnggPSBlLmNsaWVudFggLSBnbG9iYWwuJGNhbnZhcy5vZmZzZXRMZWZ0O1xuXHRnbG9iYWwubW91c2UueSA9IGUuY2xpZW50WSAtIGdsb2JhbC4kY2FudmFzLm9mZnNldFRvcDtcbn1cblxuZnVuY3Rpb24gbW91c2VfZG93biAoKSB7XG5cdGdsb2JhbC5maXJlID0gdHJ1ZVxufSIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9jb21tb25cIjtcblxuY2xhc3MgU2hpcHtcblx0Y29uc3RydWN0b3Ioc2l6ZSl7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludCgpO1xuXHRcdHRoaXMuc2l6ZSA9IHNpemUgPyBzaXplOiAxMDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiaW1wb3J0IHtnbG9iYWx9IGZyb20gXCIuL21haW5cIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9jb21tb25cIjtcblxuY2xhc3MgU2hpcF9zaG90e1xuXHRjb25zdHJ1Y3RvcihzaXplKXtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0dGhpcy5zaXplID0gc2l6ZSA/IHNpemUgOiAzO1xuXHRcdHRoaXMuc3BlZWQgPSAxMDtcblx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XG5cdH1cblx0c2V0KGxpKXtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgMzsgaSs9MSl7XG5cdFx0XHRpZih0eXBlb2YgbGlbaV0gPT09IFwidW5kZWZpbmVkXCIpIGJyZWFrO1xuXG5cdFx0XHRzd2l0Y2ggKGkpe1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0dGhpcy5wb3NpdGlvbi54ID0gbGlbaV1bXCJ4XCJdO1xuXHRcdFx0XHRcdHRoaXMucG9zaXRpb24ueSA9IGxpW2ldW1wieVwiXTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0dGhpcy5zaXplID0gbGlbaV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHRoaXMuc3BlZWQgPSBsaVtpXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5hbGl2ZSA9IHRydWU7XG5cdH1cblx0bW92ZSgpe1xuXHRcdHRoaXMucG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueCArIHRoaXMuc3BlZWQ7XG5cdFx0aWYodGhpcy5wb3NpdGlvbi54ID4gdGhpcy5zaXplICsgZ2xvYmFsLiRjYW52YXMud2lkdGgpe1xuXHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXBfc2hvdDsiXX0=
