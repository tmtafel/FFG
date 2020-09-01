// To parse this data:
//
//   import { Convert, EspnData } from "./file";
//
//   const espnData = Convert.toEspnData(json);
export interface Espn {
    json: string;
    updated: string;
}

export interface EspnData {
    events: Event[];
}

export interface Event {
    id: string;
    uid: string;
    date: string;
    endDate: string;
    name: string;
    shortName: string;
    season: Season;
    competitions: Competition[];
    links: Link[];
    league: League;
    defendingChampion: DefendingChampion;
    tournament: Tournament;
    status: EventStatus;
    purse: number;
    displayPurse: string;
    playoffType: PlayoffType;
    courses: Course[];
    primary: boolean;
    hasPlayerStats: boolean;
    hasCourseStats: boolean;
}

export interface Competition {
    id: string;
    uid: string;
    date: string;
    endDate: string;
    scoringSystem: ScoringSystem;
    onWatchESPN: boolean;
    recent: boolean;
    competitors: Competitor[];
    status: CompetitionStatus;
    dataFormat: string;
    holeByHoleSource: HoleByHoleSource;
}

export interface Competitor {
    id: string;
    uid: string;
    athlete: CompetitorAthlete;
    status: CompetitorStatus;
    score: Score;
    linescores: Linescore[];
    movement: number;
    earnings: number;
    amateur: boolean;
    statistics: any[];
    featured: boolean;
    sortOrder: number;
}

export interface CompetitorAthlete {
    id: string;
    displayName: string;
    amateur: boolean;
    links: Headshot[];
    birthPlace?: BirthPlace;
    headshot?: Headshot;
    flag: Flag;
}

export interface BirthPlace {
    stateAbbreviation?: string;
    countryAbbreviation: string;
}

export interface Flag {
    href: string;
    alt: string;
}

export interface Headshot {
    href: string;
}

export interface Linescore {
    value: number;
    displayValue: Display;
    period: number;
    hasStream: boolean;
    teeTime: string;
}

export enum Display {
    Empty = "-",
}

export interface Score {
    displayValue: DisplayValue;
    value: number;
}

export enum DisplayValue {
    E = "E",
}

export interface CompetitorStatus {
    period: number;
    type: PurpleType;
    displayValue: Date;
    teeTime: string;
    startHole: number;
    position: Position;
    thru: number;
    playoff: boolean;
    behindCurrentRound: boolean;
}

export interface Position {
    id: string;
    displayName: Display;
    isTie: boolean;
}

export interface PurpleType {
    id: string;
    name: Name;
    state: State;
    completed?: boolean;
    description: Description;
    detail: Description;
    shortDetail: ShortDetail;
}

export enum Description {
    Scheduled = "Scheduled",
    ThuAugust12ThAt1200AMEDT = "Thu, August 12th at 12:00 AM EDT",
}

export enum Name {
    StatusScheduled = "STATUS_SCHEDULED",
}

export enum ShortDetail {
    Scheduled = "Scheduled",
    The8131200AmEdt = "8/13 - 12:00 AM EDT",
}

export enum State {
    Pre = "pre",
}

export interface HoleByHoleSource {
    id: string;
    description: string;
    state: string;
}

export interface ScoringSystem {
    id: string;
    name: string;
}

export interface CompetitionStatus {
    period: number;
    type: PurpleType;
}

export interface Course {
    id: string;
    name: string;
    address: Address;
    totalYards: number;
    shotsToPar: number;
    parIn: number;
    parOut: number;
    holes: Hole[];
    host: boolean;
}

export interface Address {
    city: string;
    state: string;
    country: string;
}

export interface Hole {
    number: number;
    shotsToPar: number;
    totalYards: number;
}

export interface DefendingChampion {
    athlete: DefendingChampionAthlete;
}

export interface DefendingChampionAthlete {
    id: string;
    displayName: string;
    amateur: boolean;
}

export interface League {
    id: string;
    name: string;
    abbreviation: string;
    shortName: string;
    slug: string;
}

export interface Link {
    language: string;
    rel: string[];
    href: string;
    text: string;
    shortText: string;
    isExternal: boolean;
    isPremium: boolean;
}

export interface PlayoffType {
    id: number;
    description: string;
    minimumHoles: number;
}

export interface Season {
    year: number;
}

export interface EventStatus {
    type: FluffyType;
}

export interface FluffyType {
    id: string;
    name: Name;
    state: State;
    completed: boolean;
    description: Description;
}

export interface Tournament {
    id: string;
    displayName: string;
    major: boolean;
    scoringSystem: ScoringSystem;
    numberOfRounds: number;
    cutRound: number;
    cutScore: number;
    cutCount: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toEspnData(json: string): EspnData {
        return JSON.parse(json);
    }
    public static toEspnEventData(json: string): Event {
        return JSON.parse(json);
    }
    public static espnDataToJson(value: EspnData): string {
        return JSON.stringify(value);
    }
}
