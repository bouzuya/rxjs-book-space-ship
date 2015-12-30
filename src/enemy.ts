import { EnemyShot } from './enemy-shot';

export interface Enemy {
  x: number;
  y: number;
  shots: Array<EnemyShot>;
  isDead: boolean;
}