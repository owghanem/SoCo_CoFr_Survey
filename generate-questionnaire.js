#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "Questionare.generated.xml");
const OVERWRITE_OUTPUT_PATH = path.join(__dirname, "Questionare.xml");
const API_KEY = "AIzaSyBH4b_fqRO3u5GO_AtdXM2SNt_SW1TKdjw";

const introHtml = `<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto;">
  
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

  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px;">Voluntary Participation & Data Privacy</h3>
  <p>Your participation is entirely voluntary. You are free to stop and withdraw from the study at any time simply by closing your browser, without giving a reason and without any negative consequences. All data collected during this study is strictly anonymous and will be used solely for academic research purposes.</p>

  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 30px;">
    <strong>Consent:</strong> By clicking the "Next" button below, you confirm that you have read and understood the information above, that you meet all participation requirements, and that you voluntarily agree to take part in this study.
  </div>

</div>`;

const randPhp = `// Retrieve the randomly drawn condition
$condition = value('V102');

// If 1: Frequent condition comes first
if ($condition == 1) {
  setPageOrder('freq1-freq16', 'mid1', 'nonf1-nonf16', 'mid2', 'end');
} 
// If 2: Non-Frequent condition comes first
else {
  setPageOrder('nonf1-nonf16', 'mid1', 'freq1-freq16', 'mid2', 'end');
}

if (!isset($points_freq)) {
  
  // Exactly 16 numbers (5-10) that sum to 120
  $points_freq = array(7, 8, 8, 7, 10, 5, 9, 6, 8, 7, 9, 6, 10, 5, 8, 7); 
  
  // Exactly 4 numbers (20-40) that sum to 120
  $points_nonfreq = array(30, 25, 35, 30); 
  
  // Shuffle the order so it feels random and unpredictable to the participant
  shuffle($points_freq);
  shuffle($points_nonfreq);
  
  // Save for this session
  registerVariable($points_freq);
  registerVariable($points_nonfreq);
  
  // Store permanently in dataset using the Internal Variables (IV01 and IV02)
  for ($i = 0; $i < 16; $i++) {
    put(id('V103', $i + 1), $points_freq[$i]);
  }
  for ($i = 0; $i < 4; $i++) {
    put(id('V104', $i + 1), $points_nonfreq[$i]);
  }
}`;

