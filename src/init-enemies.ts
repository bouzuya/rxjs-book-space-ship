import { Observable } from 'rxjs';
import { Enemy } from './enemy';

export default function main(
  canvas: HTMLCanvasElement
): Observable<Array<Enemy>> {
  const ENEMY_SHOOTING_FREQ = 750;
  const ENEMY_FREQ = 1500;
  
  function isVisible(shot) {
    return shot.x > -40 && shot.x < canvas.width + 40 &&
      shot.y > -40 && shot.y < canvas.height + 40;
  }

  return Observable
    .interval(ENEMY_FREQ)
    .scan((enemies) => {
      const enemy = {
        x: Math.random() * canvas.width,
        y: -30,
        shots: [],
        isDead: false
      };
      
      Observable
        .interval(ENEMY_SHOOTING_FREQ)
        .subscribe(() => {
          if (!enemy.isDead) {
            enemy.shots.push({ x: enemy.x, y: enemy.y });
          }
          enemy.shots = enemy.shots.filter(isVisible);
        });
        
      return enemies
        .concat([enemy])
        .filter(isVisible)
        .filter(enemy => !enemy.isDead || enemy.shots.length >= 0);
    }, [])
}
