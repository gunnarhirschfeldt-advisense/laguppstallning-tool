import type { Position } from '../types/domain';

export type PositionMeta = {
  label: string;
  fullName: string;
  bg: string;
  text: string;
  border: string;
  gridRow: number;
  gridCol: number;
  offsetY?: number;
};

// SFK brand colors
const C = {
  gold:       '#C1AA7C',
  goldLight:  '#F5EDDC',
  goldDark:   '#7A6030',
  purple:     '#3C1053',
  purpleLight:'#E8D5F5',
  purpleMid:  '#5C068C',
  purpleAcc:  '#9A20F4',
  purpleAccL: '#EDE0F7',
  red:        '#FC273F',
  redLight:   '#FFE0E4',
  redDark:    '#A0001B',
};

export const POSITIONS: Record<Position, PositionMeta> = {
  FW: {
    label: 'FW', fullName: 'Forward',
    bg: C.redLight, text: C.redDark, border: C.red,
    gridRow: 1, gridCol: 3,
  },
  VM: {
    label: 'VM', fullName: 'Vänster mitt',
    bg: C.purpleAccL, text: C.purpleMid, border: C.purpleAcc,
    gridRow: 2, gridCol: 1,
  },
  CM: {
    label: 'CM', fullName: 'Mitt mitt',
    bg: C.purpleAccL, text: C.purpleMid, border: C.purpleAcc,
    gridRow: 2, gridCol: 3,
    offsetY: 18,
  },
  HM: {
    label: 'HM', fullName: 'Höger mitt',
    bg: C.purpleAccL, text: C.purpleMid, border: C.purpleAcc,
    gridRow: 2, gridCol: 5,
  },
  VB: {
    label: 'VB', fullName: 'Vänsterback',
    bg: C.purpleLight, text: C.purple, border: C.purpleMid,
    gridRow: 3, gridCol: 2,
  },
  HB: {
    label: 'HB', fullName: 'Högerback',
    bg: C.purpleLight, text: C.purple, border: C.purpleMid,
    gridRow: 3, gridCol: 4,
  },
  MV: {
    label: 'MV', fullName: 'Målvakt',
    bg: C.goldLight, text: C.goldDark, border: C.gold,
    gridRow: 4, gridCol: 3,
  },
};

export const ALL_POSITIONS: Position[] = ['FW', 'VM', 'CM', 'HM', 'VB', 'HB', 'MV'];
