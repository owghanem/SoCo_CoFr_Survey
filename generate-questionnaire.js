#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PATHS = {
	default: path.join(__dirname, "Questionare.generated.xml"),
	overwrite: path.join(__dirname, "Questionare.xml"),
};

function readEnvValue(key) {
	const envPath = path.join(__dirname, ".env");
	if (!fs.existsSync(envPath)) return undefined;

	const envText = fs.readFileSync(envPath, "utf8");
	const line = envText
		.split(/\r?\n/)
		.find((raw) => raw.trim().startsWith(`${key}=`));

	if (!line) return undefined;
	const rawValue = line.slice(line.indexOf("=") + 1).trim();

	if (
		(rawValue.startsWith('"') && rawValue.endsWith('"')) ||
		(rawValue.startsWith("'") && rawValue.endsWith("'"))
	) {
		return rawValue.slice(1, -1);
	}

	return rawValue;
}

const GOOGLE_API_KEY =
	readEnvValue("API_KEY") || readEnvValue("GOOGLE_API_KEY") || "";

const INTRO_HTML = `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto;">

  <h1 style="text-align: center; margin-bottom: 20px;">Welcome to the Study!</h1>

  <p>Thank you for your interest in participating in our research. Before you decide to begin, please read the following information carefully.</p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;">What is this study about?</h3>
  <p>This study investigates how different task environments and feedback mechanisms affect human performance and motivation. Your participation will help us better understand how people approach and engage with interactive challenges.</p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;">What will I be asked to do?</h3>
  <p>During this session, you will complete two distinct phases of tasks. Each phase consists of 16 short trials, which will include a mix of:</p>
  <ul>
    <li>Simple text-based guessing tasks.</li>
    <li>Short, interactive browser-based games.</li>
  </ul>
  <p>As you progress, you will occasionally receive point-based feedback based on your performance. After completing each phase, you will be asked to fill out a brief questionnaire about your experience.</p>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;">Requirements for Participation</h3>
  <p>To participate in this study, you <strong>must</strong> meet the following criteria:</p>
  <ul>
    <li>You are at least <strong>18 years of age</strong>.</li>
    <li>You have a <strong>confident command of the English language</strong>.</li>
  </ul>

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;">Voluntary Participation &amp; Data Privacy</h3>
  <p>Your participation is entirely voluntary. You are free to stop and withdraw from the study at any time simply by closing your browser, without giving a reason and without any negative consequences. All data collected during this study is strictly anonymous and will be used solely for academic research purposes.</p>

  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 30px;">
    <strong>Consent:</strong> By clicking the "Next" button below, you confirm that you have read and understood the information above, that you meet all participation requirements, and that you voluntarily agree to take part in this study.
  </div>

</div>`;

