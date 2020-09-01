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
    winner?: Winner;
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
    leaders?: CompetitionLeader[];
    dataFormat: string;
}

export interface Competitor {
    id: string;
    uid: string;
    athlete: CompetitorAthlete;
    status: CompetitorStatus;
    score: Score;
    linescores: Linescore[];
    statistics: Statistic[];
    movement: number;
    earnings: number;
    amateur: boolean;
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
    displayValue: string;
    period: number;
    inScore: number;
    outScore?: number;
    hasStream: boolean;
    startPosition: number;
    currentPosition: number;
    teeTime?: string;
    isPlayoff?: boolean;
}

export interface Score {
    value: number;
    displayValue: string;
}

export interface Statistic {
    name: StatisticName;
    value?: number;
    displayValue: string;
}

export enum StatisticName {
    CupPoints = 'cupPoints',
    OfficialAmount = 'officialAmount',
    ScoreToPar = 'scoreToPar',
}

export interface CompetitorStatus {
    period: number;
    type: PurpleType;
    displayValue: ShortDetail;
    position: Position;
    behindCurrentRound: boolean;
    hole?: number;
    startHole?: number;
}

export enum ShortDetail {
    Complete = 'Complete',
    Cut = 'CUT',
    F = 'F',
}

export interface Position {
    id: string;
    displayName: string;
    isTie: boolean;
}

export interface PurpleType {
    id: string;
    name: TypeName;
    state: State;
    completed?: boolean;
    description: Description;
    detail: Description;
    shortDetail: ShortDetail;
}

export enum Description {
    Canceled = 'Canceled',
    Final = 'Final',
    Finish = 'Finish',
    MissedCut = 'Missed Cut',
}

export enum TypeName {
    StatusCanceled = 'STATUS_CANCELED',
    StatusCut = 'STATUS_CUT',
    StatusFinal = 'STATUS_FINAL',
    StatusFinish = 'STATUS_FINISH',
}

export enum State {
    Post = 'post',
}

export interface CompetitionLeader {
    name: string;
    displayName: string;
    shortDisplayName: string;
    abbreviation: string;
    leaders: LeaderLeader[];
}

export interface LeaderLeader {
    displayValue: string;
    value: number;
    athlete: Winner;
}

export interface Winner {
    id: string;
    displayName: string;
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
    zipCode?: string;
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
    name: TypeName;
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
