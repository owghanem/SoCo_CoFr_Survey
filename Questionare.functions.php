
function fopra_popup_template() {
	return '<script>
document.addEventListener("DOMContentLoaded", function () {
	var btn = document.getElementById("submitO");
	if (!btn) btn = document.querySelector("button[type=\\"submit\\"]");
	if (!btn) return;

	var needAnswer = __NEED_ANSWER__;
	var showPopup = __SHOW_POPUP__;
	var sliderAnswered = false;
	var widgetAnswered = false;
	var dragDropPresent = false;

	function hookSliderInputs() {
		var ranges = document.querySelectorAll("input[type=\\"range\\"]");
		Array.prototype.forEach.call(ranges, function (el) {
			function markAnswered() {
				sliderAnswered = true;
				el.setAttribute("data-answered", "1");
				syncNextState();
			}
			el.addEventListener("input", markAnswered, true);
			el.addEventListener("change", markAnswered, true);
		});

		// Covers custom slider widgets that proxy value changes internally.
		document.addEventListener("pointerdown", function (ev) {
			if (!ev.target) return;
			if (ev.target.closest(".slider, .ui-slider, [class*=\\"slider\\"]")) {
				sliderAnswered = true;
				syncNextState();
			}
		}, true);
	}

	function isDragDropComplete() {
		if (!dragDropPresent) return false;

		var totalCards = document.querySelectorAll(".s2items .s2options .s2option").length;
		var assignedCards = document.querySelectorAll(".s2items .s2targets .s2stack .s2option").length;
		if (totalCards > 0) {
			return assignedCards >= totalCards;
		}

		var controllerValues = document.querySelectorAll(".s2items .S2Controller dd");
		if (controllerValues.length > 0) {
			return Array.prototype.every.call(controllerValues, function (dd) {
				return (dd.textContent || "").trim() !== "";
			});
		}

		return false;
	}

	function hookDragDropInputs() {
		var areas = document.querySelectorAll(".s2items.S2CardSort, .s2items.s2jsMultiSort");
		dragDropPresent = areas.length > 0;
		if (!dragDropPresent) return;

		Array.prototype.forEach.call(areas, function (area) {
			area.addEventListener("pointerdown", syncNextState, true);
			area.addEventListener("mousedown", syncNextState, true);
			area.addEventListener("touchstart", syncNextState, true);
			area.addEventListener("keydown", syncNextState, true);

			area.addEventListener("pointerup", function () {
				syncNextState();
			}, true);

			area.addEventListener("drop", function () {
				syncNextState();
			}, true);

			if (typeof MutationObserver !== "undefined") {
				var observer = new MutationObserver(syncNextState);
				observer.observe(area, { childList: true, subtree: true });
			}
		});
	}

	function hookChoiceWidgets() {
		document.addEventListener("pointerdown", function (ev) {
			if (!ev.target) return;
			if (ev.target.closest(".selzoom .option, .selzoom img, .selzoom label")) {
				widgetAnswered = true;
				syncNextState();
			}
		}, true);

		document.addEventListener("click", function (ev) {
			if (!ev.target) return;
			if (ev.target.closest(".selzoom .option, .selzoom img, .selzoom label")) {
				widgetAnswered = true;
				syncNextState();
			}
		}, true);
	}

	function hasUserAnswer() {
		if (widgetAnswered) return true;

		if (dragDropPresent) {
			return isDragDropComplete();
		}

		var answeredRange = sliderAnswered || Array.prototype.some.call(
			document.querySelectorAll("input[type=\\"range\\"]"),
			function (el) { return el.getAttribute("data-answered") === "1" || el.value !== el.defaultValue; }
		);
		if (answeredRange) return true;

		var checkedInput = document.querySelector("input[type=\\"radio\\"]:checked, input[type=\\"checkbox\\"]:checked");
		if (checkedInput) return true;

		var filledText = Array.prototype.some.call(
			document.querySelectorAll("input[type=\\"text\\"], input[type=\\"number\\"], textarea"),
			function (el) { return el.value && el.value.trim().length > 0; }
		);
		if (filledText) return true;

		var chosenSelect = Array.prototype.some.call(document.querySelectorAll("select"), function (el) {
			if (el.selectedIndex <= 0) return false;
			var val = String(el.value);
			return val !== "" && val !== "-9";
		});
		if (chosenSelect) return true;

		return false;
	}

	function syncNextState() {
		if (!needAnswer) return;
		var answered = hasUserAnswer();
		btn.disabled = !answered;
		btn.style.opacity = answered ? "1" : "0.55";
		btn.style.cursor = answered ? "pointer" : "not-allowed";
	}

	if (needAnswer) {
		hookSliderInputs();
		hookDragDropInputs();
		hookChoiceWidgets();
		syncNextState();
		document.addEventListener("input", syncNextState, true);
		document.addEventListener("change", syncNextState, true);
	}

	var popupShown = false;
	btn.addEventListener("click", function (e) {
		if (needAnswer && !hasUserAnswer()) {
			e.preventDefault();
			return;
		}
		if (!showPopup) return;
		if (popupShown) return;
		e.preventDefault();
		popupShown = true;

		var overlay = document.createElement("div");
		overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;";

		var box = document.createElement("div");
		box.style.cssText = "background:linear-gradient(180deg,#ffffff 0%,#f7fbff 100%);padding:40px;border-radius:14px;text-align:center;max-width:360px;box-shadow:0 12px 40px rgba(0,0,0,0.28);font-family:sans-serif;transform:scale(.96);opacity:0;animation:popup-pop-in .22s ease-out forwards;";
		box.style.position = "relative";

		box.innerHTML =
			"<style>@keyframes popup-pop-in{to{transform:scale(1);opacity:1;}}</style>" +
			"<div style=\\"position:absolute;top:12px;right:12px;width:34px;height:34px;\\">" +
				"<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\">" +
					"<circle cx=\\"17\\" cy=\\"17\\" r=\\"14\\" stroke=\\"#E0E0E0\\" stroke-width=\\"4\\" fill=\\"none\\"></circle>" +
					"<circle id=\\"popup-timer-circle\\" cx=\\"17\\" cy=\\"17\\" r=\\"14\\" stroke=\\"#50aadc\\" stroke-width=\\"4\\" fill=\\"none\\" stroke-linecap=\\"round\\" transform=\\"rotate(-90 17 17)\\"></circle>" +
					"<text id=\\"popup-timer-label\\" x=\\"17\\" y=\\"21\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-family=\\"sans-serif\\">10</text>" +
				"</svg>" +
			"</div>" +
			"<div style=\\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4b5563;font-weight:700;\\">Round Result</div>" +
			"<div style=\\"margin:10px auto 14px auto;display:inline-block;padding:8px 16px;border-radius:999px;background:#50aadc;color:#ffffff;font-size:30px;font-weight:800;line-height:1;\\">__POINTS__ pts</div>" +
			"<p style=\\"margin:0;font-size:20px;color:#0f172a;\\">You earned __POINTS__ points <strong>__BODY_SUFFIX__</strong></p>" +
			"<button id=\\"popup-continue\\" style=\\"margin-top:18px;padding:11px 30px;background:#50aadc;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px;font-weight:700;\\">Continue</button>";

		overlay.appendChild(box);
		document.body.appendChild(overlay);

		var totalMs = 10000;
		var remainingMs = totalMs;
		var paused = false;
		var closed = false;
		var lastTick = Date.now();
		var timerCircle = document.getElementById("popup-timer-circle");
		var timerLabel = document.getElementById("popup-timer-label");
		var circumference = 2 * Math.PI * 14;
		timerCircle.style.strokeDasharray = String(circumference);

		function updateTimerVisual() {
			var ratio = Math.max(0, remainingMs) / totalMs;
			timerCircle.style.strokeDashoffset = String(circumference * (1 - ratio));
			timerLabel.textContent = String(Math.ceil(Math.max(0, remainingMs) / 1000));
		}

		function closeAndContinue() {
			if (closed) return;
			closed = true;
			clearInterval(timerInterval);
			if (overlay.parentNode) document.body.removeChild(overlay);
			btn.click();
		}

		box.addEventListener("mouseenter", function () { paused = true; });
		box.addEventListener("mouseleave", function () { paused = false; lastTick = Date.now(); });

		var timerInterval = setInterval(function () {
			if (paused) return;
			var now = Date.now();
			remainingMs -= now - lastTick;
			lastTick = now;
			if (remainingMs <= 0) { remainingMs = 0; updateTimerVisual(); closeAndContinue(); return; }
			updateTimerVisual();
		}, 100);

		updateTimerVisual();
		document.getElementById("popup-continue").addEventListener("click", closeAndContinue);
	});
});
</script>';
}