const RANDOMISATION_PHP = `
$condition = value('V102');

if (!isset($freq_pages) || !isset($nonf_pages) || !isset($points_freq) || !isset($points_nonfreq)) {
  $geo_pages = array('G1', 'G2', 'G3', 'G4');
  $tape_pages = array('T1', 'T2', 'T3', 'T4');
  $split_pages = array('S1', 'S2', 'S3', 'S4');
  $question_pages = array(
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10',
    'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19', 'Q20'
  );

  shuffle($geo_pages);
  shuffle($tape_pages);
  shuffle($split_pages);
  shuffle($question_pages);

  $freq_pages = array_merge(
    array_slice($geo_pages, 0, 2),
    array_slice($tape_pages, 0, 2),
    array_slice($split_pages, 0, 2),
    array_slice($question_pages, 0, 10)
  );

  $nonf_pages = array_merge(
    array_slice($geo_pages, 2, 2),
    array_slice($tape_pages, 2, 2),
    array_slice($split_pages, 2, 2),
    array_slice($question_pages, 10, 10)
  );

  shuffle($freq_pages);
  shuffle($nonf_pages);

  $points_freq = array(7, 8, 8, 7, 10, 5, 9, 6, 8, 7, 9, 6, 10, 5, 8, 7);
  $points_nonfreq = array(30, 25, 35, 30);

  shuffle($points_freq);
  shuffle($points_nonfreq);

  registerVariable($freq_pages);
  registerVariable($nonf_pages);
  registerVariable($points_freq);
  registerVariable($points_nonfreq);

  for ($i = 0; $i < 16; $i++) {
    put(id('V103', $i + 1), $points_freq[$i]);
  }
  for ($i = 0; $i < 4; $i++) {
    put(id('V104', $i + 1), $points_nonfreq[$i]);
  }
}

if ($condition == 1) {
  setPageOrder(
    $freq_pages[0], $freq_pages[1], $freq_pages[2], $freq_pages[3],
    $freq_pages[4], $freq_pages[5], $freq_pages[6], $freq_pages[7],
    $freq_pages[8], $freq_pages[9], $freq_pages[10], $freq_pages[11],
    $freq_pages[12], $freq_pages[13], $freq_pages[14], $freq_pages[15],
    'fperf',
    'q112',
    $nonf_pages[0], $nonf_pages[1], $nonf_pages[2], $nonf_pages[3],
    $nonf_pages[4], $nonf_pages[5], $nonf_pages[6], $nonf_pages[7],
    $nonf_pages[8], $nonf_pages[9], $nonf_pages[10], $nonf_pages[11],
    $nonf_pages[12], $nonf_pages[13], $nonf_pages[14], $nonf_pages[15],
    'nperf',
    'end'
  );
} else {
  setPageOrder(
    $nonf_pages[0], $nonf_pages[1], $nonf_pages[2], $nonf_pages[3],
    $nonf_pages[4], $nonf_pages[5], $nonf_pages[6], $nonf_pages[7],
    $nonf_pages[8], $nonf_pages[9], $nonf_pages[10], $nonf_pages[11],
    $nonf_pages[12], $nonf_pages[13], $nonf_pages[14], $nonf_pages[15],
    'nperf',
    'q112',
    $freq_pages[0], $freq_pages[1], $freq_pages[2], $freq_pages[3],
    $freq_pages[4], $freq_pages[5], $freq_pages[6], $freq_pages[7],
    $freq_pages[8], $freq_pages[9], $freq_pages[10], $freq_pages[11],
    $freq_pages[12], $freq_pages[13], $freq_pages[14], $freq_pages[15],
    'fperf',
    'end'
  );
}
`.trim();