const freqPages = [
  {
    ident: "freq1",
    pageIntID: 22,
    setup: { type: "measure", intID: 25, varName: "G103_01" },
    question: { id: "G103", intID: 24 },
    mainText: { id: "MT01", intID: 23 },
    fbTextIntID: null,
    popupPhpIntID: 130,
  },
  {
    ident: "freq2",
    pageIntID: 70,
    setup: { type: "measure", intID: 71, varName: "G103_02" },
    question: { id: "G103", intID: 72 },
    mainText: { id: "MT01", intID: 73 },
    fbTextIntID: 61,
    popupPhpIntID: 131,
  },
  {
    ident: "freq3",
    pageIntID: 5,
    setup: {
      type: "geo",
      intID: 26,
      answer: "United States of America",
      varName: "G101_01",
      lat: "32.0117548",
      lng: "-93.9271803",
    },
    question: { id: "G101", intID: 11 },
    mainText: { id: "GG01", intID: 18 },
    fbTextIntID: 62,
    popupPhpIntID: 132,
  },
  {
    ident: "freq4",
    pageIntID: 82,
    setup: {
      type: "geo",
      intID: 83,
      answer: "Greece",
      varName: "G101_02",
      lat: "37.6047259",
      lng: "23.3298282",
    },
    question: { id: "G101", intID: 84 },
    mainText: { id: "GG01", intID: 85 },
    fbTextIntID: 63,
    popupPhpIntID: 133,
  },
  {
    ident: "freq5",
    pageIntID: 27,
    setup: { type: "shape", intID: 30, img: "prezel.png", varName: "G102_01" },
    question: { id: "G102", intID: 28 },
    mainText: { id: "SH01", intID: 29 },
    fbTextIntID: 66,
    popupPhpIntID: 134,
  },
  {
    ident: "freq6",
    pageIntID: 94,
    setup: { type: "shape", intID: 95, img: "banana_1.png", varName: "G102_02" },
    question: { id: "G102", intID: 96 },
    mainText: { id: "SH01", intID: 97 },
    fbTextIntID: 68,
    popupPhpIntID: 135,
  },
  {
    ident: "freq7",
    pageIntID: 16,
    setup: null,
    question: { id: "A101", intID: 17 },
    mainText: null,
    fbTextIntID: 106,
    popupPhpIntID: 136,
  },
  {
    ident: "freq8",
    pageIntID: 6,
    setup: null,
    question: { id: "A107", intID: 12 },
    mainText: null,
    fbTextIntID: 107,
    popupPhpIntID: 137,
  },
  {
    ident: "freq9",
    pageIntID: 32,
    setup: null,
    question: { id: "A103", intID: 43 },
    mainText: null,
    fbTextIntID: 108,
    popupPhpIntID: 138,
  },
  {
    ident: "freq10",
    pageIntID: 8,
    setup: null,
    question: { id: "A109", intID: 14 },
    mainText: null,
    fbTextIntID: 109,
    popupPhpIntID: 139,
  },
  {
    ident: "freq11",
    pageIntID: 9,
    setup: null,
    question: { id: "A105", intID: 15 },
    mainText: null,
    fbTextIntID: 20,
    popupPhpIntID: 140,
  },
  {
    ident: "freq12",
    pageIntID: 38,
    setup: null,
    question: { id: "A201", intID: 49 },
    mainText: null,
    fbTextIntID: 21,
    popupPhpIntID: 141,
  },
  {
    ident: "freq13",
    pageIntID: 39,
    setup: null,
    question: { id: "A207", intID: 50 },
    mainText: null,
    fbTextIntID: 110,
    popupPhpIntID: 142,
  },
  {
    ident: "freq14",
    pageIntID: 40,
    setup: null,
    question: { id: "A203", intID: 51 },
    mainText: null,
    fbTextIntID: 111,
    popupPhpIntID: 143,
  },
  {
    ident: "freq15",
    pageIntID: 41,
    setup: null,
    question: { id: "A209", intID: 52 },
    mainText: null,
    fbTextIntID: 112,
    popupPhpIntID: 144,
  },
  {
    ident: "freq16",
    pageIntID: 53,
    setup: null,
    question: { id: "A205", intID: 64 },
    mainText: null,
    fbTextIntID: 113,
    popupPhpIntID: 145,
  },
];

