import {LevelInfo} from './level-info';

export type WorldInfo = {
  levels: Record<number, LevelInfo>;
  currentDepth: number;
};
