import { Observable } from 'rxjs';
import { Star } from './star';
  
export default function main(
  canvas: HTMLCanvasElement
): Observable<Array<Star>> {
  const SPEED = 40;
  const STAR_NUMBER = 250;
  return Observable
    .range(1, STAR_NUMBER)
    .map(() => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1
      };
    })
    .toArray()
    .flatMap(stars => {
      return Observable
        .interval(SPEED)
        .map(() => {
          stars.forEach(star => {
            if (star.y >= canvas.height) {
              star.y = 0; // Reset star to top of the screen
            }
            star.y += 3; // Move star
          });
          return stars;
        });
    });
}