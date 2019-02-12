window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback){
    window.setTimeout(callback, 16)
  }
})()
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
var length = 500
var width = window.innerWidth
var height = window.innerHeight
var clock = null

canvas.style.pointerEvents = 'none'
canvas.style.position = 'fixed'
canvas.style.zIndex = 10000

document.body.appendChild(canvas)

function start () {
  cancelAnimationFrame(clock)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width
  canvas.height = height
  ctx.fillStyle = '#FFF'
  // for (var i = 0; i < length; i++) {
  //   snowList[i].update()
  // }
  clock = requestAnimFrame(render)
}
function Snow () {
  this.x = 0
  this.y = 0
  this.vy = 0
  this.vx = 0
  this.r = 0

  this.update()
}
Snow.prototype.update = function () {
  this.x = Math.random() * window.innerWidth
  this.y = Math.random() * - window.innerHeight
  this.vy = 1 + Math.random() * 3
  this.vx = 0.5 - Math.random()
  this.r = 1 + Math.random() * 2
  this.o = 0.5 + Math.random() * 0.5
}

var snowList = []
for (var i = 0; i < length; i++) {
  snowList.push(new Snow())
}

function render () {
  // clear
  ctx.clearRect(0, 0, width, height)

  for (i = 0; i < length; i++) {
    snow = snowList[i]
    snow.y += snow.vy
    snow.x += snow.vx

    ctx.globalAlpha = snow.o
    ctx.beginPath()
    ctx.arc(snow.x, snow.y, snow.r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()

    if (snow.y > height) {
      snow.update()
    }
  }
  clock = requestAnimFrame(render)
}

setTimeout(start, 2000)
window.addEventListener('resize', start, false)