import { FormationName, Position } from '../types';

export interface PositionCoord {
  x: number; // 0 to 100 percentage of width
  y: number; // 0 to 100 percentage of height
  roleLabel: string;
  defaultPosition: Position;
}

export const FORMATIONS_COORDS: Record<FormationName, PositionCoord[]> = {
  '4-3-3': [
    { x: 50, y: 88, roleLabel: 'GK', defaultPosition: 'GK' },
    { x: 15, y: 70, roleLabel: 'LB', defaultPosition: 'LB' },
    { x: 38, y: 72, roleLabel: 'LCB', defaultPosition: 'CB' },
    { x: 62, y: 72, roleLabel: 'RCB', defaultPosition: 'CB' },
    { x: 85, y: 70, roleLabel: 'RB', defaultPosition: 'RB' },
    { x: 50, y: 53, roleLabel: 'CDM', defaultPosition: 'CDM' },
    { x: 32, y: 44, roleLabel: 'LCM', defaultPosition: 'CM' },
    { x: 68, y: 44, roleLabel: 'RCM', defaultPosition: 'CM' },
    { x: 18, y: 22, roleLabel: 'LW', defaultPosition: 'LW' },
    { x: 50, y: 16, roleLabel: 'ST', defaultPosition: 'ST' },
    { x: 82, y: 22, roleLabel: 'RW', defaultPosition: 'RW' },
  ],
  '4-2-3-1': [
    { x: 50, y: 88, roleLabel: 'GK', defaultPosition: 'GK' },
    { x: 15, y: 70, roleLabel: 'LB', defaultPosition: 'LB' },
    { x: 38, y: 72, roleLabel: 'LCB', defaultPosition: 'CB' },
    { x: 62, y: 72, roleLabel: 'RCB', defaultPosition: 'CB' },
    { x: 85, y: 70, roleLabel: 'RB', defaultPosition: 'RB' },
    { x: 35, y: 56, roleLabel: 'LDM', defaultPosition: 'CDM' },
    { x: 65, y: 56, roleLabel: 'RDM', defaultPosition: 'CDM' },
    { x: 20, y: 35, roleLabel: 'LAM', defaultPosition: 'LW' },
    { x: 50, y: 32, roleLabel: 'CAM', defaultPosition: 'CAM' },
    { x: 80, y: 35, roleLabel: 'RAM', defaultPosition: 'RW' },
    { x: 50, y: 16, roleLabel: 'ST', defaultPosition: 'ST' },
  ],
  '3-5-2': [
    { x: 50, y: 88, roleLabel: 'GK', defaultPosition: 'GK' },
    { x: 26, y: 72, roleLabel: 'LCB', defaultPosition: 'CB' },
    { x: 50, y: 74, roleLabel: 'CB', defaultPosition: 'CB' },
    { x: 74, y: 72, roleLabel: 'RCB', defaultPosition: 'CB' },
    { x: 12, y: 48, roleLabel: 'LWB', defaultPosition: 'LB' },
    { x: 35, y: 50, roleLabel: 'LCM', defaultPosition: 'CM' },
    { x: 50, y: 58, roleLabel: 'CDM', defaultPosition: 'CDM' },
    { x: 65, y: 50, roleLabel: 'RCM', defaultPosition: 'CM' },
    { x: 88, y: 48, roleLabel: 'RWB', defaultPosition: 'RB' },
    { x: 38, y: 18, roleLabel: 'LST', defaultPosition: 'ST' },
    { x: 62, y: 18, roleLabel: 'RST', defaultPosition: 'ST' },
  ],
  '4-4-2': [
    { x: 50, y: 88, roleLabel: 'GK', defaultPosition: 'GK' },
    { x: 15, y: 70, roleLabel: 'LB', defaultPosition: 'LB' },
    { x: 38, y: 72, roleLabel: 'LCB', defaultPosition: 'CB' },
    { x: 62, y: 72, roleLabel: 'RCB', defaultPosition: 'CB' },
    { x: 85, y: 70, roleLabel: 'RB', defaultPosition: 'RB' },
    { x: 16, y: 45, roleLabel: 'LM', defaultPosition: 'LW' },
    { x: 38, y: 48, roleLabel: 'LCM', defaultPosition: 'CM' },
    { x: 62, y: 48, roleLabel: 'RCM', defaultPosition: 'CM' },
    { x: 84, y: 45, roleLabel: 'RM', defaultPosition: 'RW' },
    { x: 38, y: 18, roleLabel: 'LST', defaultPosition: 'ST' },
    { x: 62, y: 18, roleLabel: 'RST', defaultPosition: 'ST' },
  ],
  '5-3-2': [
    { x: 50, y: 88, roleLabel: 'GK', defaultPosition: 'GK' },
    { x: 12, y: 64, roleLabel: 'LWB', defaultPosition: 'LB' },
    { x: 30, y: 73, roleLabel: 'LCB', defaultPosition: 'CB' },
    { x: 50, y: 75, roleLabel: 'CB', defaultPosition: 'CB' },
    { x: 70, y: 73, roleLabel: 'RCB', defaultPosition: 'CB' },
    { x: 88, y: 64, roleLabel: 'RWB', defaultPosition: 'RB' },
    { x: 30, y: 45, roleLabel: 'LCM', defaultPosition: 'CM' },
    { x: 50, y: 48, roleLabel: 'CM', defaultPosition: 'CDM' },
    { x: 70, y: 45, roleLabel: 'RCM', defaultPosition: 'CM' },
    { x: 38, y: 18, roleLabel: 'LST', defaultPosition: 'ST' },
    { x: 62, y: 18, roleLabel: 'RST', defaultPosition: 'ST' },
  ],
};
