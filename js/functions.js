var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
$(function () {
	$loveHeart = $("#loveHeart");
	var a = $loveHeart.width() / 2;
	var b = $loveHeart.height() / 2 - 55;
	$garden = $("#garden");
	gardenCanvas = $garden[0];
	gardenCanvas.width = $("#loveHeart").width();
	gardenCanvas.height = $("#loveHeart").height();
	gardenCtx = gardenCanvas.getContext("2d");
	gardenCtx.globalCompositeOperation = "lighter";
	garden = new Garden(gardenCtx, gardenCanvas);
	$("#content").css("width", $loveHeart.width() + $("#code").width());
	$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
	$("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2 - 50, 10));
	$("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));
	setInterval(function () {
		garden.render()
	}, Garden.options.growSpeed)

	// 移动端布局适配
	if (clientWidth <= 768) {
		$("#content").css({
			"flex-direction": "column",
			"width": "95%",
			"height": "auto"
		});
		$("#loveHeart").css({"order": -1}); // 心形置顶
	} else {
		// 桌面端原有布局
		$("#content").css("width", $loveHeart.width() + $("#code").width());
		$("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
	}

	// 2. 心形尺寸自适应
	var heartSizeRatio = clientWidth <= 768 ? 0.6 : 1; // 移动端缩小比例
	var a = $loveHeart.width() / 2 * heartSizeRatio;
	var b = $loveHeart.height() / 2 - 55 * heartSizeRatio;

	// 3. 窗口resize优化（移除强制刷新）
	$(window).resize(function () {
		if (clientWidth !== $(window).width() || clientHeight !== $(window).height()) {
			// 仅重新计算尺寸，不刷新页面
			adjustLayout();
		}
	});

	function adjustLayout() {
		// 重新计算心形位置和画布尺寸
		gardenCanvas.width = $("#loveHeart").width();
		gardenCanvas.height = $("#loveHeart").height();
		// ...其他尺寸调整...
	}

	// 移动端心形比例动态计算
	function calculateHeartSize() {
		const screenWidth = $(window).width();
		let heartWidth, heartHeight;

		if (screenWidth <= 768) {
			// 移动端：取屏幕宽度90%与最大宽度400px的较小值
			heartWidth = Math.min(screenWidth * 0.9, 400);
			heartHeight = heartWidth * (620 / 670); // 保持原始比例
		} else {
			// 桌面端：保持原始尺寸
			heartWidth = 670;
			heartHeight = 620;
		}

		// 应用尺寸
		$loveHeart.css({
			width: heartWidth + 'px',
			height: heartHeight + 'px'
		});

		// 同步画布尺寸
		gardenCanvas.width = heartWidth;
		gardenCanvas.height = heartHeight;

		// 重新计算偏移量（居中基准点）
		offsetX = heartWidth / 2;
		offsetY = heartHeight / 2 - 55 * (heartWidth / 670); // 按比例调整Y偏移
	}

	// 初始化时计算
	calculateHeartSize();

	// 窗口resize时重新计算
	$(window).resize(function() {
		calculateHeartSize();
		garden.render(); // 重绘花园
	});

	// 添加触摸事件防止误触
	$("#loveHeart").on("touchmove", function(e) {
		e.preventDefault(); // 防止页面滚动
	});
});
// 5. 移动端花朵密度调整
Garden.options.density = clientWidth <= 768 ? 5 : 10; // 降低移动端密度
Garden.options.bloomRadius = {min: 5, max: 8}; // 缩小花朵尺寸
$(window).resize(function () {
	var b = $(window).width();
	var a = $(window).height();
	if (b != clientWidth && a != clientHeight) {
		location.replace(location)
	}
});

function getHeartPoint(c) {
	const ratio = $("#loveHeart").width() / 670; // 基于原始宽度的缩放比例
	var b = c / Math.PI;
	var a = 19.5 * ratio * (16 * Math.pow(Math.sin(b), 3));
	var d = -20 * ratio * (13 * Math.cos(b) - 5 * Math.cos(2 * b) - 2 * Math.cos(3 * b) - Math.cos(4 * b));
	return new Array(offsetX + a, offsetY + d);
}

function startHeartAnimation() {
	var c = 50;
	var d = 10;
	var b = new Array();
	var a = setInterval(function () {
		var h = getHeartPoint(d);
		var e = true;
		for (var f = 0; f < b.length; f++) {
			var g = b[f];
			var j = Math.sqrt(Math.pow(g[0] - h[0], 2) + Math.pow(g[1] - h[1], 2));
			if (j < Garden.options.bloomRadius.max * 1.3) {
				e = false;
				break
			}
		}
		if (e) {
			b.push(h);
			garden.createRandomBloom(h[0], h[1])
		}
		if (d >= 30) {
			clearInterval(a);
			showMessages()
		} else {
			d += 0.2
		}
	}, c)
}

(function (a) {
	a.fn.typewriter = function () {
		this.each(function () {
			var d = a(this), c = d.html(), b = 0;
			d.html("");
			var e = setInterval(function () {
				var f = c.substr(b, 1);
				if (f == "<") {
					b = c.indexOf(">", b) + 1
				} else {
					b++
				}
				d.html(c.substring(0, b) + (b & 1 ? "_" : ""));
				if (b >= c.length) {
					clearInterval(e)
				}
			}, 75)
		});
		return this
	}
})(jQuery);

function timeElapse(c) {
	var e = Date();
	var f = (Date.parse(e) - Date.parse(c)) / 1000;
	var g = Math.floor(f / (3600 * 24));
	f = f % (3600 * 24);
	var b = Math.floor(f / 3600);
	if (b < 10) {
		b = "0" + b
	}
	f = f % 3600;
	var d = Math.floor(f / 60);
	if (d < 10) {
		d = "0" + d
	}
	f = f % 60;
	if (f < 10) {
		f = "0" + f
	}
	var a = '<span class="digit">' + g + '</span> days <span class="digit">' + b + '</span> hours <span class="digit">' + d + '</span> minutes <span class="digit">' + f + "</span> seconds";
	$("#elapseClock").html(a)
}

function showMessages() {
	adjustWordsPosition();
	$("#messages").fadeIn(5000, function () {
		showLoveU()
	})
}

function adjustWordsPosition() {
	$("#words").css("position", "absolute");
	$("#words").css("top", $("#garden").position().top + 195);
	$("#words").css("left", $("#garden").position().left + 70)
}

function adjustCodePosition() {
	$("#code").css("margin-top", ($("#garden").height() - $("#code").height()) / 2)
}

function showLoveU() {
	$("#loveu").fadeIn(3000)
};