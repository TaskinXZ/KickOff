import { Player, Team, Position, TacticalSetup, FormationName } from '../types';

export interface InitialData {
  teams: Record<string, Team>;
  players: Record<string, Player>;
}

function createPlayer(
  id: string,
  name: string,
  nationality: string,
  age: number,
  pos: Position,
  num: number,
  ovr: number,
  pot: number,
  stats: { pac: number; sho: number; pas: number; dri: number; def: number; phy: number; sta: number },
  valM: number,
  wageK: number
): Player {
  return {
    id,
    name,
    nationality,
    age,
    position: pos,
    number: num,
    overall: ovr,
    potential: pot,
    stats: {
      pace: stats.pac,
      shooting: stats.sho,
      passing: stats.pas,
      dribbling: stats.dri,
      defending: stats.def,
      physical: stats.phy,
      stamina: stats.sta,
    },
    currentStamina: 100,
    form: 7 + Math.floor(Math.random() * 3),
    morale: 8,
    value: valM * 1_000_000,
    wage: wageK * 1_000,
    contractYears: 2 + Math.floor(Math.random() * 3),
    seasonStats: { goals: 0, assists: 0, appearances: 0, cleanSheets: 0 },
    careerStats: { goals: Math.floor(ovr * 0.4), assists: Math.floor(ovr * 0.3), appearances: age * 12, cleanSheets: pos === 'GK' || pos === 'CB' ? age * 4 : 0 },
    isInjured: false,
    injuryWeeksRemaining: 0,
    yellowCards: 0,
    redCards: 0,
  };
}

