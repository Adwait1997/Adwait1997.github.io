var ctx;
var canvas;
var rects = [];
var container;
var nameContainer;
var scaling = 1;
var animationId;
var squareEdge = 25;
var borderWidth = 3;
var squareSize = squareEdge + borderWidth
var scaledSize = squareSize*scaling;

var limitX = Math.round(window.innerWidth/squareSize);
var limitY = Math.round(window.innerHeight/squareSize);

// Get real square locations relative to canvas
function getX(x){
  return Math.floor(x*squareSize);
}

function getY(y){
  return Math.round(y*squareSize);
}

// Output RGBA as string
function rgba(r, g, b, a){
  return "rgba("+ r +"," + g + "," + b + "," + a + ")";
}

// Given n, round up the nearest multiple of k 
function roundUp(n, k){
  return n + k - n%k;
}

// Set time outs to fade a square out with a white square
function fadeout(x, y){
  var realX = getX(x);
  var realY = getY(y);
  setTimeout(function(){
    ctx.fillStyle = "rgba(255, 255, 255, .5)";
    ctx.fillRect(realX, realY, squareSize, squareSize);
    setTimeout(function(){
      ctx.fillRect(realX, realY, squareSize, squareSize);
      setTimeout(function(){
        ctx.clearRect(realX, realY, squareSize, squareSize);
      }, 50)
    }, 50)
  }, 50)
}

// Set time outs to fade a square in with a given color and opacity
function fadein(x, y, r, g, b, count, a){
  if (typeof(count) == "undefined"){
    count = 1;
  }
  if (typeof(a) == "undefined"){
    a = .33;
  }
  if (count <= 0){
    return;
  }
  var realX = getX(x);
  var realY = getY(y);
  ctx.fillStyle = rgba(r, g, b, a);
  ctx.fillRect(realX, realY, squareEdge, squareEdge);
  setTimeout(function(){
    fadein(x, y, r, g, b, count-1, a);
  }, 25)
}

// Draw a square within the grid.
function draw(x, y , r, g, b, a){
    if(typeof(a) == "undefined"){
      a = 1;
    }
    ctx.fillStyle = rgba(r, g, b, a);
    ctx.fillRect(getX(x), getY(y), squareEdge, squareEdge);
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeRect(getX(x), getY(y), squareSize, squareSize);
}

// Decide what color a square should be at random.
function updateRect(rectX, rectY){
  if(typeof(rectX) == "undefined" || typeof(rectY) == "undefined"){
     rectX = Math.round(Math.random()*limitX);
     rectY = Math.round(Math.random()*limitY);
 }
  if(rects[rectX][rectY]){
    if(Math.round(Math.random())){
      fadein(rectX, rectY, 255, 255, 255, 5, .1);
      rects[rectX][rectY] -=1;
      if(rects[rectX][rectY] === 0){
        fadeout(rectX, rectY);
      }
    } else{
      if(rects[rectX][rectY] < 6){
        fadein(rectX, rectY, 126, 201, 119, 1, .33);
        rects[rectX][rectY] +=1;
      }
    }
  }else{
    rects[rectX][rectY] = 3;
    fadein(rectX, rectY, 126, 201, 119, 3);
  }
}

function animate(){
  updateRect();
  animationId = requestAnimationFrame(animate);
}

// Draw all squares again from what is given in the 2D array.
function redraw(){
  for(var x = 0;x<=limitX;x++){
    for(var y = 0;y<=limitY; y++){
      draw(x, y, 126, 201, 119, rects[x][y]*.25);
    }
  }
}

// Stop animation and delete all squares.
function clearSquares(){
  window.cancelAnimationFrame(animationId);
  for(var x = 0;x<=limitX;x++){
    for(var y = 0;y<=limitY; y++){
      fadeout(x, y);
    }
  }
}

// Scale size of container to fit within new square limits
function resizeContainer(){
  if (window.innerWidth < 615){
    container.style.left = 0;
    container.style.width = "100%";
  } else{
    var thirds = Math.floor(limitX/3)*scaling
    container.style.left =  getX(thirds)-1;
    container.style.width = roundUp(getX(thirds), scaledSize);
  }
  var conHeight = roundUp(nameContainer.offsetHeight, scaledSize);
  if (conHeight > (limitY - 2) * scaledSize){
    console.log("true");
    conHeight = (limitY - 2) * scaledSize;
  }
  container.style.height = conHeight; 
  // Should I feel bad for doing this? I feel bad for doing this.
  if (conHeight+getY(3)*scaling >= getY(limitY)*scaling){ 
    container.style.top = getY(1)*scaling-2; 
    if (conHeight + getY(1)*scaling-2 > getY(limitY)*scaling){
      container.style.height = getY(limitY)*scaling - getY(1)*scaling-2
    }
  }
  else{
    container.style.top = getY(3)*scaling-2;
  }
}

// Create an empty 2D array with squares.
function initializeSquares(){
  canvas = document.getElementById("squareCan");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  scaling = window.devicePixelRatio;
  scaledSize = scaling*squareSize;
  ctx = canvas.getContext("2d");
  ctx.scale(scaling, scaling);
  limitX = Math.round(limitX/scaling);
  limitY = Math.round(limitY/scaling);
  container = document.getElementById("container");
  nameContainer = document.getElementById("nameContainer");
  resizeContainer();
  for(var x = 0;x<=limitX;x++){
    rects.push([]);
    for(var y=0;y<=limitY; y++){
      updateRect(x, y);
    }
  }
  animate();
}

function resizeSquaresCanvas(){
  limitX = Math.round(window.innerWidth/squareSize/scaling);
  while(limitX >= rects.length){
    rects.push([]);
  }
  limitY = Math.round(window.innerHeight/squareSize/scaling);
  if (canvas.height < window.innerHeight || canvas.width < window.innerWidth){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.scale(scaling, scaling);
    redraw();
  }
  resizeContainer();
}

// Resize the canvas and set new limits on squares.
window.onresize = function(e){
  resizeSquaresCanvas();
}
