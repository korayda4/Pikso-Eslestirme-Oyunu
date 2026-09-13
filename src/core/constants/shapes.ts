import { ShapeType } from '../types/game';

export interface ShapeInfo {
  type: ShapeType;
  nameTr: string;
  sides: number;
}

export const GAME_SHAPES: ShapeInfo[] = [
  { type: 'circle', nameTr: 'Daire', sides: 0 },
  { type: 'square', nameTr: 'Kare', sides: 4 },
  { type: 'triangle', nameTr: 'Üçgen', sides: 3 },
  { type: 'star', nameTr: 'Yıldız', sides: 10 },
  { type: 'heart', nameTr: 'Kalp', sides: 0 },
  { type: 'diamond', nameTr: 'Elmas', sides: 4 },
  { type: 'hexagon', nameTr: 'Altıgen', sides: 6 },
  { type: 'crescent', nameTr: 'Hilal', sides: 0 },
];
