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
  svgX: number;
  svgY: number;
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
    bg: C.red, text: '#fff', border: '#ff6680',
    gridRow: 1, gridCol: 3,
    svgX: 168, svgY: 68,
  },
  VM: {
    label: 'VM', fullName: 'Vänster mitt',
    bg: C.purpleMid, text: '#fff', border: C.purpleAcc,
    gridRow: 2, gridCol: 1,
    svgX: 72, svgY: 155,
  },
  CM: {
    label: 'CM', fullName: 'Mitt mitt',
    bg: C.purpleMid, text: '#fff', border: C.purpleAcc,
    gridRow: 2, gridCol: 3,
    offsetY: 18,
    svgX: 168, svgY: 195,
  },
  HM: {
    label: 'HM', fullName: 'Höger mitt',
    bg: C.purpleMid, text: '#fff', border: C.purpleAcc,
    gridRow: 2, gridCol: 5,
    svgX: 264, svgY: 155,
  },
  VB: {
    label: 'VB', fullName: 'Vänsterback',
    bg: C.purple, text: '#fff', border: C.purpleMid,
    gridRow: 3, gridCol: 2,
    svgX: 104, svgY: 302,
  },
  HB: {
    label: 'HB', fullName: 'Högerback',
    bg: C.purple, text: '#fff', border: C.purpleMid,
    gridRow: 3, gridCol: 4,
    svgX: 232, svgY: 302,
  },
  MV: {
    label: 'MV', fullName: 'Målvakt',
    bg: '#7A6030', text: '#fff', border: C.gold,
    gridRow: 4, gridCol: 3,
    svgX: 168, svgY: 400,
  },
};

export const ALL_POSITIONS: Position[] = ['FW', 'VM', 'CM', 'HM', 'VB', 'HB', 'MV'];
