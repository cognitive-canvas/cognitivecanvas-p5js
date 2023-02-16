// gui params
const shapes = ["circle", "triangle", "square", "pentagon", "star"];
var numShapes = 20;
var strokeWidth = 4;
var strokeColor = "#00ddff";
var fillColor = [180, 255, 255];
var drawStroke = true;
var drawFill = true;
var radius = 20;
var shape = "circle";
var label = "label";

// gui
var gui;
// dynamic parameters
var bigRadius;

/*
  Listen for messages from Cognitive Canvas when in preview mode. 

  "save_thumbnail" - sent when the user clicks the save thumbnail button. 
  "confirm_update" - sent when the user clicks the prepare update button. Do any final actions here.
  "restore" - restore data when the user is configuring a saved mint. See also ccReady.

*/
window.addEventListener("message", (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case "save_thumbnail":
      saveThumbnail();
      break;
    case "confirm_update":
      saveParams();
      saveAttributes();
      ccConfirmUpdate();
      break;
    case "restore":
      console.log("restoring params iframe", e.data.restore);
      if (e.data.restore.params.restored) restoreParams(e.data.restore.params.restored);
      loop(); // make sure we draw again
      break;
    default:
      break;
  }
});

/*
  Get the params.json file for this mint. If the file is not present, it means that the user is configuring a mint.
  You should get any other external files that were configured with this mint here also. They will always be relative to
  the params directory.
*/
async function preload() {
  try {
    console.log("preload, loading");
    const res = await fetch("./params/params.json", { redirect: "follow" });
    if (res.status === 200) {
      const params = await res.json();
      console.log("preload params", params);
      restoreParams(params);
    }
  } catch (e) {
    console.log("preload params failed", e);
  }
}

function saveThumbnail() {
  const canvas = document.getElementById("defaultCanvas0");
  canvas.toBlob(function (blob) {
    ccSaveThumbnail(blob);
  });
}

function getParams() {
  return {
    numShapes,
    strokeWidth,
    strokeColor,
    fillColor,
    drawStroke,
    drawFill,
    radius,
    shape,
    label,
  };
}

function saveParams() {
  const params = getParams();
  ccSaveParams(params);
}

function saveAttributes() {
  const params = getParams();
  ccSaveAttributes(params);
}

function showParams() {
  console.log("numShapes", numShapes);
  console.log("strokeWidth", strokeWidth);
  console.log("strokeColor", strokeColor);
  console.log("fillColor", fillColor);
  console.log("drawStroke", drawStroke);
  console.log("drawFill", drawFill);
  console.log("radius", radius);
  console.log("shape", shape);
  console.log("label", label);
}

function restoreParams(params) {
  numShapes = params.numShapes || 20;
  strokeWidth = params.strokeWidth || 4;
  strokeColor = params.strokeColor || "#00ddff";
  fillColor = params.fillColor || 180;
  drawStroke = typeof params.drawStroke === "boolean" ? params.drawStroke : true;
  drawFill = typeof params.drawFill === "boolean" ? params.drawFill : true;
  radius = params.radius || 20;
  shape = params.shape || "circle";
  label = params.label || "label";
}

function windowResized() {
  const dim = Math.min(windowWidth, windowHeight);
  resizeCanvas(dim, dim);
}

/*
  If isCClive is set, then this is a live mint. Show the configuration GUI. 
*/
function setupLive() {
  if (isCClive) {
    /*
      Enable user thumbnail generation and enable the prepare button. For this simple example, we can enable these buttons
      in setup. For other more complicated examples, you can use your own logic to enable the buttons.
    */
    ccEnableThumbnail();
    ccEnablePrepare();

    const fs = createButton("Fullscreen");
    fs.position(5, 5);
    fs.mousePressed(() => document.documentElement.requestFullscreen());
    // If in preview mode, add the options to the shape variable
    shape = [shape].concat(shapes.filter((s) => s !== shape));
    gui = createGui();
    gui.setPosition(5, 35);
    gui.addGlobals(
      "numShapes",
      "bigRadius",
      "shape",
      "label",
      "radius",
      "drawFill",
      "fillColor",
      "drawStroke",
      "strokeColor",
      "strokeWidth"
    );

    /*
      Signal ready and ask for any configuration data that needs to be restored. For this sample,
      only the params are needed. This array will include all data that is to be restored. The 
      restored data will be retured in the "restore" event, see above.
    */
    ccReady({
      params: { type: "restore_params" },
    });
  }
}

function setup() {
  const dim = Math.min(windowWidth, windowHeight);
  createCanvas(dim, dim);
  // Calculate big radius
  bigRadius = height / 3.0;

  // setup gui if in preview mode
  setupLive();

  // Don't loop automatically
  noLoop();
}

function draw() {
  // clear all
  clear();
  background(255);

  // set fill style
  if (drawFill) {
    fill(fillColor);
  } else {
    noFill();
  }

  // set stroke style
  if (drawStroke) {
    stroke(strokeColor);
    strokeWeight(strokeWidth);
  } else {
    noStroke();
  }

  // draw circles arranged in a circle
  for (var i = 0; i < numShapes; i++) {
    var angle = (TWO_PI / numShapes) * i;
    var x = width / 2 + cos(angle) * bigRadius;
    var y = height / 2 + sin(angle) * bigRadius;
    var d = 2 * radius;

    // pick a shape
    switch (shape) {
      case "circle":
        ellipse(x, y, d, d);
        break;

      case "square":
        rectMode(CENTER);
        rect(x, y, d, d);
        break;

      case "triangle":
        ngon(3, x, y, d);
        break;

      case "pentagon":
        ngon(5, x, y, d);
        break;

      case "star":
        star(6, x, y, d / sqrt(3), d);
        break;
    }

    // draw a label below the shape
    push();
    noStroke();
    fill(0);
    textAlign(CENTER);
    text(label, x, y + radius + 15);
    pop();
  }

  noLoop();
}

// draw a regular n-gon with n sides
function ngon(n, x, y, d) {
  beginShape();
  for (var i = 0; i < n; i++) {
    var angle = (TWO_PI / n) * i;
    var px = x + (sin(angle) * d) / 2;
    var py = y - (cos(angle) * d) / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}

// draw a regular n-pointed star
function star(n, x, y, d1, d2) {
  beginShape();
  for (var i = 0; i < 2 * n; i++) {
    var d = i % 2 === 1 ? d1 : d2;
    var angle = (PI / n) * i;
    var px = x + (sin(angle) * d) / 2;
    var py = y - (cos(angle) * d) / 2;
    vertex(px, py);
  }
  endShape(CLOSE);
}
