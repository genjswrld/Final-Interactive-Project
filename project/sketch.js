// encrypted - a short metaphorical showcase


//i learnt alot of different new functions and operators through this project,
//as i inevitably had ideas that branched out beyond the scopes of my mini projects i needed to find functions 
//that were able to carry out tasks for me. i utlised alot of arrays as well and randomisisation.

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
let virusStartTime = 0; 

// delete mode
let fadeActive = false;
let fadeLevel = 0;

// bg, i wanted a soft moving changing color background that simultaneously felt like it wasn't too strenuous
// on the eyes, using random would've caused the background to change to fast as opposed to the soft, dream-like fade
// i wanted to achieve. i discovered the noise value (https://p5js.org/reference/p5/noise/)
let bgR = 192, bgG = 200, bgB = 210;

function drawBackground() {
  let n = noise(frameCount * 0.005);
  background(bgR + n * 100, bgG + n * 100, bgB + n * 100);
}

function setup() {
  createCanvas(700, 500);
  textAlign(LEFT, TOP);
  textSize(18);

  // file icons
  fileIcons = [
    { label: "word.txt", x: 80, y: 120 },
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
    drawOpenFileWindow();
  }

  if (showChoiceButtons && !virusActive) {
    drawChoiceButtons();
  }

  if (virusActive) {
    runVirusEffect();
  }

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
  if (fadeActive) return;

  // choice buttons,
      // here i learned that p5.js doesn't automatically detect clicks so i had to code a sort of hitbox parameter
     // just check if the mouse is inside the little box-area where my buttons are drawn. 
    // it’s compares the mouseX + mouseY to the rectangle’s boundaries, if the click was within the boundaries
  // then that triggers the whole virus sequnce that i used a boolean for for simplicity, same logic for the 'delete' route

  if (showChoiceButtons && !virusActive) {
    // decrypt
    if (mouseX > 300 && mouseX < 380 && mouseY > 380 && mouseY < 420) {
      virusActive = true;
      return;
    }
    // delete
    if (mouseX > 400 && mouseX < 480 && mouseY > 380 && mouseY < 420) {
      fadeActive = true;
      return;
    }
  }

  // scramble per click
  if (currentFile === "scrambled" && !virusActive) {
    mocking = (mocking + 1) % mockingMessages.length;
    scrambledText = scrambleText(fileIcons[2].label);
    return;
  }

  for (let icon of fileIcons) {
    if (
      mouseX > icon.x &&
      mouseX < icon.x + 140 &&
      mouseY > icon.y &&
      mouseY < icon.y + 40
    ) {
      openFile(icon);
    }
  }
}

function openFile(icon) {
  if (icon.label === "word.txt") {
    currentFile = "word";
  } else if (icon.label === "dates.txt") {
    currentFile = "dates";
  } else {
    currentFile = "scrambled";
    scrambledText = scrambleText(icon.label);

    if (!choiceTimerStart) {
      choiceTimerStart = true;
      choiceStartTime = millis();
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
    text(
      "12/03 — bday\n19/06 — term end\n02/11 — new phone\n28/08 — trip",
      280,
      100
    );
  }

  if (currentFile === "scrambled") {
    text(
      "File name:\n" + scrambledText + "\n\n" + mockingMessages[mocking],
      280,
      100
    );

    if (!showChoiceButtons && millis() - choiceStartTime > 5000) {
      showChoiceButtons = true;  // at first i wanted to estimate a time for  this event to begin, 
    //but i realised soon after that, that was extrememly impractical as theres
    //no way i could assume one would simply play through the showcase straight, so when i found out that 'millis'
    // started counting as soon as the project was run, i used it to set the starting point for the choices to then contonue
    // for 3000 ms (3s)
    }
  }
}

function drawChoiceButtons() {
  fill(255);
  rect(300, 380, 80, 40);
  rect(400, 380, 80, 40);

  fill(20);
  text("decrypt", 308, 390);
  text("delete", 408, 390);
}

function scrambleText(label) {
  return label
    .split("") // i knew vaguely of the split function from python, in p5.js it creates an erray from every character (https://p5js.org/reference/p5/split/)
    .sort(() => random(-1, 1))
    .join(""); 
  // the sort function doesn’t really care what order things end up in, it just keeps
  // reordering the characters based on whatever random value it gets. that’s what makes
  // the text scramble in a kind of chaotic way.
}


function runVirusEffect() {
  let n = noise(frameCount * 0.1);
  background(250, 200 + n * 30, 200 + n * 30);

  // spawn popups
  if (frameCount % 5 === 0) {
    virusPopups.push({
      x: random(width - 150),
      y: random(height - 60),
      text: random([
        "ERROR",
        "invalid",
        "You can let it go.",
        "It's gone for a reason.",
        "It's better hidden."
      ])
    });
  }

  // draw popups
  for (let box of virusPopups) {
    fill(255, 230);
    rect(box.x, box.y, 150, 50);
    fill(20);
    text(box.text, box.x + 10, box.y + 10);
  }

  // stop after 3 seconds
  if (virusStartTime === 0) {
    virusStartTime = millis(); //https://p5js.org/reference/p5/millis/
  }

  if (millis() - virusStartTime > 3000) {
    noLoop();
  }
} // this specific brace was annoying as i had originally forgotten it 
// and it mis-aligned my functions, causing a temporary break in my code
// when it came to interacting with the delete button.


function runDeleteFade() {
  fadeLevel += 3;
  fill(0, fadeLevel);
  rect(0, 0, width, height);

  if (fadeLevel > 255) {
    background(0);
    fill(255); // fade level increases every frame, by drawing a fullscreen black rectangle
// and then setting the opacity to be the fade level vriable, once it reaches full opacity (255) its deleted
// and normal fully filled rectangle is made.
  
    
    text(
      "Some things remain encrypted forever.\n\n" +
        "Not because they're dangerous, maybe they are\n" +
        "but sometimes letting them go\n" +
        "is kinder than trying to recover\n" +
        "what no longer fits.\n" +
        "Not all memory needs to be opened,\n" +
        "pushing, prodding, prying into your mind;\n" +
        "hurting as it re-rears its ugly head and draws a plough \n" +
        "deeper\n" +
        "and deeper.\n" +
        "Not all memory needs to be opened. \n\n" +
        "We too encrypt and guard ourselves.",
      120,
      120
    );
    noLoop();

  //  for this ending i really wanted the whole piece to land with a kind of reflective finish.
    // after all the scrambling, the mock errors, the chaos of choosing to decrypt or delete,
    // i felt the project needed a moment that breathed, something slower, something that lets
    // the user sit with what the interaction *meant* rather than what it did.
    //
    // so instead of a reveal or a punchline, the screen fades to black and this message appears.
    // it’s less about the mechanics of encryption and more about the emotional stuff i realised
    // i was actually exploring: the way memory protects itself, the way things go unreadable,
    // and how sometimes leaving something closed is lighter than forcing it open again.
    
  }
}
