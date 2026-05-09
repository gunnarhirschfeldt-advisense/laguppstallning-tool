import type { Position } from '../types/domain';

export type PositionMeta = {
  label: string;
  fullName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gridRow: number;
  gridCol: number;
  offsetY?: number; // px nudge within the grid cell
};

export const POSITIONS: Record<Position, PositionMeta> = {
  FW: {
    label: 'FW',
    fullName: 'Forward',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    gridRow: 1,
    gridCol: 3,
  },
  VM: {
    label: 'VM',
    fullName: 'Vänster mitt',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    gridRow: 2,
    gridCol: 1,
  },
  CM: {
    label: 'CM',
    fullName: 'Mitt mitt',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    gridRow: 2,
    gridCol: 3,
    offsetY: 18,
  },
  HM: {
    label: 'HM',
    fullName: 'Höger mitt',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    gridRow: 2,
    gridCol: 5,
  },
  VB: {
    label: 'VB',
    fullName: 'Vänsterback',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    gridRow: 3,
    gridCol: 2,
  },
  HB: {
    label: 'HB',
    fullName: 'Högerback',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    gridRow: 3,
    gridCol: 4,
  },
  MV: {
    label: 'MV',
    fullName: 'Målvakt',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    gridRow: 4,
    gridCol: 3,
  },
};

export const ALL_POSITIONS: Position[] = ['FW', 'VM', 'CM', 'HM', 'VB', 'HB', 'MV'];
