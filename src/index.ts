import { Observable, Subject } from 'rxjs';
import initRender from './render';
import initEnemies from './init-enemies';
import initStars from './init-stars';
import initSpaceShip from './init-space-ship';
import initShots from './init-shots';
import drawTriangle from './draw-triangle';
import { SpaceShip } from './space-ship';
import { Star } from './star';
import { Enemy } from './enemy';
import { Shot } from './shot';

const SPEED = 40;

function getRandomInt(min, max): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collision(target1, target2): boolean {
  return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
    (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function gameOver(ship, enemies): boolean {
  return enemies.filter(i => !i.isDead).some(enemy =>
    collision(ship, enemy) || enemy.shots.some(shot => collision(ship, shot))
  );
}

const SCORE_INCREASE = 10;
const scoreSubject = new Subject<number>();
const score$ = scoreSubject
  .scan((prev, cur) => prev + cur, 0)
  .startWith(0);

function updateShots({ shots }): void {
  shots.forEach(shot => {
    const SHOOTING_SPEED = 15;
    shot.y -= SHOOTING_SPEED;
  });
};

function updateEnemies({ enemies }): void {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);
    enemy.shots.forEach(shot => {
      const SHOOTING_SPEED = 15;
      shot.y += SHOOTING_SPEED;
    });
  });
};

function updateShotsAndEnemies({ shots, enemies }): void {
  shots.forEach(shot => {
    return enemies.filter(i => !i.isDead).some(enemy => {
      const hit = collision(shot, enemy); 
      if (hit) {
        scoreSubject.next(SCORE_INCREASE);
        enemy.isDead = true;
        shot.x = shot.y = -100;
      }
      return hit;
    })
  });
};

function main(): void {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const render = initRender(canvas);
  const stars$ = initStars(canvas);
  const spaceShip$ = initSpaceShip(canvas);
  const enemies$ = initEnemies(canvas);
  const shots$ = initShots(canvas, spaceShip$);
  
  Observable
    .combineLatest(
      stars$, spaceShip$, enemies$, shots$, score$,
      (stars, spaceShip, enemies, shots, score) => {
        return { stars, spaceShip, enemies, shots, score };
    })
    .sampleTime(SPEED)
    .takeWhile(({ spaceShip, enemies }) => !gameOver(spaceShip, enemies))
    .do(updateShots)
    .do(updateEnemies)
    .do(updateShotsAndEnemies)
    .subscribe(render);
};

main();