const TRIAL_PAGES = [
	{
		ident: "T1",
		kind: "tape",
		pageIntID: 22,
		question: { id: "G103", intID: 24 },
		mainText: { id: "MT01", intID: 23 },
		fbTextIntID: 19,
		popupIntID: 130,
		setup: {
			type: "measure",
			intID: 25,
			varName: "G103_01",
			maxMm: 500,
			goalMm: 145,
		},
	},
	{
		ident: "T2",
		kind: "tape",
		pageIntID: 70,
		question: { id: "G103", intID: 72 },
		mainText: { id: "MT01", intID: 73 },
		fbTextIntID: 20,
		popupIntID: 131,
		setup: {
			type: "measure",
			intID: 71,
			varName: "G103_02",
			maxMm: 500,
			goalMm: 278,
		},
	},
	{
		ident: "T3",
		kind: "tape",
		pageIntID: 74,
		question: { id: "G103", intID: 76 },
		mainText: { id: "MT01", intID: 77 },
		fbTextIntID: 114,
		popupIntID: 146,
		setup: {
			type: "measure",
			intID: 75,
			varName: "G103_03",
			maxMm: 500,
			goalMm: 322,
		},
	},
	{
		ident: "T4",
		kind: "tape",
		pageIntID: 78,
		question: { id: "G103", intID: 80 },
		mainText: { id: "MT01", intID: 81 },
		fbTextIntID: 115,
		popupIntID: 147,
		setup: {
			type: "measure",
			intID: 79,
			varName: "G103_04",
			maxMm: 500,
			goalMm: 467,
		},
	},
	{
		ident: "G1",
		kind: "geo",
		pageIntID: 5,
		question: { id: "G101", intID: 11 },
		mainText: { id: "GG01", intID: 18 },
		fbTextIntID: 21,
		popupIntID: 132,
		setup: {
			type: "geo",
			intID: 26,
			varName: "G101_01",
			answer: "United States of America",
			lat: "32.0117548",
			lng: "-93.9271803",
		},
	},
	{
		ident: "G2",
		kind: "geo",
		pageIntID: 82,
		question: { id: "G101", intID: 84 },
		mainText: { id: "GG01", intID: 85 },
		fbTextIntID: 63,
		popupIntID: 133,
		setup: {
			type: "geo",
			intID: 83,
			varName: "G101_02",
			answer: "Greece",
			lat: "37.6047259",
			lng: "23.3298282",
		},
	},
	{
		ident: "G3",
		kind: "geo",
		pageIntID: 86,
		question: { id: "G101", intID: 88 },
		mainText: { id: "GG01", intID: 89 },
		fbTextIntID: 116,
		popupIntID: 148,
		setup: {
			type: "geo",
			intID: 87,
			varName: "G101_03",
			answer: "Canada",
			lat: "53.1995399",
			lng: "-105.3321598",
		},
	},
	{
		ident: "G4",
		kind: "geo",
		pageIntID: 90,
		question: { id: "G101", intID: 92 },
		mainText: { id: "GG01", intID: 93 },
		fbTextIntID: 117,
		popupIntID: 149,
		setup: {
			type: "geo",
			intID: 91,
			varName: "G101_04",
			answer: "Uruguay",
			lat: "-30.4625891",
			lng: "-56.9016809",
		},
	},
	{
		ident: "S1",
		kind: "split",
		pageIntID: 27,
		question: { id: "G102", intID: 28 },
		mainText: { id: "SH01", intID: 29 },
		fbTextIntID: 61,
		popupIntID: 134,
		setup: { type: "shape", intID: 30, varName: "G102_01", img: "prezel.png" },
	},
	{
		ident: "S2",
		kind: "split",
		pageIntID: 94,
		question: { id: "G102", intID: 96 },
		mainText: { id: "SH01", intID: 97 },
		fbTextIntID: 62,
		popupIntID: 135,
		setup: {
			type: "shape",
			intID: 95,
			varName: "G102_02",
			img: "banana_1.png",
		},
	},
	{
		ident: "S3",
		kind: "split",
		pageIntID: 98,
		question: { id: "G102", intID: 100 },
		mainText: { id: "SH01", intID: 101 },
		fbTextIntID: 118,
		popupIntID: 150,
		setup: {
			type: "shape",
			intID: 99,
			varName: "G102_03",
			img: "croissant.png",
		},
	},
	{
		ident: "S4",
		kind: "split",
		pageIntID: 102,
		question: { id: "G102", intID: 104 },
		mainText: { id: "SH01", intID: 105 },
		fbTextIntID: 119,
		popupIntID: 151,
		setup: { type: "shape", intID: 103, varName: "G102_04", img: "apple.png" },
	},
	{
		ident: "Q1",
		kind: "standard",
		pageIntID: 16,
		question: { id: "Q101", intID: 17 },
		mainText: null,
		fbTextIntID: 63,
		popupIntID: 136,
		setup: null,
	},
	{
		ident: "Q2",
		kind: "standard",
		pageIntID: 6,
		question: { id: "Q107", intID: 12 },
		mainText: null,
		fbTextIntID: 66,
		popupIntID: 137,
		setup: null,
	},
	{
		ident: "Q3",
		kind: "standard",
		pageIntID: 32,
		question: { id: "Q103", intID: 43 },
		mainText: null,
		fbTextIntID: 68,
		popupIntID: 138,
		setup: null,
	},
	{
		ident: "Q4",
		kind: "standard",
		pageIntID: 8,
		question: { id: "Q109", intID: 14 },
		mainText: null,
		fbTextIntID: 82,
		popupIntID: 139,
		setup: null,
	},
	{
		ident: "Q5",
		kind: "standard",
		pageIntID: 9,
		question: { id: "Q105", intID: 15 },
		mainText: null,
		fbTextIntID: 83,
		popupIntID: 140,
		setup: null,
	},
	{
		ident: "Q6",
		kind: "standard",
		pageIntID: 38,
		question: { id: "Q201", intID: 49 },
		mainText: null,
		fbTextIntID: 84,
		popupIntID: 141,
		setup: null,
	},
	{
		ident: "Q7",
		kind: "standard",
		pageIntID: 39,
		question: { id: "Q207", intID: 50 },
		mainText: null,
		fbTextIntID: 85,
		popupIntID: 142,
		setup: null,
	},
	{
		ident: "Q8",
		kind: "standard",
		pageIntID: 40,
		question: { id: "Q203", intID: 51 },
		mainText: null,
		fbTextIntID: 106,
		popupIntID: 143,
		setup: null,
	},
	{
		ident: "Q9",
		kind: "standard",
		pageIntID: 41,
		question: { id: "Q209", intID: 52 },
		mainText: null,
		fbTextIntID: 107,
		popupIntID: 144,
		setup: null,
	},
	{
		ident: "Q10",
		kind: "standard",
		pageIntID: 53,
		question: { id: "Q205", intID: 64 },
		mainText: null,
		fbTextIntID: 108,
		popupIntID: 145,
		setup: null,
	},
	{
		ident: "Q11",
		kind: "standard",
		pageIntID: 33,
		question: { id: "Q106", intID: 44 },
		mainText: null,
		fbTextIntID: 120,
		popupIntID: 152,
		setup: null,
	},
	{
		ident: "Q12",
		kind: "standard",
		pageIntID: 34,
		question: { id: "Q102", intID: 45 },
		mainText: null,
		fbTextIntID: 121,
		popupIntID: 153,
		setup: null,
	},
	{
		ident: "Q13",
		kind: "standard",
		pageIntID: 35,
		question: { id: "Q108", intID: 46 },
		mainText: null,
		fbTextIntID: 122,
		popupIntID: 154,
		setup: null,
	},
	{
		ident: "Q14",
		kind: "standard",
		pageIntID: 36,
		question: { id: "Q104", intID: 47 },
		mainText: null,
		fbTextIntID: 123,
		popupIntID: 155,
		setup: null,
	},
	{
		ident: "Q15",
		kind: "standard",
		pageIntID: 37,
		question: { id: "Q110", intID: 48 },
		mainText: null,
		fbTextIntID: 124,
		popupIntID: 156,
		setup: null,
	},
	{
		ident: "Q16",
		kind: "standard",
		pageIntID: 54,
		question: { id: "Q206", intID: 65 },
		mainText: null,
		fbTextIntID: 125,
		popupIntID: 157,
		setup: null,
	},
	{
		ident: "Q17",
		kind: "standard",
		pageIntID: 55,
		question: { id: "Q202", intID: 59 },
		mainText: null,
		fbTextIntID: 126,
		popupIntID: 158,
		setup: null,
	},
	{
		ident: "Q18",
		kind: "standard",
		pageIntID: 56,
		question: { id: "Q208", intID: 67 },
		mainText: null,
		fbTextIntID: 127,
		popupIntID: 159,
		setup: null,
	},
	{
		ident: "Q19",
		kind: "standard",
		pageIntID: 57,
		question: { id: "Q204", intID: 60 },
		mainText: null,
		fbTextIntID: 128,
		popupIntID: 160,
		setup: null,
	},
	{
		ident: "Q20",
		kind: "standard",
		pageIntID: 58,
		question: { id: "Q210", intID: 69 },
		mainText: null,
		fbTextIntID: 129,
		popupIntID: 161,
		setup: null,
	},
];