const nonfPages = [
  {
    ident: "nonf1",
    pageIntID: 74,
    setup: { type: "measure", intID: 75, varName: "G103_03" },
    question: { id: "G103", intID: 76 },
    mainText: { id: "MT01", intID: 77 },
    fbTextIntID: 114,
    popupPhpIntID: 146,
  },
  {
    ident: "nonf2",
    pageIntID: 78,
    setup: { type: "measure", intID: 79, varName: "G103_04" },
    question: { id: "G103", intID: 80 },
    mainText: { id: "MT01", intID: 81 },
    fbTextIntID: 115,
    popupPhpIntID: 147,
  },
  {
    ident: "nonf3",
    pageIntID: 86,
    setup: {
      type: "geo",
      intID: 87,
      answer: "Canada",
      varName: "G101_03",
      lat: "53.1995399",
      lng: "-105.3321598",
    },
    question: { id: "G101", intID: 88 },
    mainText: { id: "GG01", intID: 89 },
    fbTextIntID: 116,
    popupPhpIntID: 148,
  },
  {
    ident: "nonf4",
    pageIntID: 90,
    setup: {
      type: "geo",
      intID: 91,
      answer: "Uruguay",
      varName: "G101_04",
      lat: "-30.4625891",
      lng: "-56.9016809",
    },
    question: { id: "G101", intID: 92 },
    mainText: { id: "GG01", intID: 93 },
    fbTextIntID: 117,
    popupPhpIntID: 149,
  },
  {
    ident: "nonf5",
    pageIntID: 98,
    setup: { type: "shape", intID: 99, img: "croissant.png", varName: "G102_03" },
    question: { id: "G102", intID: 100 },
    mainText: { id: "SH01", intID: 101 },
    fbTextIntID: 118,
    popupPhpIntID: 150,
  },
  {
    ident: "nonf6",
    pageIntID: 102,
    setup: { type: "shape", intID: 103, img: "apple.png", varName: "G102_04" },
    question: { id: "G102", intID: 104 },
    mainText: { id: "SH01", intID: 105 },
    fbTextIntID: 119,
    popupPhpIntID: 151,
  },
  {
    ident: "nonf7",
    pageIntID: 33,
    setup: null,
    question: { id: "A106", intID: 44 },
    mainText: null,
    fbTextIntID: 120,
    popupPhpIntID: 152,
  },
  {
    ident: "nonf8",
    pageIntID: 34,
    setup: null,
    question: { id: "A102", intID: 45 },
    mainText: null,
    fbTextIntID: 121,
    popupPhpIntID: 153,
  },
  {
    ident: "nonf9",
    pageIntID: 35,
    setup: null,
    question: { id: "A108", intID: 46 },
    mainText: null,
    fbTextIntID: 122,
    popupPhpIntID: 154,
  },
  {
    ident: "nonf10",
    pageIntID: 36,
    setup: null,
    question: { id: "A104", intID: 47 },
    mainText: null,
    fbTextIntID: 123,
    popupPhpIntID: 155,
  },
  {
    ident: "nonf11",
    pageIntID: 37,
    setup: null,
    question: { id: "A110", intID: 48 },
    mainText: null,
    fbTextIntID: 124,
    popupPhpIntID: 156,
  },
  {
    ident: "nonf12",
    pageIntID: 54,
    setup: null,
    question: { id: "A206", intID: 65 },
    mainText: null,
    fbTextIntID: 125,
    popupPhpIntID: 157,
  },
  {
    ident: "nonf13",
    pageIntID: 55,
    setup: null,
    question: { id: "A202", intID: 59 },
    mainText: null,
    fbTextIntID: 126,
    popupPhpIntID: 158,
  },
  {
    ident: "nonf14",
    pageIntID: 56,
    setup: null,
    question: { id: "A208", intID: 67 },
    mainText: null,
    fbTextIntID: 127,
    popupPhpIntID: 159,
  },
  {
    ident: "nonf15",
    pageIntID: 57,
    setup: null,
    question: { id: "A204", intID: 60 },
    mainText: null,
    fbTextIntID: 128,
    popupPhpIntID: 160,
  },
  {
    ident: "nonf16",
    pageIntID: 58,
    setup: null,
    question: { id: "A210", intID: 69 },
    mainText: null,
    fbTextIntID: 129,
    popupPhpIntID: 161,
  },
];

/**
 * Indents each non-empty line in a string by a number of two-space levels.
 * @param {string} text Source text to indent.
 * @param {number} [level=0] Number of indent levels.
 * @returns {string} Indented text.
 */
function indent(text, level = 0) {
  const prefix = "  ".repeat(level);
  return text
    .split("\n")
    .map((line) => (line.length ? `${prefix}${line}` : line))
    .join("\n");
}

/**
 * Wraps PHP code in a SoSci XML php node with CDATA.
 * @param {number} intID Internal SoSci node id.
 * @param {string} code PHP source code.
 * @returns {string} XML php block.
 */
function buildPhpBlock(intID, code) {
  return `<php intID="${intID}"><![CDATA[\n${code}\n]]></php>`;
}

/**
 * Builds a SoSci text node with default spacing.
 * @param {string} id SoSci text id.
 * @param {number} intID Internal SoSci node id.
 * @returns {string} XML text block.
 */
function buildTextBlock(id, intID) {
  return `<text id="${id}" intID="${intID}">\n\t<spacing>default</spacing>\n</text>`;
}

/**
 * Builds the setup PHP for task-specific placeholder replacement.
 * @param {null | {
 *   type: "measure" | "geo" | "shape",
 *   intID: number,
 *   varName?: string,
 *   answer?: string,
 *   lat?: string,
 *   lng?: string,
 *   img?: string
 * }} setup Setup descriptor for a trial page.
 * @returns {string} XML php block or empty string when no setup is required.
 */
