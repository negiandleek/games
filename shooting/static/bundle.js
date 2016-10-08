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

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _ship = require("./ship");

var _ship2 = _interopRequireDefault(_ship);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var global = {
	$canvas: "",
	context: "",
	mouse: new _common2.default(),
	ship: {},
	run: 1,
	fps: 1000 / 30
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

	// init position
	global.mouse.x = global.$canvas.width / 2;
	global.mouse.y = global.$canvas.height / 2;

	// init hisp
	global.ship = new _ship2.default();

	// fps
	if (global.run) setInterval(main, global.fps);
});

function main() {
	// clear
	global.context.clearRect(0, 0, global.$canvas.width, global.$canvas.height);

	// ship draw
	// start path
	global.context.beginPath();

	// ship position
	global.ship.position.x = global.mouse.x;
	global.ship.position.y = global.mouse.y;

	//proparty
	global.context.arc(global.ship.position.x, global.ship.position.y, global.ship.size, 0, Math.PI * 2);

	// draw
	global.context.fill();
}

function mouse_move(e) {
	// TODO: learn
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down() {
	console.log("mouse_down");
}

},{"./common":1,"./ship":3}],3:[function(require,module,exports){
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

},{"./common":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9jb21tb24uanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9tYWluLmpzIiwiLmJyb3dzZXJpZnktY2FjaGUvc2hpcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNBTSxLLEdBQ0wsaUJBQWE7QUFBQTs7QUFDWixNQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsTUFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLEM7O0FBR0YsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7QUNQQTs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJLFNBQVM7QUFDWixVQUFTLEVBREc7QUFFWixVQUFTLEVBRkc7QUFHWixRQUFPLHNCQUhLO0FBSVosT0FBTSxFQUpNO0FBS1osTUFBSyxDQUxPO0FBTVosTUFBSyxPQUFPO0FBTkEsQ0FBYjs7QUFTQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxZQUFXO0FBQ3hEO0FBQ0EsUUFBTyxPQUFQLEdBQWlCLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFqQjtBQUNBLFFBQU8sT0FBUCxDQUFlLEtBQWYsR0FBdUIsR0FBdkI7QUFDQSxRQUFPLE9BQVAsQ0FBZSxNQUFmLEdBQXdCLEdBQXhCOztBQUVBLFFBQU8sT0FBUCxHQUFpQixPQUFPLE9BQVAsQ0FBZSxVQUFmLENBQTBCLElBQTFCLENBQWpCOztBQUVBO0FBQ0EsUUFBTyxPQUFQLENBQWUsZ0JBQWYsQ0FBZ0MsV0FBaEMsRUFBNkMsVUFBN0MsRUFBeUQsSUFBekQ7QUFDQSxRQUFPLE9BQVAsQ0FBZSxnQkFBZixDQUFnQyxXQUFoQyxFQUE2QyxVQUE3QyxFQUF5RCxJQUF6RDs7QUFFQTtBQUNBLFFBQU8sS0FBUCxDQUFhLENBQWIsR0FBaUIsT0FBTyxPQUFQLENBQWUsS0FBZixHQUF1QixDQUF4QztBQUNBLFFBQU8sS0FBUCxDQUFhLENBQWIsR0FBaUIsT0FBTyxPQUFQLENBQWUsTUFBZixHQUF3QixDQUF6Qzs7QUFFQTtBQUNBLFFBQU8sSUFBUCxHQUFjLG9CQUFkOztBQUVBO0FBQ0EsS0FBRyxPQUFPLEdBQVYsRUFBYyxZQUFZLElBQVosRUFBa0IsT0FBTyxHQUF6QjtBQUNkLENBckJEOztBQXVCQSxTQUFTLElBQVQsR0FBaUI7QUFDaEI7QUFDQSxRQUFPLE9BQVAsQ0FBZSxTQUFmLENBQXlCLENBQXpCLEVBQTJCLENBQTNCLEVBQThCLE9BQU8sT0FBUCxDQUFlLEtBQTdDLEVBQW9ELE9BQU8sT0FBUCxDQUFlLE1BQW5FOztBQUVBO0FBQ0E7QUFDQSxRQUFPLE9BQVAsQ0FBZSxTQUFmOztBQUVBO0FBQ0EsUUFBTyxJQUFQLENBQVksUUFBWixDQUFxQixDQUFyQixHQUF5QixPQUFPLEtBQVAsQ0FBYSxDQUF0QztBQUNBLFFBQU8sSUFBUCxDQUFZLFFBQVosQ0FBcUIsQ0FBckIsR0FBeUIsT0FBTyxLQUFQLENBQWEsQ0FBdEM7O0FBRUE7QUFDQSxRQUFPLE9BQVAsQ0FBZSxHQUFmLENBQ0MsT0FBTyxJQUFQLENBQVksUUFBWixDQUFxQixDQUR0QixFQUVDLE9BQU8sSUFBUCxDQUFZLFFBQVosQ0FBcUIsQ0FGdEIsRUFHQyxPQUFPLElBQVAsQ0FBWSxJQUhiLEVBSUMsQ0FKRCxFQUtDLEtBQUssRUFBTCxHQUFVLENBTFg7O0FBUUE7QUFDQSxRQUFPLE9BQVAsQ0FBZSxJQUFmO0FBQ0E7O0FBRUQsU0FBUyxVQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQ3ZCO0FBQ0EsUUFBTyxLQUFQLENBQWEsQ0FBYixHQUFpQixFQUFFLE9BQUYsR0FBWSxPQUFPLE9BQVAsQ0FBZSxVQUE1QztBQUNBLFFBQU8sS0FBUCxDQUFhLENBQWIsR0FBaUIsRUFBRSxPQUFGLEdBQVksT0FBTyxPQUFQLENBQWUsU0FBNUM7QUFDQTs7QUFFRCxTQUFTLFVBQVQsR0FBdUI7QUFDdEIsU0FBUSxHQUFSLENBQVksWUFBWjtBQUNBOzs7OztBQ3RFRDs7Ozs7Ozs7SUFFTSxJLEdBQ0wsY0FBWSxJQUFaLEVBQWlCO0FBQUE7O0FBQ2hCLE1BQUssUUFBTCxHQUFnQixzQkFBaEI7QUFDQSxNQUFLLElBQUwsR0FBWSxPQUFPLElBQVAsR0FBYSxFQUF6QjtBQUNBLEM7O0FBR0YsT0FBTyxPQUFQLEdBQWlCLElBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIFBvaW50IHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLnggPSAwO1xuXHRcdHRoaXMueSA9IDA7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDsiLCJcInVzZSBzdHJpY3RcIlxuXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmxldCBnbG9iYWwgPSB7XG5cdCRjYW52YXM6IFwiXCIsXG5cdGNvbnRleHQ6IFwiXCIsXG5cdG1vdXNlOiBuZXcgUG9pbnQoKSxcblx0c2hpcDoge30sXG5cdHJ1bjogMSxcblx0ZnBzOiAxMDAwIC8gMzBcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCl7XG5cdC8vIGNhbnZhcyBpbml0XG5cdGdsb2JhbC4kY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XG5cdGdsb2JhbC4kY2FudmFzLndpZHRoID0gNTAwO1xuXHRnbG9iYWwuJGNhbnZhcy5oZWlnaHQgPSA1MDA7XG5cblx0Z2xvYmFsLmNvbnRleHQgPSBnbG9iYWwuJGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0Ly8gZXZlbnRcblx0Z2xvYmFsLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZV9tb3ZlLCB0cnVlKTtcblx0Z2xvYmFsLiRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZV9kb3duLCB0cnVlKTtcblxuXHQvLyBpbml0IHBvc2l0aW9uXG5cdGdsb2JhbC5tb3VzZS54ID0gZ2xvYmFsLiRjYW52YXMud2lkdGggLyAyO1xuXHRnbG9iYWwubW91c2UueSA9IGdsb2JhbC4kY2FudmFzLmhlaWdodCAvIDI7XG5cdFxuXHQvLyBpbml0IGhpc3Bcblx0Z2xvYmFsLnNoaXAgPSBuZXcgU2hpcCgpO1xuXG5cdC8vIGZwc1xuXHRpZihnbG9iYWwucnVuKXNldEludGVydmFsKG1haW4sIGdsb2JhbC5mcHMpO1xufSlcblxuZnVuY3Rpb24gbWFpbiAoKSB7XG5cdC8vIGNsZWFyXG5cdGdsb2JhbC5jb250ZXh0LmNsZWFyUmVjdCgwLDAsIGdsb2JhbC4kY2FudmFzLndpZHRoLCBnbG9iYWwuJGNhbnZhcy5oZWlnaHQpO1xuXG5cdC8vIHNoaXAgZHJhd1xuXHQvLyBzdGFydCBwYXRoXG5cdGdsb2JhbC5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG5cdC8vIHNoaXAgcG9zaXRpb25cblx0Z2xvYmFsLnNoaXAucG9zaXRpb24ueCA9IGdsb2JhbC5tb3VzZS54O1xuXHRnbG9iYWwuc2hpcC5wb3NpdGlvbi55ID0gZ2xvYmFsLm1vdXNlLnk7XG5cblx0Ly9wcm9wYXJ0eVxuXHRnbG9iYWwuY29udGV4dC5hcmMoXG5cdFx0Z2xvYmFsLnNoaXAucG9zaXRpb24ueCxcblx0XHRnbG9iYWwuc2hpcC5wb3NpdGlvbi55LFxuXHRcdGdsb2JhbC5zaGlwLnNpemUsXG5cdFx0MCxcblx0XHRNYXRoLlBJICogMlxuXHQpO1xuXG5cdC8vIGRyYXdcblx0Z2xvYmFsLmNvbnRleHQuZmlsbCgpO1xufVxuXG5mdW5jdGlvbiBtb3VzZV9tb3ZlIChlKSB7XG5cdC8vIFRPRE86IGxlYXJuXG5cdGdsb2JhbC5tb3VzZS54ID0gZS5jbGllbnRYIC0gZ2xvYmFsLiRjYW52YXMub2Zmc2V0TGVmdDtcblx0Z2xvYmFsLm1vdXNlLnkgPSBlLmNsaWVudFkgLSBnbG9iYWwuJGNhbnZhcy5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIG1vdXNlX2Rvd24gKCkge1xuXHRjb25zb2xlLmxvZyhcIm1vdXNlX2Rvd25cIik7XG59IiwiaW1wb3J0IFBvaW50IGZyb20gXCIuL2NvbW1vblwiO1xuXG5jbGFzcyBTaGlwe1xuXHRjb25zdHJ1Y3RvcihzaXplKXtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0dGhpcy5zaXplID0gc2l6ZSA/IHNpemU6IDEwO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hpcDsiXX0=
