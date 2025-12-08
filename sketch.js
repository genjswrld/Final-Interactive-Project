// encrypted - a short metaphorical showcase


//i learnt alot of different new functions and operators through this project,
//as i inevitably had ideas that branched out beyond the scopes of my mini projects

// i designed the icons and layout first because they are simple geometric shapes, 
//and it gave me a visual structure to build the interaction flow onto. 
//i also set up all my fuctions too to avoid confusion as i went along, i had written out a skeleton of what i wanted to happen
//this way i was able to idenity what vraiables and fucntions i may need (though i added as i went along)

let fileIcons = [];
let currentFile = null;

// array for the messages displayed when the 'locked file is pressed'
let scrambledText = "";
let mockingMessages = [
  "You locked it away, didn't you?",
  "You don't even remember.",
  "Trying won't help.",
  "It's gone because you hid it.",
  "Why keep looking?"
];
let mocking = 0;

// choices
let showChoiceButtons = false;
let choiceStartTime = 0;
let choiceTimerStart = false;

// 'virus' mode
let virusActive = false;
let virusPopups = [];
let virusStart = 0;

// delete mode
let fadeActive = false;
let fadeLevel = 0;

// bg, i came across the noise value in the p5.js reference i experimented with the value
//as just leaving it on framecount made it move way to fast. n is between 0 and 1 i learnt so i simply made the value between 0-20
// the background has a very tiny color shoft throughout, again leaing into the whole 'memory' adjacent theme and also it overall was nice to learn
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
  if (currentFile && !virusActive && !fadeActive) {
    drawOpenFileWindow(); // open the file if the virus mode isnt active (virus mode is only triggered by pressing 'when it changed')
  }

  //buttons, using booleans fr simplicity as opposed to writng out a new 
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

  // choice buttons, this was the hardest part to understand. p5.js doesnt automatically detect clicks.
 // gotten from https://editor.p5js.org/Wacksowe/sketches/MRguew7F7 and a youtube video 
  
  if (showChoiceButtons && !virusActive) {
    // decrypt
    if (mouseX > 300 && mouseX < 380 && mouseY > 380 && mouseY < 420) {
      virusActive = true;
      return; // what i understood from this: mouse x and mose y track the mouse potion of the screen, so i manually, the && means AND so both the bounds of X,Y must be true to count as a click in that box specifically.
    }
    // delete
    if (mouseX > 400 && mouseX < 480 && mouseY > 380 && mouseY < 420) {
      fadeActive = true;
      return;
    }
  }

  // this is to scramble per each click
  if (currentFile === "scrambled" && !virusActive) {
    mockingIndex = (mocking + 1) % mockingMessages.length; // the use of modulus here will move along the array i made
    // as it moves along the index MockingMessages and then loops back
    scrambledText = scrambleText(fileIcons[2].label);
    return;
  }

  
  for (let icon of fileIcons) {
    if (mouseX > icon.x && mouseX < icon.x + 140 &&
        mouseY > icon.y && mouseY < icon.y + 40) {
      openFile(icon); // manually describing each side of the 
    }
  }
}
function openFile(icon) {
  if (icon.label === "word.txt") {
    currentFile = "word";
  } 
  else if (icon.label === "dates.txt") {
    currentFile = "dates";
  } 
  else {
    currentFile = "scrambled";
    scrambledText = scrambleText(icon.label);

    if (!choiceTimerStart) {
      choiceTimerStart = true;
      choiceStartTime = millis(); //
    }
  }
}
function drawOpenFileWindow() {
  fill(255);
  rect(260, 80, 380, 260);
  fill(20);
  
  if (currentFile === "word") {
    text("Groceries:\n- milk\n- wraps\n- blue pens", 280, 100);
  }
  if (currentFile === "dates") {
    text("12/03 — bday\n19/06 — term end\n02/11 — new phone\n28/08 — trip", 280, 100);
  }
  if (currentFile === "scrambled") {
    text(
      "File name:\n" + scrambledText +
      "\n\n" + mockingMessages[mocking],
      280, 100
    );
    if (!showChoiceButtons && millis() - choiceStartTime > 5000) {
      showChoiceButtons = true;
    }
  }
}
function drawChoiceButtons() {
  fill(255);
  rect(300, 380, 80, 40); // decrypt
  rect(400, 380, 80, 40); // delete

  fill(20);
  text("decrypt", 308, 390);
  text("delete", 408, 390);
}