const cdata = (content) => `<![CDATA[\n${content}\n]]>`;
const phpTag = (intID, code) => `<php intID="${intID}">${cdata(code)}</php>`;
const textTag = (id, intID) =>
	`<text id="${id}" intID="${intID}">\n\t<spacing>default</spacing>\n</text>`;

function setupPhp({
	type,
	intID,
	varName,
	maxMm,
	goalMm,
	answer,
	lat,
	lng,
	img,
}) {
	const replacements = {
		measure: `
$var    = '${varName}';
$maxMm  = ${maxMm ?? 500};
$goalMm = ${goalMm ?? 150};
replace('%var%',    $var);
replace('%maxMm%',  $maxMm);
replace('%goalMm%', $goalMm);`,

		geo: `
$answer  = '${answer}';
$var     = '${varName}';
$lat     = '${lat}';
$lng     = '${lng}';
$api_key = '${GOOGLE_API_KEY}';
replace('%api_key%', $api_key);
replace('%lat%',     $lat);
replace('%lng%',     $lng);
replace('%answer%',  $answer);
replace('%var%',     $var);`,

		shape: `
$img = '${img}';
$var = '${varName}';
replace('%img%', $img);
replace('%var%', $var);`,
	};

	if (!replacements[type]) throw new Error(`Unknown setup type: "${type}"`);
	return phpTag(intID, replacements[type].trim());
}

