import drawTriangle from './draw-triangle';
import { Shot } from './shot';
import { SpaceShip } from './space-ship';
import { Star } from './star';
import { Enemy } from './enemy';
import render from './render';

function renderScore(ctx, score) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Score: ' + score, 40, 43);
}

function renderStars(
  ctx, canvas: HTMLCanvasElement, stars: Array<Star>
): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function renderSpaceShip(ctx, spaceShip: SpaceShip): void {
  drawTriangle(ctx, spaceShip.x, spaceShip.y, 20, '#ff0000', 'up');
}

function renderEnemies(ctx, enemies: Array<Enemy>): void {
  enemies.forEach(enemy => {
    if (!enemy.isDead) {
      drawTriangle(ctx, enemy.x, enemy.y, 20, '#00ff00', 'down');
    }
    enemy.shots.forEach((shot) => {
      drawTriangle(ctx, shot.x, shot.y, 5, '#00ffff', 'down');
    });
  });
}

function renderShot(ctx, shots: Array<Shot>): void {
  shots.forEach(shot => {
    drawTriangle(ctx, shot.x, shot.y, 5, '#ffff00', 'up');
  });
}

interface Actors {
  stars: Array<Star>;
  spaceShip: SpaceShip;
  enemies: Array<Enemy>;
  shots: Array<Shot>;
  score: number;
}

export default function render(canvas: HTMLCanvasElement): (Actors) => void {
  var context = canvas.getContext('2d');
  return (actors: Actors) => {
    renderStars(context, canvas, actors.stars);
    renderSpaceShip(context, actors.spaceShip);
    renderEnemies(context, actors.enemies);
    renderShot(context, actors.shots);
    renderScore(context, actors.score);
  };
}