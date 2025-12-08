// encrypted - a short metaphorical showcase


// i designed the icons and layout first because they are simple geometric shapes, and it gave me a visual structure to build the interaction flow onto. i also set up all my fuctions too to avoid confusion as i went along

let fileIcons = [];
let currentOpenFile = null;

// Scrambled file behaviour
let scrambledText = "";
let teasingMessages = [
  "You locked it away, didn't you?",
  "You don't even remember.",
  "Trying won't help.",
  "It's gone because you hid it.",
  "Why keep clicking?"
];
let teasing = 0;

// choices
let showChoiceButtons = false;
let choiceStartTime = 0;
let choiceTimerStarted = false;

// virus mode
let virusActive = false;
let virusPopups = [];
let virusStartTime = 0;

// delete mode
let fadeActive = false;
let fadeLevel = 0;

// bg
let bgR = 192, bgG = 200, bgB = 210;

function setup() {
  createCanvas(700, 500);
  textAlign(LEFT, TOP);
  textSize(18);

  // file icons
  fileIcons = [
    { label: "word.txt", x: 80,  y: 120 },
    { label: "dates.txt", x: 80, y: 220 },
    { label: "when it changed", x: 80, y: 320 }
  ];
}
function draw() {
  drawBackground();
  for (let icon of fileIcons) {
    drawFileIcon(icon);
  }
  if (currentOpenFile && !virusActive && !fadeActive) {
    drawOpenFileWindow();
  }

  //buttons
  if (showChoiceButtons && !virusActive) {
    drawChoiceButtons();
  }
  if (virusActive) {
    runVirusEffect();
  }
  // fade2black
  if (fadeActive) {
    runDeleteFade();
  }
}