function popupScriptTag(bodySuffix, requireAnswer, showPopup) {
	return `<script>
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("submitO");
  if (!btn) btn = document.querySelector("button[type=\\"submit\\"]");
  if (!btn) return;

  var requireAnswer = ${requireAnswer ? "true" : "false"};
	var showPopup = ${showPopup ? "true" : "false"};
	var sliderAnswered = false;
	var widgetAnswered = false;
	var dragDropPresent = false;

	function hookSliderInputs() {
		var ranges = document.querySelectorAll("input[type=\\\"range\\\"]");
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
			if (ev.target.closest(".slider, .ui-slider, [class*=\\\"slider\\\"]")) {
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
			document.querySelectorAll("input[type=\\\"range\\\"]"),
			function (el) { return el.getAttribute("data-answered") === "1" || el.value !== el.defaultValue; }
		);
		if (answeredRange) return true;

    var checkedInput = document.querySelector("input[type=\\\"radio\\\"]:checked, input[type=\\\"checkbox\\\"]:checked");
    if (checkedInput) return true;

    var filledText = Array.prototype.some.call(
      document.querySelectorAll("input[type=\\\"text\\\"], input[type=\\\"number\\\"], textarea"),
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
    if (!requireAnswer) return;
    var answered = hasUserAnswer();
    btn.disabled = !answered;
    btn.style.opacity = answered ? "1" : "0.55";
    btn.style.cursor = answered ? "pointer" : "not-allowed";
  }

  if (requireAnswer) {
		hookSliderInputs();
		hookDragDropInputs();
		hookChoiceWidgets();
    syncNextState();
    document.addEventListener("input", syncNextState, true);
    document.addEventListener("change", syncNextState, true);
  }

  var popupShown = false;
  btn.addEventListener("click", function (e) {
		if (requireAnswer && !hasUserAnswer()) {
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
          "<circle id=\\"popup-timer-circle\\" cx=\\"17\\" cy=\\"17\\" r=\\"14\\" stroke=\\"#0055A4\\" stroke-width=\\"4\\" fill=\\"none\\" stroke-linecap=\\"round\\" transform=\\"rotate(-90 17 17)\\"></circle>" +
          "<text id=\\"popup-timer-label\\" x=\\"17\\" y=\\"21\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-family=\\"sans-serif\\">10</text>" +
        "</svg>" +
      "</div>" +
      "<div style=\\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4b5563;font-weight:700;\\">Round Result</div>" +
      "<div style=\\"margin:10px auto 14px auto;display:inline-block;padding:8px 16px;border-radius:999px;background:#0055A4;color:#ffffff;font-size:30px;font-weight:800;line-height:1;\\">' . $points . ' pts</div>" +
      "<p style=\\"margin:0;font-size:20px;color:#0f172a;\\">You earned ' . $points . ' points <strong>${bodySuffix}</strong></p>" +
      "<button id=\\"popup-continue\\" style=\\"margin-top:18px;padding:11px 30px;background:#0055A4;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px;font-weight:700;\\">Continue</button>";

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    var totalMs      = 10000;
    var remainingMs  = totalMs;
    var paused       = false;
    var closed       = false;
    var lastTick     = Date.now();
    var timerCircle  = document.getElementById("popup-timer-circle");
    var timerLabel   = document.getElementById("popup-timer-label");
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
</script>`;
}

