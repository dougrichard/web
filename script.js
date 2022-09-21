const width = window.innerWidth;
const height = window.innerHeight;
const spriteUrl = 'https://picsum.photos/id/615/1280/1280?grain=100?'

const app = new PIXI.Application(width, height, {
  transparent: true });

app.renderer.autoResize = true;
document.body.appendChild(app.view);

const stage = new PIXI.Container();
app.stage.addChild(stage);

const trail = [];
const limit = 500;
const maxDensity = 100;

let texture = PIXI.Texture.fromImage(spriteUrl);
let brush = new PIXI.Sprite(texture);
let previousPosition;

brush.position.x = 500;
brush.position.y = 500;
brush.width = 0;
brush.height = 0;
brush.anchor.set(0.5, 0.5);

stage.addChild(brush);

app.stage.interactive = true;
app.stage.on('pointermove', e => {
  moveTo(e.data.global);
});

function moveTo(position) {
  drawIntermediate(previousPosition, position);

  brush.position.copy(position);

  previousPosition = position.clone();
}

function paintBrush(position) {
  let copy = new PIXI.Sprite(texture);
  copy.position.copy(position);
  copy.width = 1;
  copy.height = 600;
  copy.anchor.set(0.5, 0.5);
  stage.addChild(copy);

  trail.push(copy);

  if (trail.length > limit) {
    let trash = trail.shift();
    stage.removeChild(trash);
    trash.destroy();
  }
}

function drawIntermediate(prev, curr) {
  if (prev) {
    let density = calculateInterpolationDensity(prev, curr);
    for (let i = 0; i <= density; i++) {
      paintBrush(interpolate(prev, curr, i / density));
    }
  } else {
    paintBrush(curr);
  }
}

function calculateInterpolationDensity(prev, curr) {
  let dx = Math.abs(prev.x - curr.x);
  let dy = Math.abs(prev.y - curr.y);

  return Math.round(
  Math.min(
  Math.max(dx, dy),
  maxDensity));


}

function interpolate(a, b, frac) {
  var nx = a.x + (b.x - a.x) * frac;
  var ny = a.y + (b.y - a.y) * frac;
  return new PIXI.Point(nx, ny);
}

window.addEventListener('resize', () => {
  const parent = app.view.parentNode;
  app.renderer.resize(parent.clientWidth, parent.clientHeight);
});