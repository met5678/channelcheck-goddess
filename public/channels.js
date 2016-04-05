var socket = io();

var width  = 301;
var height = 301;
var dim    = 10;
var rows   = (height / dim) | 0;
var cols   = (width  / dim) | 0;

var canvas = $('canvas');
var ctx    = canvas[0].getContext('2d');

var gridBuffer = document.createElement('canvas');
gridBuffer.width  = width;
gridBuffer.height = height;

var colors        = [];
var channels      = [];
var mode          = 'rgb';

function makeGrid(ctx) {
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  for(var x = 0; x <= width; x+= dim) {
    ctx.moveTo(x+.5,0);
    ctx.lineTo(x+.5,height);
  }
  for(var y = 0; y <= height; y+= dim) {
    ctx.moveTo(0,     y+.5);
    ctx.lineTo(height,y+.5);
  }
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0,0,width,height);
  ctx.drawImage(gridBuffer,0,0);
  for(var a=0; a<colors.length; a++) {
    drawLight(a,colors[a]);
  }
}

function drawLight(index, color) {
  ctx.fillStyle = color;

  var x = (index % cols) * dim + 1;
  var y = ((index / rows)|0) * dim + 1;

  ctx.fillRect(x,y,dim-1,dim-1);
}

function init() {
  makeGrid(gridBuffer.getContext('2d'));
  requestAnimationFrame(draw);
  initSocket();
}

function initSocket() {
  var socket = io();

  socket.on('channels', function(data) {
    processChannels(data);
    draw();
  });

  $('input[name="mode"]').on('change', function(e) {
    mode = e.currentTarget.value;
  });
}

function processChannels(data) {
  colors = [];
  if(mode == 'channels') {
    for(var channel = 0; channel<data.length; channel++) {
      var v = data[channel];
      colors[channel] = 'rgb('+v+','+v+','+v+')';
    }
  }
  else {
    var lights = (data.length/3)|0;
    for(var light = 0; light<lights; light++) {
      var addr = light*3;

      var r = Number(data[addr  ]);
      var g = Number(data[addr+1]);
      var b = Number(data[addr+2]);

      switch(mode) {
        case 'rgb':
          colors[light] = 'rgb('+r+','+g+','+b + ')';
          break;
        case 'brg':
          colors[light] = 'rgb('+b+','+r+','+g + ')';
          break;
      }
    }
  }
}

init();