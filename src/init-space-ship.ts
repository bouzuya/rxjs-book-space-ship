import { Observable } from 'rxjs';
import { SpaceShip } from './space-ship';

export default function main(
  canvas: HTMLCanvasElement
): Observable<SpaceShip> {
  const HERO_Y = canvas.height - 30;
  return Observable
    .fromEvent(canvas, 'mousemove')
    .map((event: { clientX: number }) => {
      return {
        x: event.clientX,
        y: HERO_Y
      };
    })
    .startWith({
      x: canvas.width / 2,
      y: HERO_Y
    });
}
