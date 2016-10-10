(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
	function Point() {
		_classCallCheck(this, Point);

		this.x = 0;
		this.y = 0;
	}
	// TODO: learn


	_createClass(Point, [{
		key: "distance",
		value: function distance(p) {
			var q = new Point();
			q.x = p.x - this.x;
			q.y = p.y - this.y;
			return q;
		}
	}, {
		key: "length",
		value: function length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}, {
		key: "normalize",
		value: function normalize() {
			var i = this.length();
			if (i > 0) {
				var j = 1 / i;
				this.x *= j;
				this.y *= j;
			}
		}
	}]);

	return Point;
}();

module.exports = Point;

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _main = require("./main");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy = function () {
	function Enemy() {
		_classCallCheck(this, Enemy);

		this.position = new _common2.default();
		this.size = 0;
		this.type = 0;
		this.param = 0;
		this.alive = false;
	}

	_createClass(Enemy, [{
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
						this.type = li[i];
						break;
				}
			}
			this.param = 0;
			this.alive = true;
		}
	}, {
		key: "move",
		value: function move() {
			this.param += 1;

			switch (this.type) {
				case 0:
					this.position.y += 2;

					if (this.position.y > this.size + _main.global.$canvas.height) {
						this.alive = false;
					}
					break;
				case 1:
					this.position.y -= 2;

					if (this.position.y < -this.size) {
						this.alive = false;
					}
					break;
			}
		}
	}]);

	return Enemy;
}();

module.exports = Enemy;

},{"./common":1,"./main":4}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _main = require("./main.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy_shot = function () {
	function Enemy_shot() {
		_classCallCheck(this, Enemy_shot);

		this.position = new _common2.default();
		this.vector = new _common2.default();
		this.size = 0;
		this.speed = 0;
		this.alive = false;
	}

	_createClass(Enemy_shot, [{
		key: "set",
		value: function set(li) {
			for (var i = 0; i < 4; i += 1) {
				if (typeof li[i] === "undefined") break;
				switch (i) {
					case 0:
						this.position.x = li[i]["x"];
						this.position.y = li[i]["y"];
						break;

					case 1:
						this.vector.x = li[i]["x"];
						this.vector.y = li[i]["y"];
						break;

					case 2:
						this.size = li[i];
						break;

					case 3:
						this.speed = li[i];
						break;
				}
			}
			this.alive = true;
		}
	}, {
		key: "move",
		value: function move() {
			this.position.x += this.vector.x * this.speed;
			this.position.y += this.vector.y * this.speed;
			if (this.position.x < -this.size || this.position.y < -this.size || this.position.x > this.size + _main.global.$canvas.width || this.position.y > this.size + _main.global.$canvas.height) {
				this.alive = false;
			}
		}
	}]);

	return Enemy_shot;
}();

