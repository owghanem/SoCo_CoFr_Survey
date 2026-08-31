# FoPra: SoSci Survey Experimental Suite & Questionnaire Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![SoSci Survey](https://img.shields.io/badge/Platform-SoSci%20Survey-orange.svg)](https://www.soscisurvey.de/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.placeholder.svg)](https://github.com/owghanem/SoCo_CoFr_Survey)

This repository contains the interactive experimental tasks, PHP backend logic, layout templates, and an automated XML questionnaire compiler for **SoSci Survey**. It was developed for a social cognition research study (*Forschungspraktikum*) investigating the **Monitoring Frequency Effect (MFE)**, feedback timing, and their downstream consequences on perceived performance and intrinsic motivation.

---

## Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Interactive Tasks (Mini-Games)](#interactive-tasks-mini-games)
- [Experimental Architecture](#experimental-architecture)
- [Installation & Setup](#installation--setup)
- [Usage & Questionnaire Generation](#usage--questionnaire-generation)
- [Deployment in SoSci Survey](#deployment-in-sosci-survey)
- [Configuration](#configuration)
- [Citation](#citation)
- [License & Contributors](#license--contributors)

---

## Overview

The Monitoring Frequency Effect (MFE) demonstrates that frequent progress checks can systematically bias individuals into feeling as though their progress is slower, driven by temporal neglect. This experimental suite operationalizes gamified browser-based challenges embedded directly into SoSci Survey to assess how variations in feedback frequency (e.g., frequent round-by-round vs. lumped phase feedback) alter:
1. **Perceived performance & competence**
2. **Intrinsic motivation & persistence**
3. **Behavioral performance accuracy across varied cognitive-motor tasks**

---

## Repository Structure

```text
.
├── CITATION.cff               # Citation metadata for Zenodo and GitHub
├── README.md                  # Comprehensive documentation
├── package.json               # Node.js project configuration and scripts
├── .env.example               # Example environment configuration for API keys
├── .gitignore                 # Git ignore rules for build artifacts and secrets
│
├── config/                    # Experiment and trial configurations
│   └── trial-config.json      # Variable mappings, coordinates, answers, and images
│
├── scripts/                   # Generator scripts
│   └── generate-questionnaire.js  # Compiles complete SoSci Survey XML and PHP code
│
├── survey/                    # SoSci Survey definition and layout files
│   ├── Questionare.xml        # Questionnaire XML export for direct import into SoSci Survey
│   ├── Questionare.functions.php # Backend PHP helper functions (points, timers, popups)
│   └── SoSciLayout.html       # Clean, responsive survey layout and custom CSS styling
│
└── tasks/                     # Interactive HTML5/JavaScript experimental tasks
    ├── cutInHalf.html         # 2D Canvas shape bisection task (area ratio calculation)
    ├── GeoGuesser.html        # Geolocation guessing task using Leaflet.js
    ├── GeoGuesser-Google.html # Geolocation guessing task with Google Street View & Leaflet
    ├── tapeMeassure.html      # Blind tape measure task (standalone demo)
    └── tapeMeassureSoSci.html # Blind tape measure task (integrated for SoSci Survey)
```

---

## Interactive Tasks (Mini-Games)

The study features three distinct interactive challenges embedded into SoSci Survey pages via HTML/JavaScript snippets:

### 1. Shape Slicing / Cut in Half (`tasks/cutInHalf.html`)
- **Mechanism:** Participants draw a straight cutting line across an arbitrary 2D shape (e.g., pretzel, banana, croissant, apple).
- **Measurement:** Uses an off-screen HTML5 `<canvas>` and pixel-counting algorithm to compute the percentage distribution of pixels on either side of the cut line.
- **Output:** Stores the cut accuracy / ratio in an internal SoSci variable.

### 2. Blind Tape Measure (`tasks/tapeMeassureSoSci.html`)
- **Mechanism:** Participants pull an interactive measuring tape to estimate a requested target length without seeing intermediate numerical markings.
- **Features:** Touch- and mouse-friendly dragging physics, responsive ruler scaling, and automatic input validation.
- **Output:** Logs the user's estimated millimeter value and target millimeter value into SoSci survey variables.

### 3. Geolocation Guessing / GeoGuesser (`tasks/GeoGuesser.html`, `tasks/GeoGuesser-Google.html`)
- **Mechanism:** Displays either a static photograph or an interactive Google Street View panorama, alongside an interactive Leaflet.js world map.
- **Features:** Country border selection, click-to-pin coordinate detection, and responsive split-view for mobile and desktop.
- **Output:** Captures selected country ISO/name, geographic distance error, and internal tracking variables.

---

## Experimental Architecture

### Backend PHP Logic (`survey/Questionare.functions.php`)
- **Broken-Stick Point Randomization (`fopra_broken_stick_points`):** Generates bounded random integer allocations summing to an exact target total (e.g., 120 points across 16 rounds) using a multi-attempt broken-stick algorithm to keep total cumulative performance comparable across feedback frequency conditions.
- **Dynamic Popup Feedback:** Handles animated circular countdown timer (10 seconds), pause-on-hover mechanics, point presentation, and conditional next-page transition guards.
- **State Guards & Input Verification:** Disables navigation buttons until participants interact with and complete task requirements or answer validation checks.

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or higher)
- Web browser with modern JavaScript and HTML5 Canvas support
- *(Optional)* Google Maps JavaScript API key (for Google Street View GeoGuesser trials)

### Clone the Repository
```bash
git clone https://github.com/owghanem/SoCo_CoFr_Survey.git
cd SoCo_CoFr_Survey
```

### Environment Configuration
If using Google Street View features in GeoGuesser:
```bash
cp .env.example .env
```
Edit `.env` and set your API key:
```env
API_KEY=your_google_maps_api_key_here
```

---

## Usage & Questionnaire Generation

The questionnaire XML and accompanying PHP functions are automatically compiled from configuration files and modular components:

### Generate Survey Files (Preview)
Generates `survey/Questionare.generated.xml` and `survey/Questionare.functions.generated.php`:
```bash
npm run generate
# or
node scripts/generate-questionnaire.js
```

### Build / Overwrite Production Files
Compiles and overwrites `survey/Questionare.xml` and `survey/Questionare.functions.php`:
```bash
npm run build
# or
node scripts/generate-questionnaire.js --overwrite
```

---

## Deployment in SoSci Survey

To deploy this experiment in a [SoSci Survey](https://www.soscisurvey.de/) project:

1. **Import Questionnaire XML:**
   - In your SoSci Survey project, navigate to **Questionnaire** -> **XML Import/Export**.
   - Upload `survey/Questionare.xml`.
2. **Add PHP Functions:**
   - Place the contents of `survey/Questionare.functions.php` into the global PHP code section or the first PHP code element on Page 3 (`rand`).
3. **Configure Layout:**
   - In **Survey Layout**, paste the custom HTML and CSS template from `survey/SoSciLayout.html`.
4. **Upload Static Assets:**
   - Upload any required task images (e.g., `prezel.png`, `banana_1.png`, `croissant.png`, `apple.png`) under **Images and Media Files**.

---

## Configuration

Trial variables, targets, coordinates, and image assets are defined in [`config/trial-config.json`](config/trial-config.json):

```json
{
  "tape": {
    "T1": { "userVarName": "G103_01", "targetVarName": "G103_02" }
  },
  "geo": {
    "G1": {
      "resultVarName": "G101_01",
      "answerVarName": "G101_05",
      "targetVarName": "G101_06",
      "answer": "United States of America",
      "lat": "32.0117548",
      "lng": "-93.9271803"
    }
  },
  "shape": {
    "S1": { "varName": "G102_01", "img": "prezel.png" }
  }
}
```

---

## Citation

If you use this repository, the experimental mini-games, or the questionnaire generator in your research, please cite it using the metadata in [`CITATION.cff`](CITATION.cff):

### BibTeX
```bibtex
@software{ghanem2026sococofrsurvey,
  author = {Ghanem, Omar and Hasan, Eliz and Ioannisian, Diana and Shokri, Hasti and Vaz, Andr{\'e} and Weber, Florian},
  title = {{SoCo\_CoFr\_Survey: Interactive Tasks and Questionnaire Generator for SoSci Survey}},
  year = {2026},
  url = {https://github.com/owghanem/SoCo_CoFr_Survey},
  version = {1.0.0}
}
```

---

## Authors & Contributors

**Ruhr-Universität Bochum**

- **Omar Ghanem** — [`Omar.Ghanem@edu.ruhr-uni-bochum.de`](mailto:Omar.Ghanem@edu.ruhr-uni-bochum.de) ([@owghanem](https://github.com/owghanem))
- **Eliz Hasan** — [`Eliz.Hasan@edu.ruhr-uni-bochum.de`](mailto:Eliz.Hasan@edu.ruhr-uni-bochum.de)
- **Diana Ioannisian** — [`Diana.Ioannisian@edu.ruhr-uni-bochum.de`](mailto:Diana.Ioannisian@edu.ruhr-uni-bochum.de)
- **Hasti Shokri** — [`Hasti.Shokri@edu.ruhr-uni-bochum.de`](mailto:Hasti.Shokri@edu.ruhr-uni-bochum.de)

**Project Tutors & Supervision:**
- **Dr. André Vaz** — [`Andre.Vaz@ruhr-uni-bochum.de`](mailto:Andre.Vaz@ruhr-uni-bochum.de)
- **Florian Weber** — [`Florian.Weber-i2r@ruhr-uni-bochum.de`](mailto:Florian.Weber-i2r@ruhr-uni-bochum.de)

---

## License

Distributed under the [MIT License](LICENSE).
