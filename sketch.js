// Colors
let COLOR_WATER, COLOR_SAND, COLOR_PLAINS, COLOR_FOREST, COLOR_TAIGA, COLOR_SNOW;

let COLOR_TREE_TRUNK_START, COLOR_TREE_LEAVES_START, COLOR_TREE_TRUNK_STOP, COLOR_TREE_LEAVES_STOP;
let COLOR_FIR_TRUNK_START, COLOR_FIR_LEAVES_START, COLOR_FIR_TRUNK_STOP, COLOR_FIR_LEAVES_STOP;
let COLOR_ROCK_START, COLOR_FIR_SNOWY_START, COLOR_FIR_SNOWY_STOP, COLOR_ROCK_STOP;

// Thresholds
const THRESHOLD_WATER = 0.4;
const THRESHOLD_SAND = 0.41;
const THRESHOLD_SAND_PLAINS = 0.48;
const THRESHOLD_PLAINS = 0.51;
const THRESHOLD_PLAINS_FOREST = 0.54;
const THRESHOLD_FOREST = 0.60;
const THRESHOLD_FOREST_TAIGA = 0.65;
const THRESHOLD_TAIGA = 0.69;
const THRESHOLD_TAIGA_SNOWY = 0.72;
const THRESHOLD_SNOWY = 1.0; // USE ELSE

// Scenery Chances
const SCENERY_TREE = 0.005;
const SCENERY_TREE_PLAINS = 0.001;
const SCENERY_TREE_TAIGA = 0.005;

const SCENERY_ROCK = 0.0001;

const NOISE_SCALE = 0.005;

const DIRTY_NOISE_SCALE = 0.2;

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

function setup() {
  // Colors
  COLOR_WATER = color(0, 0, 255);
  COLOR_SAND = color(255, 255, 61);
  COLOR_PLAINS = color(60, 243, 52);
  COLOR_FOREST = color(42, 159, 55);
  COLOR_TAIGA = color(10, 63, 16);
  COLOR_SNOW = color(255, 250, 250);
  
  COLOR_TREE_TRUNK_START = color(92, 64, 51);
  COLOR_TREE_TRUNK_STOP = color(82, 56, 43);
  COLOR_TREE_LEAVES_START = color(56, 125, 51);
  COLOR_TREE_LEAVES_STOP = color(96, 200, 86);
  
  COLOR_FIR_TRUNK_START = color(82, 54, 41);
  COLOR_FIR_TRUNK_STOP = color(62, 46, 33);
  COLOR_FIR_LEAVES_START = color(5, 71, 42);
  COLOR_FIR_LEAVES_STOP = color(10, 120, 80);
  
  COLOR_FIR_SNOWY_START = color(10, 180, 120);
  COLOR_FIR_SNOWY_STOP = color(15, 250, 210);
  
  COLOR_ROCK_START = color(162, 165, 167);
  COLOR_ROCK_STOP = color(204, 206, 207);
  
  createCanvas(windowWidth, windowHeight);
  
  noStroke();
}

function darkenColor(c, val){
  const r = red(c);
  const g = green(c);
  const b = blue(c);
  
  return color(r*val, g*val, b*val);
}

function drawGround(){
  for (let x = 0; x<width; x++){
    for (let y = 0; y<height; y++){
      const p = noise(x*NOISE_SCALE, y*NOISE_SCALE);
      
      const p2 = noise(x*DIRTY_NOISE_SCALE, y*DIRTY_NOISE_SCALE);
      
      let c;
      if (p < THRESHOLD_WATER) {
        c = COLOR_WATER;
      } else if (p < THRESHOLD_SAND) {
        c = COLOR_SAND;
      } else if (p < THRESHOLD_SAND_PLAINS) {
        const mappedValue = map(p, THRESHOLD_SAND, THRESHOLD_SAND_PLAINS, 0.0, 1.0);
        c = lerpColor(COLOR_SAND, COLOR_PLAINS, mappedValue);
      } else if (p < THRESHOLD_PLAINS) {
        c = COLOR_PLAINS;
      } else if (p < THRESHOLD_PLAINS_FOREST) {
        const mappedValue = map(p, THRESHOLD_PLAINS, THRESHOLD_PLAINS_FOREST, 0.0, 1.0);
        c = lerpColor(COLOR_PLAINS, COLOR_FOREST, mappedValue);
      } else if (p < THRESHOLD_FOREST) {
        c = COLOR_FOREST;
      } else if (p < THRESHOLD_FOREST_TAIGA) {
        const mappedValue = map(p, THRESHOLD_FOREST, THRESHOLD_FOREST_TAIGA, 0.0, 1.0);
        c = lerpColor(COLOR_FOREST, COLOR_TAIGA, mappedValue);
      } else if (p < THRESHOLD_TAIGA) {
        c = COLOR_TAIGA;
      } else if (p < THRESHOLD_TAIGA_SNOWY) {
        const mappedValue = map(p, THRESHOLD_TAIGA, THRESHOLD_TAIGA_SNOWY, 0.0, 1.0);
        //c = lerpColor(COLOR_TAIGA, COLOR_SNOW, mappedValue);
        if (p2 < mappedValue){
          c = COLOR_SNOW;
        } else {
          c = COLOR_TAIGA;
        }
      } else {
        c = COLOR_SNOW;
      }
      c = darkenColor(c, map(p2, 0.0, 1.0, 0.82, 1.0));
      
      set(x, y, c);
    }
  }
  updatePixels();
}