function universalPopupPhp(pageIdent, popupIntID, requireAnswer) {
	return phpTag(
		popupIntID,
		`
$pageIdent = '${pageIdent}';

$freqIndex = array_search($pageIdent, $freq_pages, true);
if ($freqIndex !== false) {
  $trialNum = $freqIndex + 1;
  $points   = value(id('V103', $trialNum));
  $html = '
${popupScriptTag("this round!", requireAnswer, true)}
';
  html($html);
} else {
  $nonfIndex = array_search($pageIdent, $nonf_pages, true);
  if ($nonfIndex !== false) {
    $trialNum = $nonfIndex + 1;
		$showPopup = ($trialNum > 0 && $trialNum % 4 === 0);
		$points = 0;
    if ($trialNum > 0 && $trialNum % 4 === 0) {
      $index  = $trialNum / 4;
      $points = value(id('V104', $index));
    }
		$html = '
${popupScriptTag("over the last 4 rounds!", requireAnswer, false)}
';
		if ($showPopup) {
			$html = '
${popupScriptTag("over the last 4 rounds!", requireAnswer, true)}
';
		}
		html($html);
  }
}`.trim(),
	);
}

function trialPage(trial, pageNumber) {
	const parts = [
		`<!-- Page ${pageNumber} -->`,
		`<page ident="${trial.ident}" intID="${trial.pageIntID}">`,
		trial.setup && setupPhp(trial.setup),
		`<question id="${trial.question.id}" intID="${trial.question.intID}" />`,
		trial.mainText && textTag(trial.mainText.id, trial.mainText.intID),
		trial.fbTextIntID !== null && textTag("FB01", trial.fbTextIntID),
		universalPopupPhp(trial.ident, trial.popupIntID, trial.kind === "standard"),
		`</page>`,
	];

	return parts.filter(Boolean).join("\n");
}

function buildXml() {
	const pages = [];

	pages.push(`<!-- Page 1 -->
<page ident="intro" intID="4">
<html intID="42">${cdata(INTRO_HTML)}</html>
</page>`);

	pages.push(`<!-- Page 2 -->
<page ident="demo" intID="165">
<html intID="110"><![CDATA[
<p>Please let us know a bit about yourself</p>
]]></html>
<question id="D102" intID="109">
<number>no</number>
</question>
<question id="D101" intID="166">
<number>no</number>
</question>
</page>`);

	pages.push(`<!-- Page 3 -->
<page ident="rand" intID="1">
<info>this page is not shown to the participants</info>
<question id="V102" intID="2" />
${phpTag(3, RANDOMISATION_PHP)}
</page>`);

	TRIAL_PAGES.forEach((trial, i) => {
		pages.push(trialPage(trial, i + 4));
	});

	const afterTrialsPageNumber = TRIAL_PAGES.length + 4;

	pages.push(`<!-- Page ${afterTrialsPageNumber} -->
<page ident="fperf" intID="7">
<question id="P101" intID="13" />
</page>`);

	pages.push(`<!-- Page ${afterTrialsPageNumber + 1} -->
<page ident="q112" intID="163">
<question id="Q112" intID="164" />
</page>`);

	pages.push(`<!-- Page ${afterTrialsPageNumber + 2} -->
<page ident="nperf" intID="10">
<question id="P102" intID="31" />
</page>`);

	return `<?xml version="1.0"?>\n<questionnaire>\n\n${pages.join("\n\n\n")}\n\n\n</questionnaire>\n`;
}

const overwrite = process.argv.includes("--overwrite");
const outputPath = overwrite ? PATHS.overwrite : PATHS.default;

fs.writeFileSync(outputPath, buildXml(), "utf8");
console.log(`Generated questionnaire XML at: ${outputPath}`);
if (!overwrite) {
	console.log("Use --overwrite to replace Questionare.xml directly.");
}
