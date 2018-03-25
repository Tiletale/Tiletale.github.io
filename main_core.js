var gm = g4m.grapicsManager,
	pm = g4m.positionManager,
	ajax = new XMLHttpRequest;
ajax.open('GET', "localization/languages.json", false);

ajax.onload = function () {
	json = JSON.parse(ajax.responseText);
}

ajax.send();
var width = 800;
var height = 500;
var all_languages = json;
var ru = 'ru-RU';
var en = 'en-EN';
name = 'Аноним Анонимов';
lang = en;
var switchChapter = function (chapter) {
	var chapterSwitcher = g4m.newScene([width, height], "chapterSwitcher", "background-color: black");	

	console.log(chapter);

	var txt = g4m.newObject({
		type: 'txt',
		value: all_languages[lang].chapterText + chapter + ' - ' + all_languages[lang].cut.chapter[chapter].title,
		position: pm.pos([350, 350]),
		class: "simpleText"
	});

	setTimeout(function () {
		gm.hide(txt, 100);
		setTimeout(chapterSwitcher.remove, 1000);
	}, 3500);

	chapterSwitcher.insertObject(txt);

	chapterSwitcher.startScene();
}
var cut = function (who, message, chapter, part, id, mode, func, scene) {
	if (mode == 'full') {
		var cutScene = g4m.newScene([width, height], "cutScene" + id, "background-color: black");

		var txt = g4m.newObject({
			type: 'txt',
			value: [
				'[' + who + ']',
				message
			],
			position: pm.pos([300, 300]),
			class: 'simpleText'
		});

		var next = g4m.newObject({
			type: 'txt',
			value: all_languages[lang].cut['nextBtn'],
			position: pm.pos([300, 100]),
			class: 'simpleText'
		});

		next.click(function () {
			var id1 = parseInt(id) + 1;
			if (all_languages[lang].cut.chapter[chapter][part][id1]) {
				cut(all_languages[lang].cut.chapter[chapter][part][id1].who, all_languages[lang].cut.chapter[chapter][part][id1].message, chapter, part, String(id1), 'full', func);
				console.log(all_languages[lang].cut.end1 + id + all_languages[lang].cut.end2 + part + all_languages[lang].cut.end3 + chapter + all_languages[lang].cut.end4);
				cutScene.remove();
			}else {
				cutScene.remove();
				func();
			}
		});

		cutScene.insertObject(next);

		cutScene.insertObject(txt);

		cutScene.startScene();
	}else if (scene && mode == 'mini') {
		var txt = g4m.newObject({
			type: 'txt',
			value: [
				'[' + who + ']',
				message
			],
			position: pm.pos([300, 0]),
			class: 'simpleText'
		});
		var next = g4m.newObject({
			type: 'txt',
			value: all_languages[lang].cut['nextBtn'],
			position: pm.pos([300, 100]),
			class: 'simpleText'
		});

		next.click(function () {
			var id1 = parseInt(id) + 1;
			if (all_languages[lang].cut.chapter[chapter][part][id1]) {
				cut(all_languages[lang].cut.chapter[chapter][part][id1].who, all_languages[lang].cut.chapter[chapter][part][id1].message, chapter, part, String(id1), 'mini', func, scene);
				console.log(all_languages[lang].cut.end1 + id + all_languages[lang].cut.end2 + part + all_languages[lang].cut.end3 + chapter + all_languages[lang].cut.end4);
				txt.remove();
				next.remove();
			}else {
				txt.remove();
				next.remove();
				func();
			}
		});
		scene.insertObject(next);

		scene.insertObject(txt);
	}
}

