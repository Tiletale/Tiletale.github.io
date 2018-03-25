var g4m_core = function () {
	this.fullscreen = [window.innerWidth, window.innerHeight];
	this.newScene = function (wh, name, style) {
		el = document.createElement('div');
		var stylee = 'height: ' + wh[1] + 'px; width: ' + wh[0] + 'px; position: relative; ';
		if(style) stylee += style;
		el.setAttribute('style', stylee);
		el.className = 'g4m_scene';
		el.loop_list = [];
		el.id = name;
		setInterval(function () {
			el.time += 1;
		}, 1);
		el.name = name;
		el.startScene = function () {
			document.body.appendChild(el);
		};
		el.newLoop = function (func, id, interval) {
			el.loop_list[id] = [func, interval];
		}
		el.startLoop = function (id) {
			setInterval(el.loop_list[id][0], el.loop_list[id][1]);
		}
		el.insertObject = function (obj) {
			el.appendChild(obj);
		}
		el.keyDown = function (keycode, func) {
			window.addEventListener('keydown', function (e) {
				if (e.key == keycode) {
					func();
				}
			}, false);
		}
		el.removeScene = function () {
			el.parentNode.removeChild(el);
		}
		el.getTime = function () {
			return el.time;
		}
		return el;
	};
	this.newObject = function (obj) {
		var stylee = '';
		if (obj.type == 'rect') {
			tag = 'div';
		}else if (obj.type == 'image') {
			tag = 'img';
		}else if (obj.type == 'txt')
			tag = 'text';
		else if (obj.type == 'btn') {
			tag = 'button';
		}
		var el = document.createElement(tag);
		el.click = function (func) {
			el.addEventListener('click', func, false);
		}
		if (obj.size) {
			stylee += 'width: ' + obj.size[0] + 'px; height: ' + obj.size[1] + 'px; ';
		}
		if (obj.src) {
			el.src = obj.src;
		}
		if (obj.value) {
			if (Array.isArray(obj.value)) {
				for (var i = 0; i < obj.value.length; i++) {
					el.innerHTML += obj.value[i] + '<br />';
				}
			}else{
				el.innerHTML = obj.value;
			}
		}
		if(obj.bg_color)
			stylee += 'background-color: ' + obj.bg_color + '; ';
		stylee += 'position: absolute; ' + obj.position + ' ';
		if (obj.style) {
			stylee += obj.style;
		}
		if (obj.class)
			el.className = obj.class;
		if (obj.id)
			el.id = obj.id;
		el.setAttribute('style', stylee);
		el.remove = function () {
			el.parentNode.removeChild(el);
		}
		if (obj.attrs) {
			var attrs = JSON.parse('{"attrs":' + obj.attrs + '}');
			for (var i = attrs.attrs.length - 1; i >= 0; i--) {
				el.setAttribute(attrs.attrs[i].name, attrs.attrs[i].val);
			}
		}
		return el;
	};
	this.positionManager = new Object;
	this.positionManager.pos = function (arr) {
		return 'bottom: ' + arr[1] + 'px; left: ' + arr[0] + 'px;';
	}
	this.grapicsManager = new Object;
	this.grapicsManager.hide = function (el, speed) {
		el.style.opacity = 1;
		var int = setInterval(function () {
			el.style.opacity -= .1;
			if (el.style.opacity == 0) {
				el.parentNode.removeChild(el);
				clearInterval(int);
			}
		}, speed);
	}
}
var g4m = new g4m_core();