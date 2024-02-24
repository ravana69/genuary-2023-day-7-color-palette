let img;
let src = "https://assets.codepen.io/964843/p_findingnemo_19752_05271d3f.webp";
function preload(){
  img = loadImage(src);
}

class LerpVal{
  constructor(min, max, amt, chance){
    this.min     = min;
    this.max     = max;
    this.val     = random(min, max);
    this.goalVal = this.val;
    this.amt     = amt;
    this.chance  = chance;
  }
  update(){
    this.val = lerp(this.val, this.goalVal, this.amt);
    if (random() < this.chance) this.goalVal = random(this.min, this.max);
  }
}

class Rect{
  constructor(){
    this.x = random(img.width);
    this.y = random(img.height);
    this.w = new LerpVal(20, 100, .01, .05);
    this.h = new LerpVal(20, 100, .01, .05);
    let a  = random(PI*2);
    this.dx = cos(a)*.2;
    this.dy = sin(a)*.2;
  }
  update(){
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < this.w.val || this.x-this.w.val > img.width) this.dx *= -1;
    if (this.y < this.h.val || this.y-this.h.val > img.height) this.dy *= -1;
    this.w.update();
    this.h.update();
  }
}

class Wanderer{
  constructor(w, h){
    this.x = random(width);
    this.y = random(height);
    this.w = new LerpVal(20, 100, .01, .05);
    this.h = new LerpVal(20, 100, .01, .05);
    this.a = new LerpVal(-PI*2, PI*2, .005, .01);
    this.dh = new LerpVal(-.01, .01, .05, .01);
    this.heading = 0
    this.speed = .4;
    this.rect = new Rect();
  }
  update(){
    this.x += cos(this.heading)*this.speed;
    this.y += sin(this.heading)*this.speed;
    
    this.heading += this.dh.val;
    
    if (this.x < 0) this.x += width;
    if (this.x > width) this.x -= width;
    if (this.y < 0) this.y += height;
    if (this.y > height) this.y -= height;
    this.a.update();
    this.dh.update();
    this.rect.update();
  }
  render(){
    push();
    translate(this.x, this.y);
    rotate(this.a.val);
    
    let v = createVector(cos(this.heading-this.a.val), sin(this.heading-this.a.val));
    
    if (v.dot(createVector(0,-1)) > 0) image(img, -this.w.val/2, -this.h.val/2, this.w.val, 1, this.rect.x-this.rect.w.val/2, this.rect.y-this.rect.h.val/2, this.rect.w.val, 1);
    if (v.dot(createVector(0, 1)) > 0) image(img, -this.w.val/2,  this.h.val/2, this.w.val, 1, this.rect.x+this.rect.w.val/2, this.rect.y-this.rect.h.val/2, this.rect.w.val, 1);
    
    if (v.dot(createVector(-1,0)) > 0) image(img, -this.w.val/2, -this.h.val/2, 1, this.h.val, this.rect.x-this.rect.w.val/2, this.rect.y-this.rect.h.val/2, 1, this);
    if (v.dot(createVector( 1,0)) > 0) image(img,  this.w.val/2, -this.h.val/2, 1, this.h.val, this.rect.x-this.rect.w.val/2, this.rect.y+this.rect.h.val/2, 1, this);
    pop();
  }
}

function setup(){
  pixelDensity(1);
  createCanvas();
  // imageMode(CENTER);
  colorMode(HSB, 1, 1, 1);
  windowResized();
}

let ws;
let init = () => {
  ws = [];
  for (let i = 0; i < 15; i++){
    ws.push(new Wanderer());
  }
  background(0);
}

function draw(){
  for (let i = 0; i < 10; i++){
    for (let w of ws){
      w.update();
      w.render();
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function mousePressed(){
  init();
}