function buildSetupPhp(setup) {
  if (!setup) return "";

  if (setup.type === "measure") {
    return buildPhpBlock(
      setup.intID,
      `$var = '${setup.varName}';\n$maxCm = 50;\n$goal = 15;\n\nreplace('%var%', $var);\nreplace('%maxCm%', $maxCm);\nreplace('%goal%', $goal);`
    );
  }

  if (setup.type === "geo") {
    return buildPhpBlock(
      setup.intID,
      `$answer = '${setup.answer}';\n$var = '${setup.varName}';\n$lat = '${setup.lat}';\n$lng = '${setup.lng}';\n$api_key = '${API_KEY}';\n\nreplace('%api_key%', $api_key);\nreplace('%lat%', $lat);\nreplace('%lng%', $lng);\nreplace('%answer%', $answer);\nreplace('%var%', $var);`
    );
  }

  if (setup.type === "shape") {
    return buildPhpBlock(
      setup.intID,
      `$img = '${setup.img}';\n$var = '${setup.varName}';\n\nreplace('%img%', $img);\nreplace('%var%', $var);`
    );
  }

  throw new Error(`Unsupported setup type: ${setup.type}`);
}

/**
 * Builds the shared popup JavaScript used in frequent and non-frequent feedback.
 * @param {string} bodySuffix Suffix after the points value in the body sentence.
 * @returns {string} Script tag content as a string.
 */
function buildPopupJs(bodySuffix) {
  return `<script>
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("submitO"); 
  if (!btn) btn = document.querySelector("button[type=\\"submit\\"]");
  if (!btn) return;

  var popupShown = false;
  btn.addEventListener("click", function (e) {
    if (popupShown) return; 
    e.preventDefault();     
    popupShown = true;
    
    var overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;";
    
    var box = document.createElement("div");
    box.style.cssText = "background:white;padding:40px;border-radius:10px;text-align:center;max-width:320px;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-family:sans-serif;";
    
    box.style.position = "relative";
    box.innerHTML =
      "<div style=\\"position:absolute;top:12px;right:12px;width:34px;height:34px;\\">" +
        "<svg width=\\"34\\" height=\\"34\\" viewBox=\\"0 0 34 34\\">" +
          "<circle cx=\\"17\\" cy=\\"17\\" r=\\"14\\" stroke=\\"#E0E0E0\\" stroke-width=\\"4\\" fill=\\"none\\"></circle>" +
          "<circle id=\\"popup-timer-circle\\" cx=\\"17\\" cy=\\"17\\" r=\\"14\\" stroke=\\"#0055A4\\" stroke-width=\\"4\\" fill=\\"none\\" stroke-linecap=\\"round\\" transform=\\"rotate(-90 17 17)\\"></circle>" +
          "<text id=\\"popup-timer-label\\" x=\\"17\\" y=\\"21\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-family=\\"sans-serif\\">10</text>" +
        "</svg>" +
      "</div>" +
      "<p style=\\"font-size:18px;color:#333;\\">You earned <strong>' . $points . ' points</strong> ${bodySuffix}</p>" +
      "<button id=\\"popup-continue\\" style=\\"margin-top:15px;padding:10px 30px;background:#0055A4;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;\\">Continue</button>";

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

    function closePopupAndContinue() {
      if (closed) return;
      closed = true;
      clearInterval(timerInterval);
      if (overlay.parentNode) {
        document.body.removeChild(overlay);
      }
      btn.click();
    }

    box.addEventListener("mouseenter", function () {
      paused = true;
    });

    box.addEventListener("mouseleave", function () {
      paused = false;
      lastTick = Date.now();
    });

    var timerInterval = setInterval(function () {
      if (paused) return;
      var now = Date.now();
      remainingMs -= (now - lastTick);
      lastTick = now;

      if (remainingMs <= 0) {
        remainingMs = 0;
        updateTimerVisual();
        closePopupAndContinue();
        return;
      }

      updateTimerVisual();
    }, 100);

    updateTimerVisual();

    document.getElementById("popup-continue").addEventListener("click", function () {
      closePopupAndContinue();
    });
  });
});
</script>`;
}

/**
 * Builds frequent-condition popup PHP for a specific trial.
 * @param {number} trialNum 1-based trial number.
 * @param {number} popupPhpIntID Internal SoSci php node id.
 * @returns {string} XML php block.
 */
function buildFreqPopupPhp(trialNum, popupPhpIntID) {
  const code = `$trialNum = ${trialNum};\n$points = value(id('V103', $trialNum));\n\n$html = '\n${buildPopupJs("this round!")}\n';\nhtml($html);`;
  return buildPhpBlock(popupPhpIntID, code);
}