var game = function () {
	//Intro
	switchChapter('0');
	setTimeout(function () {
		cut(all_languages[lang].cut.chapter['0']['1'][1].who, all_languages[lang].cut.chapter['0']['1'][1].message, '0', '1', '1', 'full', function () {
			var scene6 = g4m.newScene([width, height], "gameEventChapter1", "background-color: black");

			var player = g4m.newObject({
				type: 'rect',
				position: pm.pos([0, 0]),
				bg_color: 'white',
				size: [50, 50]
			});

			scene6.insertObject(player);

			cut(all_languages[lang].cut.chapter['0']['2'][1].who, all_languages[lang].cut.chapter['0']['2'][1].message, '0', '2', '1', 'mini', function () {
				gm.hide(scene6, 100);
				setTimeout(function () {
					switchChapter('1');
				}, 1000);
			}, scene6);

			scene6.startScene();
		});
	}, 6000);
}
var preloader = function () {
	var scene2 = g4m.newScene([width, height], "preloader", 'background-color: black');

	var options = {
		type: 'txt',
		attrs: '[{"name":"id", "val":"progress"}]',
		style: 'color: white; font-size: 25px; font-weight: bold; font-family: "Montserrat";',
		position: pm.pos([300, 250]),
		value: all_languages[lang].loadingText + '...'
	};

	txt = g4m.newObject(options);

	scene2.insertObject(txt);

	var i = 0;
	var loading = setInterval(function () {
		i++;
		options.value = [all_languages[lang].loadingText + '...', all_languages[lang].loadedText + ' ' + i + '%'];
		txt.remove();
		txt = g4m.newObject(options);
		scene2.insertObject(txt);
		if (i >= 100) {
			setTimeout(function () {
				gm.hide(scene2, 100);
				setTimeout(game, 1000);
			}, 1500);
			clearInterval(loading);
		}
	}, 1000/80);

	scene2.startScene();
}
var options = function () {
	var scene4 = g4m.newScene([width, height], "options", 'background-color: black');

	var back = g4m.newObject({
		type: 'txt',
		value: all_languages[lang].backBtn,
		position: pm.pos([0, 0]),
		class: 'menu_item'
	});

	var lan = g4m.newObject({
		type: 'txt',
		value: all_languages[lang].langBtn + ':',
		position: pm.pos([350, 400]),
		class: 'simpleText'
	});

	var lanru = g4m.newObject({
		type: 'txt',
		value: "Русский",
		position: pm.pos([350, 350]),
		class: 'menu_item'
	});

	var lanen = g4m.newObject({
		type: 'txt',
		value: "English",
		position: pm.pos([350, 300]),
		class: 'menu_item'
	});

	back.click(function () {
		scene4.remove();
		menu();
	});

	lanru.click(function () {
		lang = ru;
	});

	lanen.click(function () {
		lang = en;
	});

	scene4.insertObject(back);
	scene4.insertObject(lan);
	scene4.insertObject(lanru);
	scene4.insertObject(lanen);

	scene4.startScene();
};
var credits = function () {
	var scene4 = g4m.newScene([width, height], "credits", 'background-color: black');

	var back = g4m.newObject({
		type: 'txt',
		value: all_languages[lang].backBtn,
		position: pm.pos([0, 0]),
		class: 'menu_item'
	}),
		texts = g4m.newObject({
			type: 'txt',
			value: all_languages[lang].creditsText,
			position: pm.pos([50, 300]),
			class: 'simpleText'
		});

	back.click(function () {
		scene4.remove();
		menu();
	});

	scene4.insertObject(back);

	scene4.insertObject(texts);

	scene4.startScene();


};
var menu = function () {
	var scene3 = g4m.newScene([width, height], "mainMenu", 'background-color: black');

	var objs = [];
	var res = [];
	objs['hello'] = {
		type: 'txt',
		value: all_languages[lang].hello + name,
		position: pm.pos([0, 475]),
		class: 'simpleText'
	};
	objs['title'] = {
		type: 'txt',
		value: 'Fourth dimension',
		position: pm.pos([250, 400]),
		class: 'menu_title'
	};
	objs['play'] = {
		type: 'txt',
		value: all_languages[lang].playBtn,
		position: pm.pos([350, 300]),
		class: 'menu_item'
	};
	objs['options'] = {
		type: 'txt',
		value: all_languages[lang].optionsBtn,
		position: pm.pos([325, 200]),
		class: 'menu_item'
	};
	objs['credits'] = {
		type: 'txt',
		value: all_languages[lang].creditsBtn,
		position: pm.pos([325, 100]),
		class: 'menu_item'
	};

	for (i in objs) {
		res[i] = g4m.newObject(objs[i]);
		scene3.insertObject(res[i]);
	}

	res['play'].click(function () {
		scene3.remove();
		preloader();
	});

	res['options'].click(function () {
		scene3.remove();
		options();
	});

	res['credits'].click(function () {
		scene3.remove();
		credits();
	});

	scene3.startScene();
}
var preloader2 = function () {
	var scene5 = g4m.newScene([width, height], "gamePreloader", 'background-color: white');
	clicked = false;

	var txt = g4m.newObject({
		type: 'txt',
		value: all_languages[lang].translateText,
		position: pm.pos([0, 300]),
		class: "simpleText",
		style: "color: black"
	});

	scene5.insertObject(txt);

	scene5.startScene();

	scene5.addEventListener('click', function () {
		scene5.remove();
		menu();
		clicked = true;
		scene5.removeEventListener('click', function () {
			scene5.remove();
			menu();
			clicked = true;
		}, false);
	}, false);

	setTimeout(function() {
		if (!clicked) {
			gm.hide(scene5, 250);
			setTimeout(menu, 2750);
		}
	}, 3500);
}
preloader2();