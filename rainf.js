/*!
 * rainf.js v0.0.1
 * 2018 (c) - ahmadtawakol
 *
 * Forked from Fuxy526/snowf
 * 2017 (c) - Fuxy526
 *
 * Released under the MIT License.
 */
;(function(root, factory) {

	// CommonJS support
	if (typeof module === 'object' && module.exports) module.exports = factory();
	// AMD support
	else if (typeof define === 'function' && define.amd) define(factory);
	// Browser global
	else root.rainf = factory();


})(this, function() {

	var PLUGIN_NAME = 'rainf';
	var VERSION = '0.0.1';
	var config = {};
	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60);};
	var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || function(callback) { window.clearTimeout(callback);};
  var paused = false;

	// default options
	var defaults = {
		dom: document.body,   // HTMLDomElement or String
		amount: 100,           // Number
		size: 1,              // Numebr
		speed: 45,           // Number
		color: '#fff',        // String
		opacity: 0.5,         // Number
		zIndex: null,         // Number
	};

	function Rainf(opt) {
		this.options = extend({}, defaults, config, opt);
	}

	/**
	 * Set propertys, create elements and init rain effect.
	 * @public
	 */
	Rainf.prototype.init = function() {
		if (this.canvas) return this;

		var o = this.options;
		this.dom = type(o.dom) === 'string' ? document.querySelector(o.dom) : o.dom;
		this.canvas = createEl('canvas', { className: PLUGIN_NAME + '-canvas' });
		css(this.canvas, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'});
		if (o.zIndex) css(this.canvas, { zIndex: o.zIndex});
		this.dom.appendChild(this.canvas);
		this.height = this.canvas.height = this.canvas.offsetHeight;
		this.width = this.canvas.width = this.canvas.offsetWidth;
		this.context = this.canvas.getContext('2d');
		this.drops = [];
		this.animationFrame = null;

		return this.reset();
	};

	/**
	 * Reset the rain effect.
	 * @public
	 */
	Rainf.prototype.reset = function() {

		var self      = this,
				o         = self.options,
				dom       = self.dom,
				canvas    = self.canvas,
				ctx       = self.context,
				drops    = self.drops = [];

		function _init() {
			for (var i = 0; i < o.amount; i++) {
        var height = random(16*o.size, 32*o.size);
				drops.push({
					x: random(0, self.width),
					y: random((self.height/5)*-1, height*-1),
					width: o.size,
					height: height,
					velY: o.speed,
					opacity: o.opacity
				});
			}
			_rain();
		}

		function _rain() {
			var img;
			ctx.clearRect(0, 0, self.width, self.height);
			for (var i = 0; i < o.amount; i++) {
				var drop = drops[i];

				ctx.fillStyle = 'rgba(' + getRgb(o.color) + ',' + drop.opacity + ')';
				ctx.fillRect(drop.x, drop.y, drop.width, drop.height);

        drop.velY += 0.4;
				drop.y += Math.pow(1.05, drop.velY);

				if (!paused && (drop.y > self.height + drop.height || drop.y < -drop.height)) {
					_reset(drop);
				}
			}
			self.animationFrame = requestAnimationFrame(_rain);
		}

		function _reset(drop) {
      var height = random(16*o.size, 32*o.size);
			drop.width = o.size;
			drop.x = random(0, self.width);
			drop.y = random((self.height/5)*-1, height*-1);
			drop.velY = o.speed;
			drop.opacity = o.opacity;
      drop.height = height;
		}

		cancelAnimationFrame(self.animationFrame);
		_init();
		return this;
	};

  /**
	 * Pause raindrops.
	 * @public
	 */
	Rainf.prototype.pause = function() {
    paused = true;
	};

  /**
   * Start raindrops.
   * @public
   */
  Rainf.prototype.play = function() {
    paused = false;
	};

	/**
	 * Set options and reset raindrops.
	 * @public
	 * @param {Object} opt
	 */
	Rainf.prototype.setOptions = function(opt) {
		extend(this.options, opt);
		return this.reset();
	};

	/**
	 * Change the speed of the rain
	 * @public
	 * @param {Number} speed
	 */
	Rainf.prototype.speed = function(speed) {
		var o = this.options, prevSpeed = o.speed;
		o.speed = speed;
		for (var i = 0; i < o.amount; i++) {
			this.drops[i].velY *= speed / prevSpeed;
		}
		return this;
	};

	/**
	 * Adjust window size (use with window.onresize)
	 * @public
	 */
	Rainf.prototype.resize = function() {
		var o  = this.options,
				H0 = this.canvas.height,
				W0 = this.canvas.width,
				H1 = this.dom.offsetHeight,
				W1 = this.dom.offsetWidth;

		this.canvas.height = this.height = H1;
		this.canvas.width = this.width = W1;
		for (var i = 0; i < o.amount; i++) {
			var drop = this.drops[i];
			drop.x = drop.x / W0 * W1;
			drop.y = drop.y / H0 * H1;
		}
		return this;
	};

	// Utility functions

	/**
	 * Extend an object.
	 * @private
	 */
	function extend() {
		var a = arguments;
		for (var i = 1, l = a.length; i < l; i++) {
			for (var p in a[i]) a[0][p] = a[i][p];
		}
		return a[0];
	}

	/**
	 * Get type of an object.
	 * @param {Any} o
	 * @private
	 */
	function type(o) {
		return Object.prototype.toString.call(o).toLowerCase().match(/\[object (\S*)\]/)[1];
	}

	/**
	 * Create an element.
	 * @param {String} tag
	 * @param {Object} props
	 * @private
	 */
	function createEl(tag, props) {
		var el = document.createElement(tag);
		for (var prop in props) {
			el[prop] = props[prop];
		}
		return el;
	}

	/**
	 * Set styles.
	 * @param {HTMLDomElement} el
	 * @param {Object} style
	 * @private
	 */
	function css(el, style) {
		return extend(el.style, style);
	}

	/**
	 * Get a random number in a range.
	 * @param {Number} min
	 * @param {Number} max
	 * @private
	 */
	function random(min, max) {
		var delta = max - min;
		return max === min ? min : Math.random() * delta + min;
	}

	/**
	 * Get rgb color.
	 * @param {String} str
	 * @private
	 */
	function getRgb(str) {
		var rgb = '';
		if (str.indexOf('#') === 0) {
			rgb = str.length === 4 ? str.substr(1).split('').map(function(n) {return parseInt(n.concat(n), 16);}).join(',') :
						str.length === 7 ? [str.substr(1,2), str.substr(3,2), str.substr(5,2)].map(function(n) {return parseInt(n, 16);}).join(',') :
						'255,255,255';
		}
		else if (str.indexOf('rgb(') === 0) {
			rgb = str.substring(4, str.length - 1);
		}
		else {
			rgb = '255,255,255';
		}
		return rgb;
	}

	var rainf = {
		version: VERSION,
		init: function(opt) {
			return new Rainf(opt).init();
		},
		config: function(conf) {
			config = conf;
		}
	};

	return rainf;

});