function fopra_popup_context($pageIdent, $freqPages, $nonfPages) {
	$ctx = array(
		'showPopup' => false,
		'points' => '0',
		'suffix' => ''
	);

	$freqIndex = array_search($pageIdent, $freqPages, true);
	if ($freqIndex !== false) {
		$trialNum = $freqIndex + 1;
		$ctx['showPopup'] = true;
		$ctx['points'] = (string)value(id('V103', $trialNum));
		$ctx['suffix'] = 'this round!';
		return $ctx;
	}

	$nonfIndex = array_search($pageIdent, $nonfPages, true);
	if ($nonfIndex !== false) {
		$trialNum = $nonfIndex + 1;
		$ctx['suffix'] = 'over the last 4 rounds!';
		if ($trialNum > 0 && $trialNum % 4 === 0) {
			$index = $trialNum / 4;
			$ctx['showPopup'] = true;
			$ctx['points'] = (string)value(id('V104', $index));
		}
	}

	return $ctx;
}

function fopra_popup_html($needAnswer, $showPopup, $points, $suffix) {
	$replacements = array(
		'__NEED_ANSWER__' => $needAnswer ? 'true' : 'false',
		'__SHOW_POPUP__' => $showPopup ? 'true' : 'false',
		'__POINTS__' => (string)$points,
		'__BODY_SUFFIX__' => (string)$suffix,
	);

	return str_replace(
		array_keys($replacements),
		array_values($replacements),
		fopra_popup_template()
	);
}