/**
 * Builds non-frequent-condition popup PHP for a specific trial.
 * The popup is only shown every 4th trial.
 * @param {number} trialNum 1-based trial number.
 * @param {number} popupPhpIntID Internal SoSci php node id.
 * @returns {string} XML php block.
 */
function buildNonfPopupPhp(trialNum, popupPhpIntID) {
  const code = `$trialNum = ${trialNum};\nif ($trialNum > 0 && $trialNum % 4 === 0) {\n    $index = $trialNum / 4;\n    $points = value(id('V104', $index));\n    $html = '\n${indent(buildPopupJs("over the last 4 rounds!"), 2)}\n    ';\n    html($html);\n}`;
  return buildPhpBlock(popupPhpIntID, code);
}

/**
 * Assembles a full XML page for a trial.
 * @param {{
 *   ident: string,
 *   pageIntID: number,
 *   setup: any,
 *   question: { id: string, intID: number },
 *   mainText: null | { id: string, intID: number },
 *   fbTextIntID: null | number,
 *   popupPhpIntID: number
 * }} page Page metadata.
 * @param {number} pageNumber Display page number in comments.
 * @param {"freq" | "nonf"} mode Trial mode.
 * @param {number} trialNum 1-based trial number.
 * @returns {string} Full XML page block.
 */
function buildTrialPage(page, pageNumber, mode, trialNum) {
  const lines = [];
  lines.push(`<!-- Page ${pageNumber} -->`);
  lines.push(`<page ident="${page.ident}" intID="${page.pageIntID}">`);

  const setupPhp = buildSetupPhp(page.setup);
  if (setupPhp) lines.push(setupPhp);

  lines.push(`<question id="${page.question.id}" intID="${page.question.intID}" />`);

  if (page.mainText) {
    lines.push(buildTextBlock(page.mainText.id, page.mainText.intID));
  }

  if (page.fbTextIntID !== null) {
    lines.push(buildTextBlock("FB01", page.fbTextIntID));
  }

  if (mode === "freq") {
    lines.push(buildFreqPopupPhp(trialNum, page.popupPhpIntID));
  } else {
    lines.push(buildNonfPopupPhp(trialNum, page.popupPhpIntID));
  }

  lines.push(`</page>`);
  return lines.join("\n");
}

/**
 * Builds the complete questionnaire XML document string.
 * @returns {string} Full XML document.
 */
function buildQuestionnaireXml() {
  const pages = [];

  pages.push(`<!-- Page 1 -->\n<page ident="intro" intID="4">\n<html intID="42"><![CDATA[\n${introHtml}\n]]></html>\n</page>`);

  pages.push(
    `<!-- Page 2 -->\n<page ident="rand" intID="1">\n<info>this page is not shown to the participants</info>\n<question id="V102" intID="2" />\n${buildPhpBlock(3, randPhp)}\n</page>`
  );

  freqPages.forEach((page, idx) => {
    pages.push(buildTrialPage(page, idx + 3, "freq", idx + 1));
  });

  pages.push(`<!-- Page 19 -->\n<page ident="mid1" intID="7">\n<question id="Q101" intID="13" />\n</page>`);

  nonfPages.forEach((page, idx) => {
    pages.push(buildTrialPage(page, idx + 20, "nonf", idx + 1));
  });

  pages.push(`<!-- Page 36 -->\n<page ident="mid2" intID="10">\n<question id="Q102" intID="31" />\n</page>`);

  return `<?xml version="1.0"?>\n<questionnaire>\n\n${pages.join("\n\n\n")}\n\n\n</questionnaire>\n`;
}

/**
 * Writes the generated XML to either the side-by-side file or the main XML.
 * @param {boolean} overwrite Whether to overwrite Questionare.xml.
 * @returns {string} The path that was written.
 */
function writeOutput(overwrite) {
  const xml = buildQuestionnaireXml();
  const outputPath = overwrite ? OVERWRITE_OUTPUT_PATH : OUTPUT_PATH;
  fs.writeFileSync(outputPath, xml, "utf8");
  return outputPath;
}

const overwrite = process.argv.includes("--overwrite");
const writtenPath = writeOutput(overwrite);

console.log(`Generated questionnaire XML at: ${writtenPath}`);
if (!overwrite) {
  console.log("Use --overwrite to replace Questionare.xml directly.");
}
