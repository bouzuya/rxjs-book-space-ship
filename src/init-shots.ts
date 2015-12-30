import { Observable } from 'rxjs';
import { Shot } from './shot';
import { SpaceShip } from './space-ship';
  
export default function main(
  canvas: HTMLCanvasElement, spaceShip$: Observable<SpaceShip>
): Observable<Array<Shot>> {
  const shot$ = Observable
    .merge(
      Observable.fromEvent(canvas, 'click'),
      Observable.fromEvent(window.document, 'keydown')
        .filter((event: { keyCode: number }) => event.keyCode === 32)
    )
    .sampleTime(200)
    .map(() => ({ value: null, timestamp: new Date().getTime() }));
  return Observable
    .combineLatest(
      shot$,
      spaceShip$,
      (shot, spaceShip) => {
        return { timestamp: shot.timestamp, x: spaceShip.x, y: spaceShip.y };
      }
    )
    .distinctUntilChanged((a, b) => a.timestamp === b.timestamp)
    .scan((shots, shot) => shots.concat([shot]), [])
    .startWith([]);
}