function drawTree(x, y, shapes, trunkColor, leavesColor){
  let isTrunk = true;
  shapes.forEach(shape => {
    if (isTrunk){
      fill(lerpColor(trunkColor[0], trunkColor[1], random()));
    } else {
      fill(lerpColor(leavesColor[0], leavesColor[1], random()));
    }
    beginShape();
    shape.forEach(vert => {
      vertex(vert.x + x - 25, vert.y + y - 50);
    });
    endShape(CLOSE);
    isTrunk = false;
  });
}

function drawForestTree(x, y){
  drawTree(x, y, TREES_FOREST.random(), [COLOR_TREE_TRUNK_START, COLOR_TREE_TRUNK_STOP], [COLOR_TREE_LEAVES_START, COLOR_TREE_LEAVES_STOP]);
}

function drawFirTree(x, y){
  drawTree(x, y, TREES_FIR.random(), [COLOR_FIR_TRUNK_START, COLOR_FIR_TRUNK_STOP], [COLOR_FIR_LEAVES_START, COLOR_FIR_LEAVES_STOP]);
}

function drawSnowyTree(x, y){
  drawTree(x, y, TREES_FIR.random(), [COLOR_FIR_TRUNK_START, COLOR_FIR_TRUNK_STOP], [COLOR_FIR_SNOWY_START, COLOR_FIR_SNOWY_STOP]);
}

function drawRock(x, y){
  drawTree(x, y, ROCKS.random(), [COLOR_ROCK_START, COLOR_ROCK_STOP]);
}

function drawScenery(){
  for (let y = 0; y<height; y++){
    for (let x = 0; x<width; x++){
      const r = random();
      
      const p = noise(x*NOISE_SCALE, y*NOISE_SCALE);
      
      if (p < THRESHOLD_WATER){
        // Nothing yet
      } else if (p < THRESHOLD_SAND){
        // Nothing yet
      } else if (p < THRESHOLD_SAND_PLAINS){
        // Nothing yet
      } else if (p < THRESHOLD_PLAINS){
        if (1 - r < SCENERY_ROCK){
          drawRock(x, y);
        }
      } else if (p < THRESHOLD_PLAINS_FOREST){
        if (r < SCENERY_TREE_PLAINS){
          drawForestTree(x, y);
        }
        
        if (1 - r < SCENERY_ROCK){
          drawRock(x, y);
        }
      } else if (p < THRESHOLD_FOREST){
        if (r < SCENERY_TREE){
          drawForestTree(x, y);
        }
        
        if (1 - r < SCENERY_ROCK){
          drawRock(x, y);
        }
      } else if (p < THRESHOLD_FOREST_TAIGA){
        if (r < SCENERY_TREE_TAIGA/2){
          drawForestTree(x, y);
        } else if (r < SCENERY_TREE_TAIGA){
          drawFirTree(x, y);
        }
        
        if (1 - r < SCENERY_ROCK){
          drawRock(x, y);
        }
      }  else if (p < THRESHOLD_TAIGA){
        if (r < SCENERY_TREE){
          drawFirTree(x, y);
        }
        
        if (1 - r < SCENERY_ROCK){
          drawRock(x, y);
        }
      } else if (p < THRESHOLD_TAIGA_SNOWY){
        if (r < SCENERY_TREE_TAIGA/2){
          drawFirTree(x, y);
        } else if (r < SCENERY_TREE_TAIGA){
          drawSnowyTree(x, y);
        }
      } else if (p < THRESHOLD_SNOWY){
        if (r < SCENERY_TREE_TAIGA){
          drawSnowyTree(x, y);
        }
      }
    }
  }
}

function draw() {
  seed = int(random(1000, 100000));
  console.log("Rendering with seed:", seed);
  noiseSeed(seed);
  
  background(255);
  
  drawGround();
  drawScenery();
  
  noLoop();
}

function mousePressed() {
  // Render a new scene
  loop();
}