module.exports = Enemy_shot;

},{"./common":1,"./main.js":4}],4:[function(require,module,exports){
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

var _enemy = require("./enemy");

var _enemy2 = _interopRequireDefault(_enemy);

var _enemy_shot = require("./enemy_shot");

var _enemy_shot2 = _interopRequireDefault(_enemy_shot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var global = exports.global = {
	$canvas: "",
	context: "",
	counter: 0,
	mouse: new _common2.default(),
	ship: {},
	ship_shot: {},
	run: true,
	fps: 1000 / 30,
	fire: false,
	enemy_shot: {},
	text: {
		score: {},
		info: {
			align: "center ,sans-serif",
			font: "30px 'ＭＳ ゴシック'",
			style: "rgb(0,0,0)",
			position: {}
		}
	}
};

var CONSTANT = {
	CHARA_SHOT_MAX_COUNT: 5,
	CHARA_COLOR: "rgba(0, 0, 255, 0.75)",
	CHARA_SHOT_COLOR: "rgba(0 ,255 ,0 , 0.75)",
	ENEMY_MAX_COUNT: 15,
	ENEMY_SHOT_MAX_COUNT: 100,
	ENEMY_COLOR: "rgba(255, 0, 0, 0.75)",
	ENEMY_SHOT_COLOR: "rgba(255, 0, 255, 0.75)"
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
	(function () {
		var x = global.$canvas.width / 2;
		var y = global.$canvas.height / 2;
		global.mouse.x = x;
		global.mouse.y = y;
		global.text.info.position.x = x;
		global.text.info.position.y = y;
	})();

	// ship
	global.ship = new _ship2.default();

	// ship shot
	global.ship_shot = new Array(CONSTANT["CHARA_SHOT_MAX_COUNT"]);
	for (var i = 0; i < CONSTANT["CHARA_SHOT_MAX_COUNT"]; i += 1) {
		global.ship_shot[i] = new _ship_shot2.default();
	}

	// enemy
	global.enemy = new Array(CONSTANT["ENEMY_MAX_COUNT"]);
	for (var _i = 0; _i < CONSTANT["ENEMY_MAX_COUNT"]; _i += 1) {
		global.enemy[_i] = new _enemy2.default();
	}

	// enemy shot
	var enemy_shot = new Array(CONSTANT["ENEMY_SHOT_MAX_COUNT"]);
	for (var _i2 = 0; _i2 < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; _i2 += 1) {
		global.enemy_shot[_i2] = new _enemy_shot2.default();
	}

	/*fps*/
	main();
});

function main() {
	global.counter += 1;
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
	global.context.fillStyle = CONSTANT.CHARA_COLOR;
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

	for (var _i3 = 0; _i3 < CONSTANT["CHARA_SHOT_MAX_COUNT"]; _i3 += 1) {
		if (global.ship_shot[_i3].alive) {
			global.ship_shot[_i3].move();
			global.context.arc(global.ship_shot[_i3].position.x, global.ship_shot[_i3].position.y, global.ship_shot[_i3].size, 0, Math.PI * 2, false);
			global.context.closePath();
		}
	}
	global.context.fillStyle = CONSTANT.CHARA_SHOT_COLOR;
	global.context.fill();

	/*enemy draw*/
	// seen branch
	switch (true) {
		case global.counter < 50:
			display_text(global.text.info, "READY");
			break;

		case global.counter < 80:
			display_text(global.text.info, "GO");
			break;

		default:
			// set
			if (global.counter % 50 === 0) {
				for (var _i4 = 0; _i4 < CONSTANT["ENEMY_MAX_COUNT"]; _i4 += 1) {
					if (!global.enemy[_i4]["alive"]) {
						var j = global.counter % 100 / 50;

						// type
						var enemy_size = 15;
						var p = {};
						p.x = global.$canvas.width / 3 * 2;
						p.y = -enemy_size + (global.$canvas.height + enemy_size * 2) * j;

						global.enemy[_i4].set([p, enemy_size, j]);
						break;
					}
				}
			}

			// draw
			global.context.beginPath();

			for (var _i5 = 0; _i5 < CONSTANT["ENEMY_MAX_COUNT"]; _i5 += 1) {
				if (global.enemy[_i5].alive) {
					global.enemy[_i5].move();
					global.context.arc(global.enemy[_i5].position.x, global.enemy[_i5].position.y, global.enemy[_i5].size, 0, Math.PI * 2, false);
					// set shot info
					if (global.enemy[_i5].param % 15 === 0) {
						for (var _j = 0; _j < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; _j += 1) {
							if (!global.enemy_shot[_j].alive) {
								var _p = global.enemy[_i5].position.distance(global.ship.position);
								_p.normalize();
								global.enemy_shot[_j].set([global.enemy[_i5].position, _p, 5, 5]);

								break;
							}
						}
					}
				}
				global.context.closePath();
			}
			global.context.fillStyle = CONSTANT.ENEMY_COLOR;
			global.context.fill();

			/*shot*/
			global.context.beginPath();

			for (var _i6 = 0; _i6 < CONSTANT["ENEMY_SHOT_MAX_COUNT"]; _i6 += 1) {
				if (global.enemy_shot[_i6].alive) {
					global.enemy_shot[_i6].move();
					global.context.arc(global.enemy_shot[_i6].position.x, global.enemy_shot[_i6].position.y, global.enemy_shot[_i6].size, 0, Math.PI * 2, false);
				}
				global.context.closePath();
			}
			global.context.fillStyle = CONSTANT.ENEMY_SHOT_COLOR;
			global.context.fill();

			/*collision detection*/
			// ship shot and enemy
			for (var _i7 = 0; _i7 < CONSTANT.CHARA_SHOT_MAX_COUNT; _i7 += 1) {
				if (global.ship_shot[_i7].alive) {
					for (var _j2 = 0; _j2 < CONSTANT.ENEMY_MAX_COUNT; _j2 += 1) {
						// enemyとship shotの距離を計算
						var _p2 = global.ship_shot[_i7].position.distance(global.enemy[_j2].position);
						if (_p2.length() < global.enemy[_j2].size) {
							global.enemy[_j2].alive = false;
							global.ship_shot[_i7] = false;

							break;
						}
					}
				}
			}

			for (var _i8 = 0; _i8 < CONSTANT.ENEMY_SHOT_MAX_COUNT; _i8 += 1) {
				if (global.enemy_shot[_i8].alive) {
					var _p3 = global.ship.position.distance(global.enemy_shot[_i8].position);
					if (_p3.length() < global.ship.size) {
						global.run = false;
						display_text(global.text.info, "GAME OVER!!");
						break;
					}
				}
			}
	}
	if (global.run) {
		setTimeout(main, global.fps);
	}
}

function mouse_move(e) {
	// TODO: learn
	if (global.counter < 80) return;
	global.mouse.x = e.clientX - global.$canvas.offsetLeft;
	global.mouse.y = e.clientY - global.$canvas.offsetTop;
}

function mouse_down() {
	if (global.counter < 80) return;
	global.fire = true;
}

function display_text(obj, text) {
	var x = void 0,
	    y = void 0;
	for (var prop in obj) {
		switch (prop) {
			case "style":
				global.context.fillStyle = obj[prop];
				break;

			case "align":
				global.context.textAlign = obj[prop];
				break;

			case "font":
				global.context.font = obj[prop];
				break;

			case "position":
				x = obj[prop].x;
				y = obj[prop].y;
		}
	}
	global.context.fillText(text, x, y);
}

},{"./common":1,"./enemy":2,"./enemy_shot":3,"./ship":5,"./ship_shot":6}],5:[function(require,module,exports){
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

},{"./common":1}],6:[function(require,module,exports){
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

},{"./common":1,"./main":4}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9jb21tb24uanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9lbmVteS5qcyIsIi5icm93c2VyaWZ5LWNhY2hlL2VuZW15X3Nob3QuanMiLCIuYnJvd3NlcmlmeS1jYWNoZS9tYWluLmpzIiwiLmJyb3dzZXJpZnktY2FjaGUvc2hpcC5qcyIsIi5icm93c2VyaWZ5LWNhY2hlL3NoaXBfc2hvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztJQ0FNLEs7QUFDTCxrQkFBYTtBQUFBOztBQUNaLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0E7QUFDRDs7Ozs7MkJBQ1MsQyxFQUFFO0FBQ1YsT0FBSSxJQUFJLElBQUksS0FBSixFQUFSO0FBQ0EsS0FBRSxDQUFGLEdBQU0sRUFBRSxDQUFGLEdBQU0sS0FBSyxDQUFqQjtBQUNBLEtBQUUsQ0FBRixHQUFNLEVBQUUsQ0FBRixHQUFNLEtBQUssQ0FBakI7QUFDQSxVQUFPLENBQVA7QUFDQTs7OzJCQUNPO0FBQ1AsVUFBTyxLQUFLLElBQUwsQ0FBVSxLQUFLLENBQUwsR0FBUyxLQUFLLENBQWQsR0FBa0IsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUExQyxDQUFQO0FBQ0E7Ozs4QkFDVztBQUNaLE9BQUksSUFBSSxLQUFLLE1BQUwsRUFBUjtBQUNDLE9BQUcsSUFBSSxDQUFQLEVBQVM7QUFDUixRQUFJLElBQUksSUFBSSxDQUFaO0FBQ0EsU0FBSyxDQUFMLElBQVUsQ0FBVjtBQUNBLFNBQUssQ0FBTCxJQUFVLENBQVY7QUFDQTtBQUNEOzs7Ozs7QUFHRixPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7Ozs7QUN6QkE7Ozs7QUFDQTs7Ozs7O0lBRU0sSztBQUNMLGtCQUFhO0FBQUE7O0FBQ1osT0FBSyxRQUFMLEdBQWdCLHNC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QUssSUFBTCxHQUFZLEdBQUcsQ0FBSCxDQUFaO0FBQ0E7O0FBRUQsVUFBSyxDQUFMO0FBQ0MsV0FBSyxLQUFMLEdBQWEsR0FBRyxDQUFILENBQWI7QUFDQTtBQVpGO0FBY0E7QUFDRCxRQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0E7Ozt5QkFDSztBQUNMLFFBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBSyxRQUFMLENBQWMsQ0FBZCxHQUFrQixLQUFLLEtBQXpDO0FBQ0EsT0FBRyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssSUFBTCxHQUFZLGFBQU8sT0FBUCxDQUFlLEtBQWhELEVBQXNEO0FBQ3JELFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQTtBQUNEOzs7Ozs7QUFHRixPQUFPLE9BQVAsR0FBaUIsU0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgUG9pbnQge1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMueCA9IDA7XG5cdFx0dGhpcy55ID0gMDtcblx0fVxuXHQvLyBUT0RPOiBsZWFyblxuXHRkaXN0YW5jZShwKXtcblx0XHRsZXQgcSA9IG5ldyBQb2ludCgpO1xuXHRcdHEueCA9IHAueCAtIHRoaXMueDtcblx0XHRxLnkgPSBwLnkgLSB0aGlzLnk7XG5cdFx0cmV0dXJuIHE7XG5cdH1cblx0bGVuZ3RoKCl7XG5cdFx0cmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xuXHR9XG5cdG5vcm1hbGl6ZSgpIHtcblx0bGV0IGkgPSB0aGlzLmxlbmd0aCgpO1xuXHRcdGlmKGkgPiAwKXtcblx0XHRcdGxldCBqID0gMSAvIGk7XG5cdFx0XHR0aGlzLnggKj0gajtcblx0XHRcdHRoaXMueSAqPSBqO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50OyIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9jb21tb25cIjtcbmltcG9ydCB7Z2xvYmFsfSBmcm9tIFwiLi9tYWluXCI7XG5cbmNsYXNzIEVuZW15e1xuXHRjb25zdHJ1Y3Rvcigpe1xuXHRcdHRoaXMucG9zaXRpb24gPSBuZXcgUG9pbnQoKTtcblx0XHR0aGlzLnNpemUgPSAwO1xuXHRcdHRoaXMudHlwZSA9IDA7XG5cdFx0dGhpcy5wYXJhbSA9IDA7XG5cdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xuXHR9XG5cdHNldChsaSl7XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IDM7IGkgKz0gMSl7XG5cdFx0XHRpZih0eXBlb2YgbGlbaV0gPT09IFwidW5kZWZpbmVkXCIpIGJyZWFrO1xuXHRcdFx0c3dpdGNoIChpKXtcblx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdHRoaXMucG9zaXRpb24ueCA9IGxpW2ldW1wieFwiXTtcblx0XHRcdFx0XHR0aGlzLnBvc2l0aW9uLnkgPSBsaVtpXVtcInlcIl07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHRoaXMuc2l6ZSA9IGxpW2ldO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHRoaXMudHlwZSA9IGxpW2ldO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnBhcmFtID0gMDtcblx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcblx0fVxuXHRtb3ZlKCl7XG5cdFx0dGhpcy5wYXJhbSArPSAxO1xuXG5cdFx0c3dpdGNoKHRoaXMudHlwZSl7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdHRoaXMucG9zaXRpb24ueSArPSAyO1xuXG5cdFx0XHRcdGlmKHRoaXMucG9zaXRpb24ueSA+IHRoaXMuc2l6ZSArIGdsb2JhbC4kY2FudmFzLmhlaWdodCl7XG5cdFx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnkgLT0yO1xuXG5cdFx0XHRcdGlmKHRoaXMucG9zaXRpb24ueSA8IC10aGlzLnNpemUpe1xuXHRcdFx0XHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteTsiLCJpbXBvcnQgUG9pbnQgZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge2dsb2JhbH0gZnJvbSBcIi4vbWFpbi5qc1wiO1xuY2xhc3MgRW5lbXlfc2hvdHtcblx0Y29uc3RydWN0b3IoKXtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0dGhpcy52ZWN0b3IgPSBuZXcgUG9pbnQoKTtcblx0XHR0aGlzLnNpemUgPSAwO1xuXHRcdHRoaXMuc3BlZWQgPSAwO1xuXHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcblx0fVxuXHRzZXQobGkpe1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCA0OyBpICs9IDEpe1xuXHRcdFx0aWYodHlwZW9mIGxpW2ldID09PSBcInVuZGVmaW5lZFwiKSBicmVhaztcblx0XHRcdHN3aXRjaCAoaSl7XG5cdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHR0aGlzLnBvc2l0aW9uLnggPSBsaVtpXVtcInhcIl07XG5cdFx0XHRcdFx0dGhpcy5wb3NpdGlvbi55ID0gbGlbaV1bXCJ5XCJdO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR0aGlzLnZlY3Rvci54ID0gbGlbaV1bXCJ4XCJdO1xuXHRcdFx0XHRcdHRoaXMudmVjdG9yLnkgPSBsaVtpXVtcInlcIl07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0dGhpcy5zaXplID0gbGlbaV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdHRoaXMuc3BlZWQgPSBsaVtpXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5hbGl2ZSA9IHRydWU7XG5cdH1cblx0bW92ZSgpe1xuXHRcdHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlY3Rvci54ICogdGhpcy5zcGVlZDtcblx0XHR0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWN0b3IueSAqIHRoaXMuc3BlZWQ7XG5cdFx0aWYoXG5cdFx0XHR0aGlzLnBvc2l0aW9uLnggPCAtdGhpcy5zaXplIHx8XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnkgPCAtdGhpcy5zaXplIHx8XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnggPiB0aGlzLnNpemUgKyBnbG9iYWwuJGNhbnZhcy53aWR0aCB8fFxuXHRcdFx0dGhpcy5wb3NpdGlvbi55ID4gdGhpcy5zaXplICsgZ2xvYmFsLiRjYW52YXMuaGVpZ2h0XG5cdFx0KXtcblx0XHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcblx0XHR9XG5cdH1cbn1cbm1vZHVsZS5leHBvcnRzID0gRW5lbXlfc2hvdDsiLCJcInVzZSBzdHJpY3RcIlxuXG5pbXBvcnQgUG9pbnQgZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgU2hpcF9zaG90IGZyb20gXCIuL3NoaXBfc2hvdFwiO1xuaW1wb3J0IEVuZW15IGZyb20gXCIuL2VuZW15XCI7XG5pbXBvcnQgRW5lbXlfc2hvdCBmcm9tIFwiLi9lbmVteV9zaG90XCI7XG5cbmV4cG9ydCBsZXQgZ2xvYmFsID0ge1xuXHQkY2FudmFzOiBcIlwiLFxuXHRjb250ZXh0OiBcIlwiLFxuXHRjb3VudGVyOiAwLFxuXHRtb3VzZTogbmV3IFBvaW50KCksXG5cdHNoaXA6IHt9LFxuXHRzaGlwX3Nob3Q6IHt9LFxuXHRydW46IHRydWUsXG5cdGZwczogMTAwMCAvIDMwLFxuXHRmaXJlOiBmYWxzZSxcblx0ZW5lbXlfc2hvdDoge30sXG5cdHRleHQ6e1xuXHRcdHNjb3JlOiB7fSxcblx0XHRpbmZvOiB7XG5cdFx0XHRhbGlnbjogXCJjZW50ZXIgLHNhbnMtc2VyaWZcIixcblx0XHRcdGZvbnQ6IFwiMzBweCAn77yt77yzIOOCtOOCt+ODg+OCrydcIixcblx0XHRcdHN0eWxlOiBcInJnYigwLDAsMClcIixcblx0XHRcdHBvc2l0aW9uOiB7fVxuXHRcdH1cblx0fVxufVxuXG5jb25zdCBDT05TVEFOVCA9IHtcblx0Q0hBUkFfU0hPVF9NQVhfQ09VTlQ6IDUsXG5cdENIQVJBX0NPTE9SOiBcInJnYmEoMCwgMCwgMjU1LCAwLjc1KVwiLFxuXHRDSEFSQV9TSE9UX0NPTE9SOiBcInJnYmEoMCAsMjU1ICwwICwgMC43NSlcIixcblx0RU5FTVlfTUFYX0NPVU5UOiAxNSxcblx0RU5FTVlfU0hPVF9NQVhfQ09VTlQ6IDEwMCxcblx0RU5FTVlfQ09MT1I6IFwicmdiYSgyNTUsIDAsIDAsIDAuNzUpXCIsXG5cdEVORU1ZX1NIT1RfQ09MT1I6IFwicmdiYSgyNTUsIDAsIDI1NSwgMC43NSlcIlxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKXtcblx0Ly8gY2FudmFzIGluaXRcblx0Z2xvYmFsLiRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcblx0Z2xvYmFsLiRjYW52YXMud2lkdGggPSA1MDA7XG5cdGdsb2JhbC4kY2FudmFzLmhlaWdodCA9IDUwMDtcblxuXHRnbG9iYWwuY29udGV4dCA9IGdsb2JhbC4kY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHQvLyBldmVudFxuXHRnbG9iYWwuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlX21vdmUsIHRydWUpO1xuXHRnbG9iYWwuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlX2Rvd24sIHRydWUpO1xuXG5cdC8qaW5pdCovXG5cdC8vcG9zaXRpb25cblx0KGZ1bmN0aW9uICgpIHtcblx0XHRsZXQgeCA9IGdsb2JhbC4kY2FudmFzLndpZHRoIC8gMjtcblx0XHRsZXQgeSA9IGdsb2JhbC4kY2FudmFzLmhlaWdodCAvIDI7XG5cdFx0Z2xvYmFsLm1vdXNlLnggPSB4XG5cdFx0Z2xvYmFsLm1vdXNlLnkgPSB5XG5cdFx0Z2xvYmFsLnRleHQuaW5mby5wb3NpdGlvbi54ID0geDtcblx0XHRnbG9iYWwudGV4dC5pbmZvLnBvc2l0aW9uLnkgPSB5O1xuXHR9KSgpO1xuXHRcblx0Ly8gc2hpcFxuXHRnbG9iYWwuc2hpcCA9IG5ldyBTaGlwKCk7XG5cblx0Ly8gc2hpcCBzaG90XG5cdGdsb2JhbC5zaGlwX3Nob3QgPSBuZXcgQXJyYXkoQ09OU1RBTlRbXCJDSEFSQV9TSE9UX01BWF9DT1VOVFwiXSk7XG5cdGZvcihsZXQgaSA9IDA7IGkgPCBDT05TVEFOVFtcIkNIQVJBX1NIT1RfTUFYX0NPVU5UXCJdOyBpICs9IDEpe1xuXHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0gPSBuZXcgU2hpcF9zaG90KCk7XG5cdH1cblxuXHQvLyBlbmVteVxuXHRnbG9iYWwuZW5lbXkgPSBuZXcgQXJyYXkoQ09OU1RBTlRbXCJFTkVNWV9NQVhfQ09VTlRcIl0pO1xuXHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJFTkVNWV9NQVhfQ09VTlRcIl07IGkgKz0gMSl7XG5cdFx0Z2xvYmFsLmVuZW15W2ldID0gbmV3IEVuZW15KCk7XG5cdH1cblxuXHQvLyBlbmVteSBzaG90XG5cdGxldCBlbmVteV9zaG90ID0gbmV3IEFycmF5KENPTlNUQU5UW1wiRU5FTVlfU0hPVF9NQVhfQ09VTlRcIl0pO1xuXHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJFTkVNWV9TSE9UX01BWF9DT1VOVFwiXTsgaSArPSAxKXtcblx0XHRnbG9iYWwuZW5lbXlfc2hvdFtpXSA9IG5ldyBFbmVteV9zaG90KCk7XG5cdH1cblxuXHQvKmZwcyovXG5cdG1haW4oKTtcbn0pXG5cbmZ1bmN0aW9uIG1haW4gKCkge1xuXHRnbG9iYWwuY291bnRlciArPSAxO1xuXHQvLyBjbGVhclxuXHRnbG9iYWwuY29udGV4dC5jbGVhclJlY3QoMCwwLCBnbG9iYWwuJGNhbnZhcy53aWR0aCwgZ2xvYmFsLiRjYW52YXMuaGVpZ2h0KTtcblxuXHQvKnNoaXAgZHJhdyovXG5cdC8vIHN0YXJ0IHBhdGhcblx0Z2xvYmFsLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cblx0Ly8gc2hpcCBwb3NpdGlvblxuXHRnbG9iYWwuc2hpcC5wb3NpdGlvbi54ID0gZ2xvYmFsLm1vdXNlLng7XG5cdGdsb2JhbC5zaGlwLnBvc2l0aW9uLnkgPSBnbG9iYWwubW91c2UueTtcblxuXHQvL3Byb3BhcnR5XG5cdGdsb2JhbC5jb250ZXh0LmFyYyhcblx0XHRnbG9iYWwuc2hpcC5wb3NpdGlvbi54LFxuXHRcdGdsb2JhbC5zaGlwLnBvc2l0aW9uLnksXG5cdFx0Z2xvYmFsLnNoaXAuc2l6ZSxcblx0XHQwLFxuXHRcdE1hdGguUEkgKiAyXG5cdCk7XG5cblx0Ly8gZHJhd1xuXHRnbG9iYWwuY29udGV4dC5maWxsU3R5bGUgPSBDT05TVEFOVC5DSEFSQV9DT0xPUjtcblx0Z2xvYmFsLmNvbnRleHQuZmlsbCgpO1xuXG5cdC8qc2hpcCBzaG90IGRyYXcqL1xuXHQvLyBzZXRcblx0aWYoZ2xvYmFsLmZpcmUpe1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBDT05TVEFOVFtcIkNIQVJBX1NIT1RfTUFYX0NPVU5UXCJdOyBpICs9IDEpe1xuXHRcdFx0aWYoIWdsb2JhbC5zaGlwX3Nob3RbaV0uYWxpdmUpe1xuXHRcdFx0XHRnbG9iYWwuc2hpcF9zaG90W2ldLnNldChbZ2xvYmFsLnNoaXAucG9zaXRpb25dKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGdsb2JhbC5maXJlID0gZmFsc2U7XG5cdH1cblx0Ly8gc3RhcnQgcGF0aFxuXHRnbG9iYWwuY29udGV4dC5iZWdpblBhdGgoKTtcblxuXHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJDSEFSQV9TSE9UX01BWF9DT1VOVFwiXTsgaSArPSAxKXtcblx0XHRpZihnbG9iYWwuc2hpcF9zaG90W2ldLmFsaXZlKXtcblx0XHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0ubW92ZSgpO1xuXHRcdFx0Z2xvYmFsLmNvbnRleHQuYXJjKFxuXHRcdFx0XHRnbG9iYWwuc2hpcF9zaG90W2ldLnBvc2l0aW9uLngsXG5cdFx0XHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0ucG9zaXRpb24ueSxcblx0XHRcdFx0Z2xvYmFsLnNoaXBfc2hvdFtpXS5zaXplLFxuXHRcdFx0XHQwLFxuXHRcdFx0XHRNYXRoLlBJICogMixcblx0XHRcdFx0ZmFsc2Vcblx0XHRcdCk7XG5cdFx0XHRnbG9iYWwuY29udGV4dC5jbG9zZVBhdGgoKTtcblx0XHR9XG5cdH1cblx0Z2xvYmFsLmNvbnRleHQuZmlsbFN0eWxlID0gQ09OU1RBTlQuQ0hBUkFfU0hPVF9DT0xPUjtcblx0Z2xvYmFsLmNvbnRleHQuZmlsbCgpO1xuXG5cdC8qZW5lbXkgZHJhdyovXG5cdC8vIHNlZW4gYnJhbmNoXG5cdHN3aXRjaCh0cnVlKXtcblx0XHRjYXNlIGdsb2JhbC5jb3VudGVyIDwgNTA6XG5cdFx0XHRkaXNwbGF5X3RleHQoZ2xvYmFsLnRleHQuaW5mbywgXCJSRUFEWVwiKTtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBnbG9iYWwuY291bnRlciA8IDgwOlxuXHRcdFx0ZGlzcGxheV90ZXh0KGdsb2JhbC50ZXh0LmluZm8sIFwiR09cIik7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHQvLyBzZXRcblx0XHRcdGlmKGdsb2JhbC5jb3VudGVyICUgNTAgPT09IDApe1xuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJFTkVNWV9NQVhfQ09VTlRcIl07IGkgKz0gMSl7XG5cdFx0XHRcdFx0aWYoIWdsb2JhbC5lbmVteVtpXVtcImFsaXZlXCJdKXtcblx0XHRcdFx0XHRcdGxldCBqID0gKGdsb2JhbC5jb3VudGVyICUgMTAwKSAvIDUwO1xuXG5cdFx0XHRcdFx0XHQvLyB0eXBlXG5cdFx0XHRcdFx0XHRsZXQgZW5lbXlfc2l6ZSA9IDE1O1xuXHRcdFx0XHRcdFx0bGV0IHAgPSB7fTtcblx0XHRcdFx0XHRcdHAueCA9IGdsb2JhbC4kY2FudmFzLndpZHRoIC8gMyAqIDI7XG5cdFx0XHRcdFx0XHRwLnkgPSAtZW5lbXlfc2l6ZSArIChnbG9iYWwuJGNhbnZhcy5oZWlnaHQgKyBlbmVteV9zaXplICogMikgKiBqO1xuXG5cdFx0XHRcdFx0XHRnbG9iYWwuZW5lbXlbaV0uc2V0KFtwLCBlbmVteV9zaXplLCBqXSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gZHJhd1xuXHRcdFx0Z2xvYmFsLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cblx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBDT05TVEFOVFtcIkVORU1ZX01BWF9DT1VOVFwiXTsgaSArPSAxKXtcblx0XHRcdFx0aWYoZ2xvYmFsLmVuZW15W2ldLmFsaXZlKXtcblx0XHRcdFx0XHRnbG9iYWwuZW5lbXlbaV0ubW92ZSgpO1xuXHRcdFx0XHRcdGdsb2JhbC5jb250ZXh0LmFyYyhcblx0XHRcdFx0XHRcdGdsb2JhbC5lbmVteVtpXS5wb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0Z2xvYmFsLmVuZW15W2ldLnBvc2l0aW9uLnksXG5cdFx0XHRcdFx0XHRnbG9iYWwuZW5lbXlbaV0uc2l6ZSxcblx0XHRcdFx0XHRcdDAsXG5cdFx0XHRcdFx0XHRNYXRoLlBJICogMixcblx0XHRcdFx0XHRcdGZhbHNlXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdC8vIHNldCBzaG90IGluZm9cblx0XHRcdFx0XHRpZihnbG9iYWwuZW5lbXlbaV0ucGFyYW0gJSAxNSA9PT0gMCl7XG5cdFx0XHRcdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgQ09OU1RBTlRbXCJFTkVNWV9TSE9UX01BWF9DT1VOVFwiXTsgaiArPSAxKXtcblx0XHRcdFx0XHRcdFx0aWYoIWdsb2JhbC5lbmVteV9zaG90W2pdLmFsaXZlKXtcblx0XHRcdFx0XHRcdFx0XHRsZXQgcCA9IGdsb2JhbC5lbmVteVtpXS5wb3NpdGlvbi5kaXN0YW5jZShnbG9iYWwuc2hpcC5wb3NpdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0cC5ub3JtYWxpemUoKTtcblx0XHRcdFx0XHRcdFx0XHRnbG9iYWwuZW5lbXlfc2hvdFtqXS5zZXQoW2dsb2JhbC5lbmVteVtpXS5wb3NpdGlvbiwgcCwgNSwgNV0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2xvYmFsLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdFx0XHR9XG5cdFx0XHRnbG9iYWwuY29udGV4dC5maWxsU3R5bGUgPSBDT05TVEFOVC5FTkVNWV9DT0xPUjtcblx0XHRcdGdsb2JhbC5jb250ZXh0LmZpbGwoKTtcblxuXHRcdFx0LypzaG90Ki9cblx0XHRcdGdsb2JhbC5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgQ09OU1RBTlRbXCJFTkVNWV9TSE9UX01BWF9DT1VOVFwiXTsgaSArPSAxKXtcblx0XHRcdFx0aWYoZ2xvYmFsLmVuZW15X3Nob3RbaV0uYWxpdmUpe1xuXHRcdFx0XHRcdGdsb2JhbC5lbmVteV9zaG90W2ldLm1vdmUoKTtcblx0XHRcdFx0XHRnbG9iYWwuY29udGV4dC5hcmMoXG5cdFx0XHRcdFx0XHRnbG9iYWwuZW5lbXlfc2hvdFtpXS5wb3NpdGlvbi54LFxuXHRcdFx0XHRcdFx0Z2xvYmFsLmVuZW15X3Nob3RbaV0ucG9zaXRpb24ueSxcblx0XHRcdFx0XHRcdGdsb2JhbC5lbmVteV9zaG90W2ldLnNpemUsXG5cdFx0XHRcdFx0XHQwLFxuXHRcdFx0XHRcdFx0TWF0aC5QSSAqIDIsXG5cdFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Z2xvYmFsLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdFx0XHR9XG5cdFx0XHRnbG9iYWwuY29udGV4dC5maWxsU3R5bGUgPSBDT05TVEFOVC5FTkVNWV9TSE9UX0NPTE9SO1xuXHRcdFx0Z2xvYmFsLmNvbnRleHQuZmlsbCgpO1xuXG5cdFx0XHQvKmNvbGxpc2lvbiBkZXRlY3Rpb24qL1xuXHRcdFx0Ly8gc2hpcCBzaG90IGFuZCBlbmVteVxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IENPTlNUQU5ULkNIQVJBX1NIT1RfTUFYX0NPVU5UOyBpICs9IDEpe1xuXHRcdFx0XHRpZihnbG9iYWwuc2hpcF9zaG90W2ldLmFsaXZlKXtcblx0XHRcdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgQ09OU1RBTlQuRU5FTVlfTUFYX0NPVU5UOyBqICs9IDEpe1xuXHRcdFx0XHRcdFx0Ly8gZW5lbXnjgahzaGlwIHNob3Tjga7ot53pm6LjgpLoqIjnrpdcblx0XHRcdFx0XHRcdGxldCBwID0gZ2xvYmFsLnNoaXBfc2hvdFtpXS5wb3NpdGlvbi5kaXN0YW5jZShnbG9iYWwuZW5lbXlbal0ucG9zaXRpb24pO1xuXHRcdFx0XHRcdFx0aWYocC5sZW5ndGgoKSA8IGdsb2JhbC5lbmVteVtqXS5zaXplKXtcblx0XHRcdFx0XHRcdFx0Z2xvYmFsLmVuZW15W2pdLmFsaXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdGdsb2JhbC5zaGlwX3Nob3RbaV0gPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9yKGxldCBpID0gMDsgaSA8IENPTlNUQU5ULkVORU1ZX1NIT1RfTUFYX0NPVU5UOyBpICs9IDEpe1xuXHRcdFx0XHRpZihnbG9iYWwuZW5lbXlfc2hvdFtpXS5hbGl2ZSl7XG5cdFx0XHRcdFx0bGV0IHAgPSBnbG9iYWwuc2hpcC5wb3NpdGlvbi5kaXN0YW5jZShnbG9iYWwuZW5lbXlfc2hvdFtpXS5wb3NpdGlvbik7XG5cdFx0XHRcdFx0aWYocC5sZW5ndGgoKSA8IGdsb2JhbC5zaGlwLnNpemUpe1xuXHRcdFx0XHRcdFx0Z2xvYmFsLnJ1biA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0ZGlzcGxheV90ZXh0KGdsb2JhbC50ZXh0LmluZm8sIFwiR0FNRSBPVkVSISFcIik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0fVxuXHRpZihnbG9iYWwucnVuKXtcblx0XHRzZXRUaW1lb3V0KG1haW4sIGdsb2JhbC5mcHMpO1xuXHR9XG5cbn1cblxuZnVuY3Rpb24gbW91c2VfbW92ZSAoZSkge1xuXHQvLyBUT0RPOiBsZWFyblxuXHRpZihnbG9iYWwuY291bnRlciA8IDgwKSByZXR1cm47XG5cdGdsb2JhbC5tb3VzZS54ID0gZS5jbGllbnRYIC0gZ2xvYmFsLiRjYW52YXMub2Zmc2V0TGVmdDtcblx0Z2xvYmFsLm1vdXNlLnkgPSBlLmNsaWVudFkgLSBnbG9iYWwuJGNhbnZhcy5vZmZzZXRUb3A7XG59XG5cbmZ1bmN0aW9uIG1vdXNlX2Rvd24gKCkge1xuXHRpZihnbG9iYWwuY291bnRlciA8IDgwKSByZXR1cm47XG5cdGdsb2JhbC5maXJlID0gdHJ1ZVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5X3RleHQgKG9iaix0ZXh0KSB7XG5cdGxldCB4LHk7XG5cdGZvcihsZXQgcHJvcCBpbiBvYmope1xuXHRcdHN3aXRjaCAocHJvcCl7XG5cdFx0XHRjYXNlIFwic3R5bGVcIjpcblx0XHRcdFx0Z2xvYmFsLmNvbnRleHQuZmlsbFN0eWxlID0gb2JqW3Byb3BdO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImFsaWduXCI6XG5cdFx0XHRcdGdsb2JhbC5jb250ZXh0LnRleHRBbGlnbiA9IG9ialtwcm9wXTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJmb250XCI6XG5cdFx0XHRcdGdsb2JhbC5jb250ZXh0LmZvbnQgPSBvYmpbcHJvcF07XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwicG9zaXRpb25cIjpcblx0XHRcdFx0eCA9IG9ialtwcm9wXS54O1xuXHRcdFx0XHR5ID0gb2JqW3Byb3BdLnk7XG5cdFx0fVxuXHR9XG5cdGdsb2JhbC5jb250ZXh0LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xufSIsImltcG9ydCBQb2ludCBmcm9tIFwiLi9jb21tb25cIjtcblxuY2xhc3MgU2hpcHtcblx0Y29uc3RydWN0b3Ioc2l6ZSl7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBQb2ludCgpO1xuXHRcdHRoaXMuc2l6ZSA9IHNpemUgPyBzaXplOiAxMDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7IiwiaW1wb3J0IHtnbG9iYWx9IGZyb20gXCIuL21haW5cIjtcbmltcG9ydCBQb2ludCBmcm9tIFwiLi9jb21tb25cIjtcblxuY2xhc3MgU2hpcF9zaG90e1xuXHRjb25zdHJ1Y3RvcihzaXplKXtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0dGhpcy5zaXplID0gc2l6ZSA/IHNpemUgOiAzO1xuXHRcdHRoaXMuc3BlZWQgPSAxMDtcblx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XG5cdH1cblx0c2V0KGxpKXtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgMzsgaSs9MSl7XG5cdFx0XHRpZih0eXBlb2YgbGlbaV0gPT09IFwidW5kZWZpbmVkXCIpIGJyZWFrO1xuXG5cdFx0XHRzd2l0Y2ggKGkpe1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0dGhpcy5wb3NpdGlvbi54ID0gbGlbaV1bXCJ4XCJdO1xuXHRcdFx0XHRcdHRoaXMucG9zaXRpb24ueSA9IGxpW2ldW1wieVwiXTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0dGhpcy5zaXplID0gbGlbaV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHRoaXMuc3BlZWQgPSBsaVtpXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5hbGl2ZSA9IHRydWU7XG5cdH1cblx0bW92ZSgpe1xuXHRcdHRoaXMucG9zaXRpb24ueCA9IHRoaXMucG9zaXRpb24ueCArIHRoaXMuc3BlZWQ7XG5cdFx0aWYodGhpcy5wb3NpdGlvbi54ID4gdGhpcy5zaXplICsgZ2xvYmFsLiRjYW52YXMud2lkdGgpe1xuXHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXBfc2hvdDsiXX0=