export function generateInitialLeagueData(): InitialData {
  const players: Record<string, Player> = {};
  const teams: Record<string, Team> = {};

  const addP = (p: Player) => {
    players[p.id] = p;
    return p.id;
  };

  const defaultTactics: TacticalSetup = {
    formation: '4-3-3',
    mentality: 'Balanced',
    pressing: 'Mid Block',
    tempo: 'Standard',
  };

  // 1. ARSENAL (Featuring Martin Ødegaard!)
  const arsPlayers = [
    addP(createPlayer('ars_1', 'David Raya', 'Spain', 29, 'GK', 22, 86, 88, { pac: 58, sho: 40, pas: 78, dri: 65, def: 86, phy: 78, sta: 82 }, 45, 120)),
    addP(createPlayer('ars_2', 'Ben White', 'England', 27, 'RB', 4, 84, 86, { pac: 80, sho: 55, pas: 80, dri: 79, def: 84, phy: 80, sta: 88 }, 50, 150)),
    addP(createPlayer('ars_3', 'William Saliba', 'France', 23, 'CB', 2, 88, 93, { pac: 84, sho: 42, pas: 79, dri: 76, def: 89, phy: 86, sta: 89 }, 85, 190)),
    addP(createPlayer('ars_4', 'Gabriel Magalhães', 'Brazil', 26, 'CB', 6, 86, 89, { pac: 78, sho: 50, pas: 74, dri: 68, def: 87, phy: 88, sta: 87 }, 70, 160)),
    addP(createPlayer('ars_5', 'Jurrien Timber', 'Netherlands', 23, 'LB', 12, 82, 88, { pac: 83, sho: 55, pas: 79, dri: 80, def: 82, phy: 81, sta: 85 }, 42, 110)),
    addP(createPlayer('ars_6', 'Declan Rice', 'England', 25, 'CDM', 41, 88, 91, { pac: 78, sho: 74, pas: 83, dri: 81, def: 88, phy: 89, sta: 94 }, 110, 240)),
    addP(createPlayer('ars_7', 'Mikel Merino', 'Spain', 28, 'CM', 23, 84, 85, { pac: 72, sho: 76, pas: 82, dri: 81, def: 81, phy: 85, sta: 87 }, 45, 130)),
    addP(createPlayer('ars_8', 'Martin Ødegaard', 'Norway', 25, 'CAM', 8, 89, 92, { pac: 77, sho: 83, pas: 90, dri: 89, def: 64, phy: 73, sta: 90 }, 115, 250)),
    addP(createPlayer('ars_9', 'Bukayo Saka', 'England', 23, 'RW', 7, 88, 93, { pac: 87, sho: 84, pas: 83, dri: 88, def: 65, phy: 77, sta: 90 }, 125, 230)),
    addP(createPlayer('ars_10', 'Kai Havertz', 'Germany', 25, 'ST', 29, 84, 87, { pac: 82, sho: 82, pas: 80, dri: 83, def: 62, phy: 80, sta: 86 }, 65, 200)),
    addP(createPlayer('ars_11', 'Gabriel Martinelli', 'Brazil', 23, 'LW', 11, 84, 89, { pac: 89, sho: 79, pas: 77, dri: 86, def: 52, phy: 74, sta: 87 }, 70, 180)),
    // Bench
    addP(createPlayer('ars_12', 'Neto', 'Brazil', 35, 'GK', 32, 78, 78, { pac: 50, sho: 30, pas: 65, dri: 60, def: 78, phy: 75, sta: 70 }, 5, 60)),
    addP(createPlayer('ars_13', 'Riccardo Calafiori', 'Italy', 22, 'CB', 33, 83, 89, { pac: 80, sho: 60, pas: 78, dri: 79, def: 83, phy: 82, sta: 84 }, 45, 110)),
    addP(createPlayer('ars_14', 'Thomas Partey', 'Ghana', 31, 'CDM', 5, 83, 83, { pac: 68, sho: 74, pas: 82, dri: 81, def: 82, phy: 83, sta: 80 }, 25, 160)),
    addP(createPlayer('ars_15', 'Jorginho', 'Italy', 32, 'CM', 20, 81, 81, { pac: 55, sho: 68, pas: 85, dri: 80, def: 77, phy: 68, sta: 78 }, 12, 110)),
    addP(createPlayer('ars_16', 'Leandro Trossard', 'Belgium', 29, 'LW', 19, 83, 83, { pac: 79, sho: 83, pas: 81, dri: 84, def: 48, phy: 68, sta: 82 }, 35, 120)),
    addP(createPlayer('ars_17', 'Gabriel Jesus', 'Brazil', 27, 'ST', 9, 82, 84, { pac: 83, sho: 80, pas: 77, dri: 86, def: 45, phy: 74, sta: 82 }, 45, 160)),
    addP(createPlayer('ars_18', 'Ethan Nwaneri', 'England', 17, 'CAM', 53, 76, 91, { pac: 82, sho: 72, pas: 76, dri: 80, def: 40, phy: 65, sta: 75 }, 20, 30)),
  ];

  teams['arsenal'] = {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'ARS',
    country: 'England',
    city: 'London',
    stadium: 'Emirates Stadium',
    stadiumCapacity: 60704,
    primaryColor: '#EF0107',
    secondaryColor: '#FFFFFF',
    textColor: '#FFFFFF',
    budget: 95_000_000,
    wageBudget: 3_200_000,
    reputation: 5,
    players: arsPlayers,
    lineup: arsPlayers.slice(0, 11),
    bench: arsPlayers.slice(11, 18),
    tactics: { ...defaultTactics, pressing: 'Gegenpress', mentality: 'Attacking' },
    streak: 2,
  };

  // 2. REAL MADRID
  const rmaPlayers = [
    addP(createPlayer('rma_1', 'Thibaut Courtois', 'Belgium', 32, 'GK', 1, 89, 89, { pac: 50, sho: 35, pas: 75, dri: 60, def: 89, phy: 82, sta: 80 }, 40, 240)),
    addP(createPlayer('rma_2', 'Dani Carvajal', 'Spain', 32, 'RB', 2, 86, 86, { pac: 79, sho: 60, pas: 80, dri: 81, def: 84, phy: 82, sta: 85 }, 25, 180)),
    addP(createPlayer('rma_3', 'Antonio Rüdiger', 'Germany', 31, 'CB', 22, 88, 88, { pac: 83, sho: 54, pas: 72, dri: 69, def: 88, phy: 89, sta: 88 }, 45, 230)),
    addP(createPlayer('rma_4', 'Éder Militão', 'Brazil', 26, 'CB', 3, 86, 89, { pac: 84, sho: 50, pas: 72, dri: 71, def: 86, phy: 84, sta: 86 }, 65, 190)),
    addP(createPlayer('rma_5', 'Ferland Mendy', 'France', 29, 'LB', 23, 83, 83, { pac: 88, sho: 63, pas: 76, dri: 79, def: 82, phy: 84, sta: 86 }, 30, 150)),
    addP(createPlayer('rma_6', 'Aurélien Tchouaméni', 'France', 24, 'CDM', 14, 86, 90, { pac: 76, sho: 74, pas: 82, dri: 80, def: 85, phy: 87, sta: 89 }, 85, 200)),
    addP(createPlayer('rma_7', 'Federico Valverde', 'Uruguay', 26, 'CM', 8, 88, 91, { pac: 88, sho: 83, pas: 85, dri: 84, def: 81, phy: 85, sta: 95 }, 120, 240)),
    addP(createPlayer('rma_8', 'Jude Bellingham', 'England', 21, 'CAM', 5, 90, 95, { pac: 80, sho: 86, pas: 86, dri: 88, def: 78, phy: 85, sta: 92 }, 160, 300)),
    addP(createPlayer('rma_9', 'Rodrygo', 'Brazil', 23, 'RW', 11, 86, 91, { pac: 89, sho: 82, pas: 81, dri: 88, def: 45, phy: 68, sta: 85 }, 90, 200)),
    addP(createPlayer('rma_10', 'Kylian Mbappé', 'France', 25, 'ST', 9, 91, 94, { pac: 97, sho: 90, pas: 80, dri: 92, def: 38, phy: 78, sta: 89 }, 180, 450)),
    addP(createPlayer('rma_11', 'Vinícius Júnior', 'Brazil', 24, 'LW', 7, 90, 94, { pac: 95, sho: 84, pas: 81, dri: 91, def: 40, phy: 70, sta: 89 }, 170, 320)),
    // Bench
    addP(createPlayer('rma_12', 'Andriy Lunin', 'Ukraine', 25, 'GK', 13, 81, 86, { pac: 50, sho: 30, pas: 68, dri: 60, def: 81, phy: 76, sta: 75 }, 25, 90)),
    addP(createPlayer('rma_13', 'David Alaba', 'Austria', 32, 'CB', 4, 84, 84, { pac: 76, sho: 70, pas: 82, dri: 79, def: 83, phy: 76, sta: 78 }, 20, 210)),
    addP(createPlayer('rma_14', 'Eduardo Camavinga', 'France', 21, 'CM', 6, 86, 92, { pac: 81, sho: 72, pas: 83, dri: 85, def: 82, phy: 82, sta: 88 }, 85, 180)),
    addP(createPlayer('rma_15', 'Luka Modrić', 'Croatia', 39, 'CM', 10, 85, 85, { pac: 66, sho: 76, pas: 88, dri: 87, def: 72, phy: 66, sta: 74 }, 10, 180)),
    addP(createPlayer('rma_16', 'Brahim Díaz', 'Morocco', 25, 'RW', 21, 83, 86, { pac: 85, sho: 78, pas: 80, dri: 86, def: 42, phy: 60, sta: 80 }, 40, 120)),
    addP(createPlayer('rma_17', 'Arda Güler', 'Turkey', 19, 'CAM', 15, 80, 90, { pac: 74, sho: 79, pas: 83, dri: 84, def: 45, phy: 60, sta: 75 }, 35, 70)),
    addP(createPlayer('rma_18', 'Endrick', 'Brazil', 18, 'ST', 16, 78, 92, { pac: 87, sho: 80, pas: 68, dri: 80, def: 35, phy: 78, sta: 80 }, 40, 60)),
  ];

  teams['real_madrid'] = {
    id: 'real_madrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    country: 'Spain',
    city: 'Madrid',
    stadium: 'Santiago Bernabéu',
    stadiumCapacity: 83186,
    primaryColor: '#FFFFFF',
    secondaryColor: '#00529F',
    textColor: '#111827',
    budget: 120_000_000,
    wageBudget: 4_500_000,
    reputation: 5,
    players: rmaPlayers,
    lineup: rmaPlayers.slice(0, 11),
    bench: rmaPlayers.slice(11, 18),
    tactics: { ...defaultTactics, mentality: 'Attacking', tempo: 'Fast Counter' },
    streak: 3,
  };

  // 3. MANCHESTER CITY
  const mciPlayers = [
    addP(createPlayer('mci_1', 'Ederson', 'Brazil', 31, 'GK', 31, 88, 88, { pac: 62, sho: 40, pas: 86, dri: 72, def: 88, phy: 80, sta: 80 }, 40, 200)),
    addP(createPlayer('mci_2', 'Kyle Walker', 'England', 34, 'RB', 2, 83, 83, { pac: 87, sho: 62, pas: 76, dri: 78, def: 81, phy: 81, sta: 80 }, 15, 180)),
    addP(createPlayer('mci_3', 'Rúben Dias', 'Portugal', 27, 'CB', 3, 88, 90, { pac: 72, sho: 40, pas: 74, dri: 68, def: 89, phy: 87, sta: 88 }, 80, 220)),
    addP(createPlayer('mci_4', 'Manuel Akanji', 'Switzerland', 29, 'CB', 25, 84, 85, { pac: 80, sho: 50, pas: 77, dri: 76, def: 84, phy: 82, sta: 86 }, 42, 160)),
    addP(createPlayer('mci_5', 'Josko Gvardiol', 'Croatia', 22, 'LB', 24, 85, 91, { pac: 82, sho: 65, pas: 80, dri: 81, def: 85, phy: 84, sta: 87 }, 75, 170)),
    addP(createPlayer('mci_6', 'Rodri', 'Spain', 28, 'CDM', 16, 91, 92, { pac: 68, sho: 80, pas: 87, dri: 84, def: 89, phy: 88, sta: 92 }, 130, 280)),
    addP(createPlayer('mci_7', 'Ilkay Gündogan', 'Germany', 34, 'CM', 19, 85, 85, { pac: 68, sho: 80, pas: 87, dri: 84, def: 74, phy: 72, sta: 80 }, 20, 200)),
    addP(createPlayer('mci_8', 'Kevin De Bruyne', 'Belgium', 33, 'CAM', 17, 90, 90, { pac: 70, sho: 87, pas: 94, dri: 86, def: 65, phy: 75, sta: 82 }, 60, 380)),
    addP(createPlayer('mci_9', 'Bernardo Silva', 'Portugal', 30, 'RW', 20, 88, 88, { pac: 76, sho: 79, pas: 87, dri: 92, def: 68, phy: 73, sta: 92 }, 70, 240)),
    addP(createPlayer('mci_10', 'Erling Haaland', 'Norway', 24, 'ST', 9, 91, 94, { pac: 89, sho: 93, pas: 70, dri: 81, def: 45, phy: 91, sta: 87 }, 180, 420)),
    addP(createPlayer('mci_11', 'Phil Foden', 'England', 24, 'LW', 47, 88, 92, { pac: 85, sho: 84, pas: 86, dri: 89, def: 58, phy: 66, sta: 87 }, 120, 250)),
    // Bench
    addP(createPlayer('mci_12', 'Stefan Ortega', 'Germany', 31, 'GK', 18, 80, 81, { pac: 50, sho: 30, pas: 74, dri: 62, def: 80, phy: 74, sta: 75 }, 12, 70)),
    addP(createPlayer('mci_13', 'John Stones', 'England', 30, 'CB', 5, 85, 85, { pac: 72, sho: 55, pas: 82, dri: 80, def: 85, phy: 79, sta: 80 }, 40, 180)),
    addP(createPlayer('mci_14', 'Nathan Aké', 'Netherlands', 29, 'LB', 6, 83, 83, { pac: 76, sho: 52, pas: 76, dri: 74, def: 83, phy: 78, sta: 82 }, 35, 140)),
    addP(createPlayer('mci_15', 'Mateo Kovacic', 'Croatia', 30, 'CM', 8, 83, 83, { pac: 73, sho: 70, pas: 84, dri: 86, def: 75, phy: 74, sta: 82 }, 30, 160)),
    addP(createPlayer('mci_16', 'Jack Grealish', 'England', 29, 'LW', 10, 83, 83, { pac: 78, sho: 76, pas: 83, dri: 87, def: 52, phy: 74, sta: 80 }, 45, 200)),
    addP(createPlayer('mci_17', 'Jérémy Doku', 'Belgium', 22, 'RW', 11, 82, 88, { pac: 93, sho: 72, pas: 75, dri: 89, def: 35, phy: 68, sta: 82 }, 45, 100)),
    addP(createPlayer('mci_18', 'Savinho', 'Brazil', 20, 'RW', 26, 81, 89, { pac: 87, sho: 74, pas: 77, dri: 86, def: 38, phy: 62, sta: 80 }, 40, 80)),
  ];

  teams['man_city'] = {
    id: 'man_city',
    name: 'Manchester City',
    shortName: 'MCI',
    country: 'England',
    city: 'Manchester',
    stadium: 'Etihad Stadium',
    stadiumCapacity: 53400,
    primaryColor: '#6CABDD',
    secondaryColor: '#1C2C5B',
    textColor: '#FFFFFF',
    budget: 135_000_000,
    wageBudget: 4_800_000,
    reputation: 5,
    players: mciPlayers,
    lineup: mciPlayers.slice(0, 11),
    bench: mciPlayers.slice(11, 18),
    tactics: { ...defaultTactics, tempo: 'Slow & Patient', mentality: 'Attacking' },
    streak: 4,
  };

  // 4. BARCELONA
  const barPlayers = [
    addP(createPlayer('bar_1', 'Marc-André ter Stegen', 'Germany', 32, 'GK', 1, 88, 88, { pac: 55, sho: 35, pas: 84, dri: 68, def: 88, phy: 78, sta: 80 }, 30, 220)),
    addP(createPlayer('bar_2', 'Jules Koundé', 'France', 25, 'RB', 23, 86, 89, { pac: 84, sho: 50, pas: 77, dri: 79, def: 86, phy: 80, sta: 86 }, 65, 180)),
    addP(createPlayer('bar_3', 'Pau Cubarsí', 'Spain', 17, 'CB', 2, 82, 92, { pac: 72, sho: 40, pas: 84, dri: 75, def: 83, phy: 75, sta: 82 }, 40, 40)),
    addP(createPlayer('bar_4', 'Ronald Araújo', 'Uruguay', 25, 'CB', 4, 85, 89, { pac: 83, sho: 45, pas: 68, dri: 65, def: 86, phy: 88, sta: 84 }, 65, 170)),
    addP(createPlayer('bar_5', 'Alejandro Balde', 'Spain', 21, 'LB', 3, 82, 88, { pac: 91, sho: 52, pas: 74, dri: 82, def: 77, phy: 72, sta: 85 }, 42, 90)),
    addP(createPlayer('bar_6', 'Marc Casadó', 'Spain', 21, 'CDM', 17, 80, 87, { pac: 74, sho: 65, pas: 81, dri: 78, def: 80, phy: 78, sta: 88 }, 28, 50)),
    addP(createPlayer('bar_7', 'Pedri', 'Spain', 21, 'CM', 8, 87, 93, { pac: 78, sho: 76, pas: 88, dri: 90, def: 72, phy: 70, sta: 86 }, 105, 210)),
    addP(createPlayer('bar_8', 'Dani Olmo', 'Spain', 26, 'CAM', 20, 85, 87, { pac: 78, sho: 82, pas: 85, dri: 87, def: 55, phy: 68, sta: 82 }, 65, 190)),
    addP(createPlayer('bar_9', 'Lamine Yamal', 'Spain', 17, 'RW', 19, 85, 95, { pac: 87, sho: 80, pas: 84, dri: 89, def: 42, phy: 62, sta: 85 }, 120, 80)),
    addP(createPlayer('bar_10', 'Robert Lewandowski', 'Poland', 36, 'ST', 9, 88, 88, { pac: 72, sho: 90, pas: 78, dri: 83, def: 42, phy: 80, sta: 78 }, 25, 300)),
    addP(createPlayer('bar_11', 'Raphinha', 'Brazil', 27, 'LW', 11, 87, 88, { pac: 88, sho: 85, pas: 83, dri: 87, def: 56, phy: 75, sta: 89 }, 85, 210)),
    // Bench
    addP(createPlayer('bar_12', 'Iñaki Peña', 'Spain', 25, 'GK', 13, 76, 80, { pac: 50, sho: 30, pas: 66, dri: 55, def: 76, phy: 70, sta: 72 }, 8, 40)),
    addP(createPlayer('bar_13', 'Andreas Christensen', 'Denmark', 28, 'CB', 15, 83, 84, { pac: 70, sho: 45, pas: 77, dri: 72, def: 84, phy: 77, sta: 80 }, 30, 130)),
    addP(createPlayer('bar_14', 'Frenkie de Jong', 'Netherlands', 27, 'CM', 21, 87, 89, { pac: 81, sho: 70, pas: 87, dri: 88, def: 78, phy: 78, sta: 87 }, 80, 280)),
    addP(createPlayer('bar_15', 'Gavi', 'Spain', 20, 'CM', 6, 84, 91, { pac: 76, sho: 72, pas: 82, dri: 84, def: 75, phy: 80, sta: 88 }, 75, 140)),
    addP(createPlayer('bar_16', 'Fermín López', 'Spain', 21, 'CAM', 16, 81, 88, { pac: 80, sho: 80, pas: 78, dri: 81, def: 60, phy: 72, sta: 84 }, 35, 60)),
    addP(createPlayer('bar_17', 'Ferran Torres', 'Spain', 24, 'LW', 7, 81, 84, { pac: 82, sho: 80, pas: 77, dri: 81, def: 45, phy: 72, sta: 82 }, 35, 110)),
    addP(createPlayer('bar_18', 'Pau Víctor', 'Spain', 22, 'ST', 18, 75, 82, { pac: 78, sho: 76, pas: 68, dri: 75, def: 35, phy: 70, sta: 78 }, 12, 25)),
  ];

  teams['barcelona'] = {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'BAR',
    country: 'Spain',
    city: 'Barcelona',
    stadium: 'Spotify Camp Nou',
    stadiumCapacity: 99354,
    primaryColor: '#A50044',
    secondaryColor: '#004D98',
    textColor: '#EDBB00',
    budget: 65_000_000,
    wageBudget: 3_800_000,
    reputation: 5,
    players: barPlayers,
    lineup: barPlayers.slice(0, 11),
    bench: barPlayers.slice(11, 18),
    tactics: { ...defaultTactics, formation: '4-2-3-1', pressing: 'Gegenpress', mentality: 'Attacking' },
    streak: 3,
  };

  // 5. LIVERPOOL
  const livPlayers = [
    addP(createPlayer('liv_1', 'Alisson Becker', 'Brazil', 32, 'GK', 1, 89, 89, { pac: 55, sho: 40, pas: 84, dri: 70, def: 89, phy: 82, sta: 80 }, 40, 220)),
    addP(createPlayer('liv_2', 'Trent Alexander-Arnold', 'England', 26, 'RB', 66, 87, 89, { pac: 76, sho: 78, pas: 91, dri: 82, def: 79, phy: 74, sta: 87 }, 85, 210)),
    addP(createPlayer('liv_3', 'Virgil van Dijk', 'Netherlands', 33, 'CB', 4, 89, 89, { pac: 76, sho: 58, pas: 78, dri: 71, def: 90, phy: 87, sta: 84 }, 35, 240)),
    addP(createPlayer('liv_4', 'Ibrahima Konaté', 'France', 25, 'CB', 5, 84, 88, { pac: 80, sho: 38, pas: 68, dri: 67, def: 85, phy: 87, sta: 84 }, 55, 140)),
    addP(createPlayer('liv_5', 'Andy Robertson', 'Scotland', 30, 'LB', 26, 84, 84, { pac: 82, sho: 61, pas: 80, dri: 79, def: 81, phy: 76, sta: 90 }, 30, 160)),
    addP(createPlayer('liv_6', 'Ryan Gravenberch', 'Netherlands', 22, 'CDM', 38, 83, 89, { pac: 80, sho: 74, pas: 82, dri: 85, def: 79, phy: 82, sta: 88 }, 50, 120)),
    addP(createPlayer('liv_7', 'Alexis Mac Allister', 'Argentina', 25, 'CM', 10, 86, 89, { pac: 73, sho: 80, pas: 85, dri: 84, def: 79, phy: 77, sta: 89 }, 80, 190)),
    addP(createPlayer('liv_8', 'Dominik Szoboszlai', 'Hungary', 24, 'CAM', 8, 84, 88, { pac: 84, sho: 84, pas: 84, dri: 83, def: 64, phy: 79, sta: 90 }, 65, 160)),
    addP(createPlayer('liv_9', 'Mohamed Salah', 'Egypt', 32, 'RW', 11, 89, 89, { pac: 88, sho: 88, pas: 84, dri: 87, def: 45, phy: 75, sta: 86 }, 60, 350)),
    addP(createPlayer('liv_10', 'Darwin Núñez', 'Uruguay', 25, 'ST', 9, 83, 87, { pac: 90, sho: 82, pas: 72, dri: 80, def: 42, phy: 86, sta: 86 }, 60, 170)),
    addP(createPlayer('liv_11', 'Luis Díaz', 'Colombia', 27, 'LW', 7, 85, 86, { pac: 90, sho: 81, pas: 77, dri: 87, def: 44, phy: 74, sta: 88 }, 75, 170)),
    // Bench
    addP(createPlayer('liv_12', 'Caoimhín Kelleher', 'Ireland', 25, 'GK', 62, 80, 84, { pac: 50, sho: 30, pas: 70, dri: 60, def: 80, phy: 74, sta: 75 }, 20, 60)),
    addP(createPlayer('liv_13', 'Joe Gomez', 'England', 27, 'CB', 2, 80, 82, { pac: 82, sho: 40, pas: 72, dri: 72, def: 80, phy: 79, sta: 80 }, 25, 90)),
    addP(createPlayer('liv_14', 'Kostas Tsimikas', 'Greece', 28, 'LB', 21, 79, 80, { pac: 80, sho: 58, pas: 77, dri: 78, def: 77, phy: 74, sta: 82 }, 18, 80)),
    addP(createPlayer('liv_15', 'Wataru Endo', 'Japan', 31, 'CDM', 3, 81, 81, { pac: 66, sho: 65, pas: 78, dri: 74, def: 82, phy: 80, sta: 86 }, 14, 90)),
    addP(createPlayer('liv_16', 'Curtis Jones', 'England', 23, 'CM', 17, 81, 86, { pac: 77, sho: 75, pas: 80, dri: 82, def: 72, phy: 76, sta: 84 }, 30, 85)),
    addP(createPlayer('liv_17', 'Cody Gakpo', 'Netherlands', 25, 'LW', 18, 83, 86, { pac: 84, sho: 82, pas: 79, dri: 83, def: 46, phy: 78, sta: 84 }, 50, 140)),
    addP(createPlayer('liv_18', 'Diogo Jota', 'Portugal', 27, 'ST', 20, 84, 85, { pac: 82, sho: 85, pas: 76, dri: 84, def: 52, phy: 77, sta: 83 }, 55, 160)),
  ];

  teams['liverpool'] = {
    id: 'liverpool',
    name: 'Liverpool FC',
    shortName: 'LIV',
    country: 'England',
    city: 'Liverpool',
    stadium: 'Anfield',
    stadiumCapacity: 61276,
    primaryColor: '#C8102E',
    secondaryColor: '#00B2A9',
    textColor: '#FFFFFF',
    budget: 90_000_000,
    wageBudget: 3_600_000,
    reputation: 5,
    players: livPlayers,
    lineup: livPlayers.slice(0, 11),
    bench: livPlayers.slice(11, 18),
    tactics: { ...defaultTactics, pressing: 'Gegenpress', mentality: 'Attacking', tempo: 'Fast Counter' },
    streak: 3,
  };

  // 6. BAYERN MUNICH
  const bayPlayers = [
    addP(createPlayer('bay_1', 'Manuel Neuer', 'Germany', 38, 'GK', 1, 87, 87, { pac: 50, sho: 40, pas: 85, dri: 70, def: 87, phy: 80, sta: 74 }, 15, 250)),
    addP(createPlayer('bay_2', 'Josip Stanisic', 'Croatia', 24, 'RB', 2, 81, 86, { pac: 78, sho: 55, pas: 76, dri: 75, def: 82, phy: 79, sta: 84 }, 28, 90)),
    addP(createPlayer('bay_3', 'Dayot Upamecano', 'France', 26, 'CB', 2, 84, 87, { pac: 82, sho: 42, pas: 72, dri: 68, def: 84, phy: 86, sta: 84 }, 48, 160)),
    addP(createPlayer('bay_4', 'Min-jae Kim', 'South Korea', 27, 'CB', 3, 84, 86, { pac: 80, sho: 40, pas: 68, dri: 65, def: 85, phy: 87, sta: 86 }, 45, 170)),
    addP(createPlayer('bay_5', 'Alphonso Davies', 'Canada', 23, 'LB', 19, 85, 89, { pac: 95, sho: 68, pas: 78, dri: 85, def: 78, phy: 77, sta: 88 }, 70, 180)),
    addP(createPlayer('bay_6', 'Joshua Kimmich', 'Germany', 29, 'CDM', 6, 88, 88, { pac: 68, sho: 74, pas: 89, dri: 83, def: 83, phy: 80, sta: 92 }, 75, 280)),
    addP(createPlayer('bay_7', 'Joao Palhinha', 'Portugal', 29, 'CDM', 16, 85, 85, { pac: 66, sho: 62, pas: 76, dri: 74, def: 87, phy: 88, sta: 88 }, 55, 180)),
    addP(createPlayer('bay_8', 'Jamal Musiala', 'Germany', 21, 'CAM', 42, 88, 94, { pac: 86, sho: 83, pas: 84, dri: 92, def: 55, phy: 68, sta: 86 }, 130, 220)),
    addP(createPlayer('bay_9', 'Michael Olise', 'France', 22, 'RW', 17, 84, 90, { pac: 84, sho: 80, pas: 84, dri: 87, def: 45, phy: 68, sta: 84 }, 65, 150)),
    addP(createPlayer('bay_10', 'Harry Kane', 'England', 31, 'ST', 9, 90, 90, { pac: 70, sho: 93, pas: 85, dri: 83, def: 48, phy: 83, sta: 84 }, 90, 400)),
    addP(createPlayer('bay_11', 'Leroy Sané', 'Germany', 28, 'LW', 10, 85, 85, { pac: 91, sho: 82, pas: 80, dri: 86, def: 40, phy: 72, sta: 82 }, 60, 260)),
    // Bench
    addP(createPlayer('bay_12', 'Daniel Peretz', 'Israel', 24, 'GK', 18, 76, 82, { pac: 50, sho: 30, pas: 65, dri: 55, def: 76, phy: 72, sta: 74 }, 8, 40)),
    addP(createPlayer('bay_13', 'Eric Dier', 'England', 30, 'CB', 15, 80, 80, { pac: 60, sho: 64, pas: 74, dri: 66, def: 81, phy: 82, sta: 78 }, 14, 110)),
    addP(createPlayer('bay_14', 'Raphael Guerreiro', 'Portugal', 30, 'LB', 22, 82, 82, { pac: 74, sho: 76, pas: 84, dri: 84, def: 74, phy: 65, sta: 80 }, 20, 130)),
    addP(createPlayer('bay_15', 'Leon Goretzka', 'Germany', 29, 'CM', 8, 83, 83, { pac: 75, sho: 80, pas: 81, dri: 80, def: 78, phy: 85, sta: 84 }, 35, 220)),
    addP(createPlayer('bay_16', 'Serge Gnabry', 'Germany', 29, 'RW', 7, 82, 82, { pac: 82, sho: 83, pas: 78, dri: 83, def: 44, phy: 72, sta: 80 }, 35, 200)),
    addP(createPlayer('bay_17', 'Kingsley Coman', 'France', 28, 'LW', 11, 83, 83, { pac: 89, sho: 77, pas: 78, dri: 86, def: 32, phy: 62, sta: 78 }, 40, 200)),
    addP(createPlayer('bay_18', 'Mathys Tel', 'France', 19, 'ST', 39, 78, 89, { pac: 87, sho: 78, pas: 72, dri: 81, def: 35, phy: 74, sta: 80 }, 35, 60)),
  ];

  teams['bayern'] = {
    id: 'bayern',
    name: 'Bayern Munich',
    shortName: 'BAY',
    country: 'Germany',
    city: 'Munich',
    stadium: 'Allianz Arena',
    stadiumCapacity: 75024,
    primaryColor: '#DC052D',
    secondaryColor: '#0066B2',
    textColor: '#FFFFFF',
    budget: 110_000_000,
    wageBudget: 4_200_000,
    reputation: 5,
    players: bayPlayers,
    lineup: bayPlayers.slice(0, 11),
    bench: bayPlayers.slice(11, 18),
    tactics: { ...defaultTactics, formation: '4-2-3-1', mentality: 'Attacking' },
    streak: 2,
  };

  // Helper generator to quickly generate the remaining 26 clubs with authentic rosters
  interface ClubConfig {
    id: string;
    name: string;
    short: string;
    country: string;
    city: string;
    stadium: string;
    cap: number;
    pri: string;
    sec: string;
    txt: string;
    bud: number;
    wage: number;
    rep: number;
    formation: FormationName;
    stars: [string, Position, number, number, number, number][]; // [name, pos, ovr, pot, val, wage]
  }

  const remainingClubs: ClubConfig[] = [
    {
      id: 'leverkusen', name: 'Bayer Leverkusen', short: 'B04', country: 'Germany', city: 'Leverkusen',
      stadium: 'BayArena', cap: 30210, pri: '#E32221', sec: '#000000', txt: '#FFFFFF', bud: 75, wage: 2.2, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Lukas Hradecky', 'GK', 83, 83, 15, 80],
        ['Jonathan Tah', 'CB', 85, 86, 45, 140],
        ['Edmond Tapsoba', 'CB', 84, 87, 45, 120],
        ['Piero Hincapie', 'CB', 83, 88, 42, 100],
        ['Jeremie Frimpong', 'RB', 85, 88, 65, 150],
        ['Alejandro Grimaldo', 'LB', 86, 86, 55, 160],
        ['Granit Xhaka', 'CDM', 86, 86, 35, 160],
        ['Exequiel Palacios', 'CM', 84, 87, 48, 120],
        ['Florian Wirtz', 'CAM', 89, 94, 130, 220],
        ['Victor Boniface', 'ST', 83, 88, 55, 120],
        ['Patrik Schick', 'ST', 82, 83, 30, 110],
      ]
    },
    {
      id: 'inter', name: 'Inter Milan', short: 'INT', country: 'Italy', city: 'Milan',
      stadium: 'San Siro', cap: 75923, pri: '#0068A8', sec: '#000000', txt: '#FFFFFF', bud: 60, wage: 2.8, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Yann Sommer', 'GK', 85, 85, 12, 110],
        ['Alessandro Bastoni', 'CB', 87, 90, 80, 160],
        ['Benjamin Pavard', 'CB', 84, 85, 45, 130],
        ['Francesco Acerbi', 'CB', 83, 83, 8, 90],
        ['Denzel Dumfries', 'RB', 83, 84, 38, 110],
        ['Federico Dimarco', 'LB', 85, 86, 55, 140],
        ['Hakan Çalhanoglu', 'CDM', 86, 86, 45, 160],
        ['Nicolò Barella', 'CM', 87, 89, 85, 190],
        ['Henrikh Mkhitaryan', 'CM', 82, 82, 10, 100],
        ['Marcus Thuram', 'ST', 85, 86, 65, 160],
        ['Lautaro Martínez', 'ST', 89, 90, 110, 240],
      ]
    },
    {
      id: 'psg', name: 'Paris Saint-Germain', short: 'PSG', country: 'France', city: 'Paris',
      stadium: 'Parc des Princes', cap: 47929, pri: '#004170', sec: '#DA291C', txt: '#FFFFFF', bud: 140, wage: 4.0, rep: 5,
      formation: '4-3-3',
      stars: [
        ['Gianluigi Donnarumma', 'GK', 88, 91, 55, 230],
        ['Achraf Hakimi', 'RB', 86, 88, 70, 210],
        ['Marquinhos', 'CB', 86, 86, 45, 240],
        ['Willian Pacho', 'CB', 82, 87, 40, 90],
        ['Nuno Mendes', 'LB', 83, 88, 48, 120],
        ['Vitinha', 'CM', 85, 89, 65, 150],
        ['Warren Zaïre-Emery', 'CM', 83, 90, 60, 110],
        ['Joao Neves', 'CM', 83, 90, 60, 120],
        ['Ousmane Dembélé', 'RW', 86, 86, 65, 260],
        ['Gonçalo Ramos', 'ST', 82, 86, 45, 130],
        ['Bradley Barcola', 'LW', 84, 89, 65, 120],
      ]
    },
    {
      id: 'dortmund', name: 'Borussia Dortmund', short: 'BVB', country: 'Germany', city: 'Dortmund',
      stadium: 'Signal Iduna Park', cap: 81365, pri: '#FDE100', sec: '#000000', txt: '#000000', bud: 65, wage: 2.3, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Gregor Kobel', 'GK', 87, 89, 50, 130],
        ['Yan Couto', 'RB', 81, 87, 30, 70],
        ['Nico Schlotterbeck', 'CB', 85, 88, 55, 140],
        ['Waldemar Anton', 'CB', 82, 83, 28, 90],
        ['Ramy Bensebaini', 'LB', 79, 79, 14, 75],
        ['Emre Can', 'CDM', 82, 82, 20, 120],
        ['Pascal Groß', 'CM', 82, 82, 15, 100],
        ['Julian Brandt', 'CAM', 85, 85, 50, 150],
        ['Donyell Malen', 'RW', 82, 84, 38, 100],
        ['Serhou Guirassy', 'ST', 84, 85, 45, 130],
        ['Karim Adeyemi', 'LW', 81, 86, 40, 90],
      ]
    },
    {
      id: 'atletico', name: 'Atlético Madrid', short: 'ATM', country: 'Spain', city: 'Madrid',
      stadium: 'Metropolitano', cap: 70460, pri: '#CB3524', sec: '#272E61', txt: '#FFFFFF', bud: 70, wage: 2.7, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Jan Oblak', 'GK', 88, 88, 35, 230],
        ['Nahuel Molina', 'RB', 82, 84, 32, 90],
        ['Robin Le Normand', 'CB', 84, 86, 45, 120],
        ['José Giménez', 'CB', 83, 83, 28, 110],
        ['Reinildo', 'LB', 81, 81, 18, 80],
        ['Rodrigo De Paul', 'CM', 84, 84, 40, 130],
        ['Koke', 'CM', 83, 83, 18, 140],
        ['Conor Gallagher', 'CM', 82, 85, 42, 110],
        ['Antoine Griezmann', 'CAM', 88, 88, 50, 260],
        ['Julián Álvarez', 'ST', 86, 91, 90, 200],
        ['Alexander Sørloth', 'ST', 82, 83, 30, 95],
      ]
    },
    {
      id: 'chelsea', name: 'Chelsea FC', short: 'CHE', country: 'England', city: 'London',
      stadium: 'Stamford Bridge', cap: 40343, pri: '#034694', sec: '#FFFFFF', txt: '#FFFFFF', bud: 100, wage: 3.4, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Robert Sánchez', 'GK', 81, 83, 25, 80],
        ['Reece James', 'RB', 84, 86, 50, 180],
        ['Levi Colwill', 'CB', 82, 88, 45, 90],
        ['Wesley Fofana', 'CB', 81, 86, 40, 120],
        ['Marc Cucurella', 'LB', 82, 83, 35, 120],
        ['Moisés Caicedo', 'CDM', 85, 89, 75, 170],
        ['Enzo Fernández', 'CM', 84, 88, 70, 180],
        ['Cole Palmer', 'CAM', 87, 92, 105, 190],
        ['Noni Madueke', 'RW', 81, 86, 38, 85],
        ['Nicolas Jackson', 'ST', 81, 86, 45, 95],
        ['Pedro Neto', 'LW', 82, 86, 45, 110],
      ]
    },
    {
      id: 'juventus', name: 'Juventus', short: 'JUV', country: 'Italy', city: 'Turin',
      stadium: 'Allianz Stadium', cap: 41507, pri: '#000000', sec: '#FFFFFF', txt: '#FFFFFF', bud: 65, wage: 2.6, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Michele Di Gregorio', 'GK', 84, 86, 35, 95],
        ['Nicolò Savona', 'RB', 78, 85, 20, 40],
        ['Bremer', 'CB', 86, 88, 65, 160],
        ['Pierre Kalulu', 'CB', 81, 85, 30, 80],
        ['Andrea Cambiaso', 'LB', 82, 87, 40, 85],
        ['Manuel Locatelli', 'CDM', 83, 84, 38, 120],
        ['Khéphren Thuram', 'CM', 82, 87, 42, 90],
        ['Teun Koopmeiners', 'CAM', 85, 87, 60, 160],
        ['Francisco Conceição', 'RW', 81, 87, 35, 75],
        ['Dušan Vlahovic', 'ST', 85, 88, 70, 210],
        ['Kenan Yildiz', 'LW', 81, 90, 45, 60],
      ]
    },
    {
      id: 'milan', name: 'AC Milan', short: 'MIL', country: 'Italy', city: 'Milan',
      stadium: 'San Siro', cap: 75923, pri: '#FB090B', sec: '#000000', txt: '#FFFFFF', bud: 55, wage: 2.4, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Mike Maignan', 'GK', 87, 88, 50, 170],
        ['Emerson Royal', 'RB', 79, 81, 20, 75],
        ['Fikayo Tomori', 'CB', 83, 85, 40, 110],
        ['Strahinja Pavlovic', 'CB', 81, 86, 32, 80],
        ['Theo Hernández', 'LB', 87, 88, 75, 180],
        ['Youssouf Fofana', 'CDM', 83, 85, 38, 100],
        ['Tijjani Reijnders', 'CM', 84, 87, 50, 110],
        ['Christian Pulisic', 'CAM', 84, 85, 50, 140],
        ['Samuel Chukwueze', 'RW', 80, 82, 28, 85],
        ['Álvaro Morata', 'ST', 83, 83, 25, 140],
        ['Rafael Leao', 'LW', 87, 90, 95, 200],
      ]
    },
    {
      id: 'tottenham', name: 'Tottenham Hotspur', short: 'TOT', country: 'England', city: 'London',
      stadium: 'Tottenham Hotspur Stadium', cap: 62850, pri: '#132257', sec: '#FFFFFF', txt: '#FFFFFF', bud: 80, wage: 2.8, rep: 4,
      formation: '4-3-3',
      stars: [
        ['Guglielmo Vicario', 'GK', 84, 86, 38, 95],
        ['Pedro Porro', 'RB', 83, 86, 45, 110],
        ['Cristian Romero', 'CB', 85, 87, 60, 150],
        ['Micky van de Ven', 'CB', 84, 89, 58, 110],
        ['Destiny Udogie', 'LB', 82, 88, 45, 85],
        ['Yves Bissouma', 'CDM', 82, 83, 32, 100],
        ['Pape Matar Sarr', 'CM', 81, 87, 38, 75],
        ['James Maddison', 'CAM', 85, 86, 58, 160],
        ['Dejan Kulusevski', 'RW', 83, 86, 50, 120],
        ['Dominic Solanke', 'ST', 82, 83, 45, 120],
        ['Son Heung-min', 'LW', 87, 87, 50, 240],
      ]
    },
    {
      id: 'man_united', name: 'Manchester United', short: 'MUN', country: 'England', city: 'Manchester',
      stadium: 'Old Trafford', cap: 74310, pri: '#DA291C', sec: '#000000', txt: '#FFFFFF', bud: 85, wage: 3.5, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['André Onana', 'GK', 83, 85, 35, 130],
        ['Noussair Mazraoui', 'RB', 81, 82, 28, 90],
        ['Matthijs de Ligt', 'CB', 84, 87, 50, 180],
        ['Lisandro Martínez', 'CB', 84, 87, 52, 140],
        ['Diogo Dalot', 'LB', 82, 85, 38, 100],
        ['Manuel Ugarte', 'CDM', 82, 86, 45, 110],
        ['Kobbie Mainoo', 'CM', 81, 90, 50, 50],
        ['Bruno Fernandes', 'CAM', 87, 87, 65, 270],
        ['Alejandro Garnacho', 'RW', 82, 89, 55, 90],
        ['Rasmus Højlund', 'ST', 80, 87, 45, 95],
        ['Marcus Rashford', 'LW', 83, 84, 50, 250],
      ]
    },
    {
      id: 'aston_villa', name: 'Aston Villa', short: 'AVL', country: 'England', city: 'Birmingham',
      stadium: 'Villa Park', cap: 42682, pri: '#95BFE5', sec: '#670E36', txt: '#FFFFFF', bud: 60, wage: 2.2, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Emiliano Martínez', 'GK', 87, 87, 35, 150],
        ['Matty Cash', 'RB', 80, 81, 24, 75],
        ['Ezri Konsa', 'CB', 83, 85, 40, 100],
        ['Pau Torres', 'CB', 84, 86, 45, 120],
        ['Lucas Digne', 'LB', 80, 80, 18, 100],
        ['Boubacar Kamara', 'CDM', 82, 86, 40, 95],
        ['Youri Tielemans', 'CM', 82, 83, 35, 120],
        ['John McGinn', 'CM', 82, 82, 30, 110],
        ['Leon Bailey', 'RW', 82, 83, 38, 100],
        ['Ollie Watkins', 'ST', 85, 85, 60, 150],
        ['Morgan Rogers', 'LW', 80, 87, 35, 60],
      ]
    },
    {
      id: 'newcastle', name: 'Newcastle United', short: 'NEW', country: 'England', city: 'Newcastle',
      stadium: 'St. James\' Park', cap: 52305, pri: '#241F20', sec: '#FFFFFF', txt: '#FFFFFF', bud: 75, wage: 2.4, rep: 4,
      formation: '4-3-3',
      stars: [
        ['Nick Pope', 'GK', 83, 83, 20, 100],
        ['Tino Livramento', 'RB', 81, 87, 35, 75],
        ['Fabian Schär', 'CB', 82, 82, 16, 90],
        ['Sven Botman', 'CB', 83, 87, 45, 110],
        ['Lewis Hall', 'LB', 79, 86, 28, 55],
        ['Bruno Guimarães', 'CDM', 86, 88, 75, 180],
        ['Sandro Tonali', 'CM', 84, 87, 55, 150],
        ['Joelinton', 'CM', 82, 83, 35, 110],
        ['Jacob Murphy', 'RW', 79, 79, 18, 70],
        ['Alexander Isak', 'ST', 86, 89, 85, 160],
        ['Anthony Gordon', 'LW', 83, 87, 58, 110],
      ]
    },
    {
      id: 'napoli', name: 'SSC Napoli', short: 'NAP', country: 'Italy', city: 'Naples',
      stadium: 'Stadio Diego Armando Maradona', cap: 54726, pri: '#008FD7', sec: '#FFFFFF', txt: '#FFFFFF', bud: 55, wage: 2.3, rep: 4,
      formation: '4-3-3',
      stars: [
        ['Alex Meret', 'GK', 81, 83, 22, 75],
        ['Giovanni Di Lorenzo', 'RB', 83, 83, 25, 110],
        ['Amir Rrahmani', 'CB', 81, 81, 20, 80],
        ['Alessandro Buongiorno', 'CB', 83, 87, 42, 95],
        ['Mathías Olivera', 'LB', 79, 81, 18, 65],
        ['Stanislav Lobotka', 'CDM', 84, 84, 38, 110],
        ['André-Frank Zambo Anguissa', 'CM', 82, 82, 30, 95],
        ['Scott McTominay', 'CM', 82, 83, 35, 100],
        ['Matteo Politano', 'RW', 81, 81, 22, 85],
        ['Romelu Lukaku', 'ST', 83, 83, 30, 160],
        ['Khvicha Kvaratskhelia', 'LW', 86, 89, 85, 140],
      ]
    },
    {
      id: 'atalanta', name: 'Atalanta BC', short: 'ATA', country: 'Italy', city: 'Bergamo',
      stadium: 'Gewiss Stadium', cap: 24950, pri: '#1E71B8', sec: '#000000', txt: '#FFFFFF', bud: 45, wage: 1.8, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Marco Carnesecchi', 'GK', 82, 87, 30, 65],
        ['Berat Djimsiti', 'CB', 81, 81, 18, 70],
        ['Isak Hien', 'CB', 81, 85, 25, 65],
        ['Sead Kolašinac', 'CB', 80, 80, 12, 75],
        ['Raoul Bellanova', 'RB', 81, 86, 30, 65],
        ['Matteo Ruggeri', 'LB', 80, 85, 24, 55],
        ['Éderson', 'CM', 83, 87, 45, 85],
        ['Marten de Roon', 'CM', 81, 81, 14, 75],
        ['Charles De Ketelaere', 'CAM', 83, 88, 45, 85],
        ['Mateo Retegui', 'ST', 82, 85, 35, 80],
        ['Ademola Lookman', 'ST', 85, 86, 55, 110],
      ]
    },
    {
      id: 'sporting', name: 'Sporting CP', short: 'SCP', country: 'Portugal', city: 'Lisbon',
      stadium: 'Estádio José Alvalade', cap: 50095, pri: '#008057', sec: '#FFFFFF', txt: '#FFFFFF', bud: 40, wage: 1.5, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Franco Israel', 'GK', 79, 84, 16, 40],
        ['Ousmane Diomande', 'CB', 82, 89, 45, 60],
        ['Gonçalo Inácio', 'CB', 83, 88, 48, 70],
        ['Zeno Debast', 'CB', 80, 86, 26, 50],
        ['Geovany Quenda', 'RB', 78, 89, 25, 30],
        ['Maxi Araújo', 'LB', 79, 83, 20, 45],
        ['Morten Hjulmand', 'CDM', 83, 86, 42, 75],
        ['Hidemasa Morita', 'CM', 81, 81, 22, 60],
        ['Francisco Trincao', 'RW', 82, 85, 35, 70],
        ['Pedro Gonçalves', 'LW', 83, 85, 40, 80],
        ['Viktor Gyökeres', 'ST', 87, 88, 80, 120],
      ]
    },
    {
      id: 'benfica', name: 'SL Benfica', short: 'SLB', country: 'Portugal', city: 'Lisbon',
      stadium: 'Estádio da Luz', cap: 64642, pri: '#E30613', sec: '#FFFFFF', txt: '#FFFFFF', bud: 42, wage: 1.6, rep: 4,
      formation: '4-2-3-1',
      stars: [
        ['Anatoliy Trubin', 'GK', 82, 87, 32, 65],
        ['Alexander Bah', 'RB', 80, 83, 22, 55],
        ['António Silva', 'CB', 82, 88, 42, 60],
        ['Nicolás Otamendi', 'CB', 81, 81, 8, 85],
        ['Álvaro Carreras', 'LB', 79, 85, 22, 40],
        ['Florentino Luís', 'CDM', 81, 85, 30, 60],
        ['Orkun Kökçü', 'CM', 83, 86, 40, 85],
        ['Fredrik Aursnes', 'CM', 81, 82, 24, 65],
        ['Ángel Di María', 'RW', 83, 83, 15, 120],
        ['Vangelis Pavlidis', 'ST', 82, 84, 32, 75],
        ['Kerem Aktürkoglu', 'LW', 82, 83, 30, 75],
      ]
    },
    {
      id: 'porto', name: 'FC Porto', short: 'FCP', country: 'Portugal', city: 'Porto',
      stadium: 'Estádio do Dragão', cap: 50033, pri: '#003882', sec: '#FFFFFF', txt: '#FFFFFF', bud: 35, wage: 1.4, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Diogo Costa', 'GK', 85, 89, 55, 95],
        ['João Mário', 'RB', 79, 81, 18, 45],
        ['Nehuén Pérez', 'CB', 80, 83, 22, 55],
        ['Zé Pedro', 'CB', 77, 80, 10, 35],
        ['Francisco Moura', 'LB', 78, 82, 14, 35],
        ['Alan Varela', 'CDM', 82, 87, 38, 65],
        ['Nico González', 'CM', 80, 85, 25, 50],
        ['Stephen Eustáquio', 'CM', 78, 79, 14, 40],
        ['Pepê', 'RW', 81, 82, 28, 65],
        ['Samu Omorodion', 'ST', 81, 88, 38, 50],
        ['Galeno', 'LW', 82, 83, 32, 70],
      ]
    },
    {
      id: 'ajax', name: 'AFC Ajax', short: 'AJX', country: 'Netherlands', city: 'Amsterdam',
      stadium: 'Johan Cruyff Arena', cap: 55865, pri: '#D2122E', sec: '#FFFFFF', txt: '#FFFFFF', bud: 38, wage: 1.5, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Remko Pasveer', 'GK', 77, 77, 3, 35],
        ['Devyne Rensch', 'RB', 78, 83, 18, 40],
        ['Josip Sutalo', 'CB', 80, 84, 24, 55],
        ['Youri Baas', 'CB', 76, 81, 12, 25],
        ['Jorrel Hato', 'LB', 80, 89, 35, 45],
        ['Jordan Henderson', 'CDM', 80, 80, 10, 100],
        ['Kenneth Taylor', 'CM', 80, 85, 25, 50],
        ['Kian Fitz-Jim', 'CM', 76, 83, 14, 25],
        ['Bertrand Traoré', 'RW', 78, 78, 14, 55],
        ['Brian Brobbey', 'ST', 81, 86, 35, 65],
        ['Mika Godts', 'LW', 77, 86, 20, 25],
      ]
    },
    {
      id: 'psv', name: 'PSV Eindhoven', short: 'PSV', country: 'Netherlands', city: 'Eindhoven',
      stadium: 'Philips Stadion', cap: 35000, pri: '#EE0000', sec: '#FFFFFF', txt: '#FFFFFF', bud: 36, wage: 1.4, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Walter Benítez', 'GK', 81, 81, 18, 55],
        ['Rick Karsdorp', 'RB', 78, 78, 12, 45],
        ['Ryan Flamingo', 'CB', 78, 84, 18, 35],
        ['Olivier Boscagli', 'CB', 81, 82, 25, 60],
        ['Matteo Dams', 'LB', 75, 82, 10, 20],
        ['Jerdy Schouten', 'CDM', 82, 83, 30, 70],
        ['Joey Veerman', 'CM', 83, 85, 38, 75],
        ['Guus Til', 'CAM', 80, 81, 20, 50],
        ['Johan Bakayoko', 'RW', 82, 88, 45, 65],
        ['Luuk de Jong', 'ST', 82, 82, 15, 80],
        ['Noa Lang', 'LW', 80, 82, 24, 60],
      ]
    },
    {
      id: 'feyenoord', name: 'Feyenoord', short: 'FEY', country: 'Netherlands', city: 'Rotterdam',
      stadium: 'De Kuip', cap: 47500, pri: '#ED1C24', sec: '#FFFFFF', txt: '#FFFFFF', bud: 32, wage: 1.3, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Timon Wellenreuther', 'GK', 78, 79, 12, 40],
        ['Jordan Lotomba', 'RB', 77, 79, 12, 35],
        ['Gernot Trauner', 'CB', 79, 79, 8, 45],
        ['Dávid Hancko', 'CB', 83, 85, 38, 70],
        ['Quilindschy Hartman', 'LB', 80, 85, 25, 45],
        ['Ramiz Zerrouki', 'CDM', 78, 80, 14, 40],
        ['Quinten Timber', 'CM', 82, 86, 35, 65],
        ['Antoni Milambo', 'CAM', 77, 85, 20, 25],
        ['Ibrahim Osman', 'RW', 77, 85, 18, 30],
        ['Santiago Giménez', 'ST', 83, 86, 45, 75],
        ['Igor Paixão', 'LW', 80, 83, 24, 50],
      ]
    },
    {
      id: 'roma', name: 'AS Roma', short: 'ROM', country: 'Italy', city: 'Rome',
      stadium: 'Stadio Olimpico', cap: 70634, pri: '#8E1F2F', sec: '#F1AB00', txt: '#FFFFFF', bud: 50, wage: 2.3, rep: 4,
      formation: '3-5-2',
      stars: [
        ['Mile Svilar', 'GK', 81, 85, 25, 65],
        ['Gianluca Mancini', 'CB', 82, 83, 26, 95],
        ['Evan Ndicka', 'CB', 81, 84, 25, 85],
        ['Mats Hummels', 'CB', 82, 82, 10, 100],
        ['Zeki Çelik', 'RB', 78, 79, 12, 50],
        ['Angeliño', 'LB', 80, 80, 16, 75],
        ['Bryan Cristante', 'CDM', 81, 81, 20, 85],
        ['Manu Koné', 'CM', 81, 86, 32, 70],
        ['Lorenzo Pellegrini', 'CAM', 82, 82, 28, 120],
        ['Paulo Dybala', 'ST', 86, 86, 45, 180],
        ['Artem Dovbyk', 'ST', 83, 85, 40, 100],
      ]
    },
    {
      id: 'bilbao', name: 'Athletic Club', short: 'ATH', country: 'Spain', city: 'Bilbao',
      stadium: 'San Mamés', cap: 53289, pri: '#EE2524', sec: '#FFFFFF', txt: '#FFFFFF', bud: 45, wage: 1.8, rep: 3,
      formation: '4-2-3-1',
      stars: [
        ['Unai Simón', 'GK', 85, 87, 45, 110],
        ['Óscar de Marcos', 'RB', 79, 79, 6, 50],
        ['Dani Vivian', 'CB', 83, 86, 38, 85],
        ['Aitor Paredes', 'CB', 80, 84, 24, 55],
        ['Yuri Berchiche', 'LB', 80, 80, 10, 65],
        ['Beñat Prados', 'CDM', 80, 85, 25, 50],
        ['Mikel Vesga', 'CM', 79, 79, 14, 55],
        ['Oihan Sancet', 'CAM', 83, 87, 45, 90],
        ['Iñaki Williams', 'RW', 82, 82, 28, 110],
        ['Gorka Guruzeta', 'ST', 81, 82, 24, 70],
        ['Nico Williams', 'LW', 86, 90, 80, 160],
      ]
    },
    {
      id: 'sociedad', name: 'Real Sociedad', short: 'RSO', country: 'Spain', city: 'San Sebastián',
      stadium: 'Anoeta', cap: 39313, pri: '#0067B1', sec: '#FFFFFF', txt: '#FFFFFF', bud: 40, wage: 1.7, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Álex Remiro', 'GK', 83, 84, 28, 80],
        ['Jon Aramburu', 'RB', 78, 84, 18, 35],
        ['Igor Zubeldia', 'CB', 81, 82, 22, 65],
        ['Nayef Aguerd', 'CB', 81, 82, 24, 80],
        ['Javi López', 'LB', 78, 83, 16, 40],
        ['Martín Zubimendi', 'CDM', 85, 88, 65, 120],
        ['Brais Méndez', 'CM', 82, 83, 30, 80],
        ['Luka Sucic', 'CM', 80, 86, 25, 55],
        ['Takefusa Kubo', 'RW', 84, 88, 55, 110],
        ['Mikel Oyarzabal', 'ST', 83, 83, 35, 120],
        ['Sergio Gómez', 'LW', 80, 85, 25, 60],
      ]
    },
    {
      id: 'galatasaray', name: 'Galatasaray SK', short: 'GAL', country: 'Turkey', city: 'Istanbul',
      stadium: 'Rams Park', cap: 52280, pri: '#A90432', sec: '#FDB912', txt: '#FFFFFF', bud: 35, wage: 1.6, rep: 3,
      formation: '4-2-3-1',
      stars: [
        ['Fernando Muslera', 'GK', 80, 80, 6, 70],
        ['Kaan Ayhan', 'RB', 78, 78, 10, 45],
        ['Davinson Sánchez', 'CB', 82, 83, 25, 80],
        ['Abdulkerim Bardakci', 'CB', 80, 80, 14, 55],
        ['Ismail Jakobs', 'LB', 77, 79, 12, 45],
        ['Lucas Torreira', 'CDM', 82, 83, 26, 85],
        ['Gabriel Sara', 'CM', 81, 85, 30, 70],
        ['Dries Mertens', 'CAM', 80, 80, 6, 80],
        ['Baris Alper Yilmaz', 'RW', 80, 84, 25, 55],
        ['Victor Osimhen', 'ST', 88, 90, 95, 230],
        ['Roland Sallai', 'LW', 79, 80, 15, 50],
      ]
    },
    {
      id: 'fenerbahce', name: 'Fenerbahçe SK', short: 'FEN', country: 'Turkey', city: 'Istanbul',
      stadium: 'Ülker Stadium', cap: 47834, pri: '#002D72', sec: '#FEDB00', txt: '#FFFFFF', bud: 35, wage: 1.6, rep: 3,
      formation: '4-2-3-1',
      stars: [
        ['Dominik Livakovic', 'GK', 82, 84, 25, 75],
        ['Bright Osayi-Samuel', 'RB', 78, 80, 14, 45],
        ['Rodrigo Becão', 'CB', 79, 80, 16, 55],
        ['Alexander Djiku', 'CB', 80, 80, 18, 55],
        ['Jayden Oosterwolde', 'LB', 79, 85, 22, 45],
        ['Sofyan Amrabat', 'CDM', 81, 82, 24, 75],
        ['Fred', 'CM', 82, 82, 22, 85],
        ['Sebastian Szymanski', 'CAM', 81, 85, 28, 65],
        ['Dusan Tadic', 'RW', 82, 82, 12, 100],
        ['Edin Džeko', 'ST', 81, 81, 8, 95],
        ['Allan Saint-Maximin', 'LW', 81, 81, 24, 110],
      ]
    },
    {
      id: 'celtic', name: 'Celtic FC', short: 'CEL', country: 'Scotland', city: 'Glasgow',
      stadium: 'Celtic Park', cap: 60411, pri: '#018749', sec: '#FFFFFF', txt: '#FFFFFF', bud: 28, wage: 1.1, rep: 3,
      formation: '4-3-3',
      stars: [
        ['Kasper Schmeichel', 'GK', 80, 80, 6, 60],
        ['Alistair Johnston', 'RB', 78, 81, 14, 35],
        ['Cameron Carter-Vickers', 'CB', 80, 82, 18, 50],
        ['Auston Trusty', 'CB', 77, 80, 10, 35],
        ['Greg Taylor', 'LB', 77, 78, 10, 35],
        ['Callum McGregor', 'CDM', 81, 81, 16, 65],
        ['Reo Hatate', 'CM', 79, 82, 16, 40],
        ['Arne Engels', 'CM', 78, 85, 20, 40],
        ['Nicolas Kühn', 'RW', 79, 83, 16, 35],
        ['Kyogo Furuhashi', 'ST', 81, 81, 20, 60],
        ['Daizen Maeda', 'LW', 78, 79, 14, 40],
      ]
    }
  ];

  // Helper to complete each club's squad with generated bench players
  remainingClubs.forEach((c) => {
    const clubPlayerIds: string[] = [];
    c.stars.forEach(([name, pos, ovr, pot, val, wage], idx) => {
      const pId = `${c.id}_${idx + 1}`;
      const pace = pos === 'GK' ? 50 : Math.min(96, Math.max(65, ovr + (pos === 'LW' || pos === 'RW' || pos === 'LB' || pos === 'RB' ? 6 : -4)));
      const sho = pos === 'ST' ? ovr + 2 : (pos === 'LW' || pos === 'RW' || pos === 'CAM' ? ovr - 2 : (pos === 'CM' ? ovr - 8 : 45));
      const pas = pos === 'CAM' || pos === 'CM' ? ovr + 3 : (pos === 'CDM' || pos === 'RB' || pos === 'LB' ? ovr - 4 : (pos === 'CB' ? ovr - 10 : 70));
      const dri = pos === 'LW' || pos === 'RW' || pos === 'CAM' ? ovr + 2 : (pos === 'ST' || pos === 'CM' ? ovr - 2 : 65);
      const def = pos === 'CB' ? ovr + 3 : (pos === 'CDM' ? ovr : (pos === 'LB' || pos === 'RB' ? ovr - 2 : 45));
      const phy = pos === 'CB' || pos === 'ST' || pos === 'CDM' ? ovr + 2 : ovr - 5;
      
      const p = createPlayer(pId, name, c.country, 22 + Math.floor(Math.random() * 8), pos, idx + 1, ovr, pot, {
        pac: pace,
        sho: Math.max(30, sho),
        pas: Math.max(35, pas),
        dri: Math.max(40, dri),
        def: Math.max(25, def),
        phy: Math.max(50, phy),
        sta: 80 + Math.floor(Math.random() * 12),
      }, val, wage);
      addP(p);
      clubPlayerIds.push(pId);
    });

    // Add 7 realistic bench subs
    const benchPositions: Position[] = ['GK', 'CB', 'LB', 'CDM', 'CM', 'RW', 'ST'];
    benchPositions.forEach((bPos, bIdx) => {
      const bId = `${c.id}_bench_${bIdx + 1}`;
      const baseOvr = Math.max(72, c.stars[0][2] - 5);
      const p = createPlayer(
        bId,
        `Squad Sub ${bIdx + 1} (${c.short})`,
        c.country,
        19 + Math.floor(Math.random() * 9),
        bPos,
        14 + bIdx,
        baseOvr,
        baseOvr + 4,
        { pac: 75, sho: 70, pas: 72, dri: 73, def: 70, phy: 72, sta: 82 },
        Math.floor(c.bud * 0.15),
        Math.floor(c.wage * 25)
      );
      addP(p);
      clubPlayerIds.push(bId);
    });

    teams[c.id] = {
      id: c.id,
      name: c.name,
      shortName: c.short,
      country: c.country,
      city: c.city,
      stadium: c.stadium,
      stadiumCapacity: c.cap,
      primaryColor: c.pri,
      secondaryColor: c.sec,
      textColor: c.txt,
      budget: c.bud * 1_000_000,
      wageBudget: c.wage * 1_000_000,
      reputation: c.rep,
      players: clubPlayerIds,
      lineup: clubPlayerIds.slice(0, 11),
      bench: clubPlayerIds.slice(11, 18),
      tactics: {
        ...defaultTactics,
        formation: c.formation,
      },
      streak: 0,
    };
  });

  return { teams, players };
}
