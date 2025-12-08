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
function drawBackground() {
  let n = noise(frameCount * 0.005);
  background(bgR + n*20, bgG + n*20, bgB + n*20);
}

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
function drawFileIcon(icon) {
  fill(240, 240, 250);
  rect(icon.x, icon.y, 140, 40);

  fill(20);
  text(icon.label, icon.x + 8, icon.y + 8);
}
function mousePressed() {
  if (fadeActive) return; // nothing after delete

  // Choice buttons
  if (showChoiceButtons && !virusActive) {
    // DECRYPT
    if (mouseX > 300 && mouseX < 380 && mouseY > 380 && mouseY < 420) {
      virusActive = true;
      return;
    }
    // DELETE
    if (mouseX > 400 && mouseX < 480 && mouseY > 380 && mouseY < 420) {
      fadeActive = true;
      return;
    }
  }

  // this is to scramble per each click
  if (currentOpenFile === "scrambled" && !virusActive) {
    teasingIndex = (teasingIndex + 1) % teasingMessages.length;
    scrambledText = scrambleText(fileIcons[2].label);
    return;
  }

  // simple hitbox for whne the boxes are clciked to open the 'files'
  for (let icon of fileIcons) {
    if (mouseX > icon.x && mouseX < icon.x + 140 &&
        mouseY > icon.y && mouseY < icon.y + 40) {
      openFile(icon);
    }
  }
}
