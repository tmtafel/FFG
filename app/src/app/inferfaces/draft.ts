

export class Draft {
    name: string;
    start: Date;
    end: Date;
    year: number;
    id: string;
    draftHasStarted: boolean;

    constructor(tournament: Trn) {
        this.name = tournament.trnName.official;
        this.start = new Date(tournament.date.start.toString());
        this.end = new Date(tournament.date.end.toString());
        this.year = parseInt(tournament.year.toString(), 0);
        this.id = tournament.permNum;
        this.draftHasStarted = false;
    }

    getDocumentObject(): any {
        return {
            name: this.name,
            start: this.start,
            end: this.end,
            year: this.year,
            id: this.id,
            draftHasStarted: this.draftHasStarted
        };
    }
}

export interface ScheduleData {
    header: Header;
    _comment: string;
    thisWeek: ThisWeek;
    currentYears: CurrentYears;
    years: Year[];
}

export interface CurrentYears {
    r: string;
    s: string;
    h: string;
    c: string;
    m: string;
    i: string;
    z: string;
}

export interface Header {
    version: string;
}

export interface ThisWeek {
    weekNumber: string;
    startDate: Date;
    endDate: Date;
}

export interface Year {
    year: string;
    tours: Tour[];
}

export interface Tour {
    desc: string;
    tourCodeLc: string;
    trns: Trn[];
}

export interface Trn {
    FedExCup?: FedExCup;
    coSponsored: FedExCup;
    format: Format;
    official: FedExCup;
    permNum: string;
    presBy: PresBy;
    primaryEvent?: PrimaryEvent;
    scored: string;
    timeZone: string;
    trnNum: string;
    trnType: TrnType;
    subEvents: string[];
    FedExCupPurse?: FedExCupPurse;
    FedExCupWinnerPoints?: string;
    Purse: string;
    winnersShare: string;
    trnName: TrnName;
    date: DateClass;
    courses: Course[];
    champions?: Champion[];
    links: Links;
    year: string;
    SchwabCup?: FedExCup;
    ''?: string;
    PrimaryEvent?: PrimaryEvent;
}

export enum FedExCup {
    Empty = '',
    FedExCupNO = 'NO',
    FedExCupYES = 'YES',
    No = 'No',
    Yes = 'Yes',
}

export enum FedExCupPurse {
    Empty = '',
    The10742 = '10,742',
    The11956 = '11,956',
    The1756 = '1,756',
    The2989 = '2,989',
    The3240 = '3,240',
    The3375 = '3,375',
}

export enum PrimaryEvent {
    N = 'N',
    Y = 'Y',
}

export interface Champion {
    isMember: FedExCup;
    plrNum: string;
    playerName: PlayerName;
    FedExCupWinnerShare?: string;
    winningShare: string;
}

export interface PlayerName {
    first: string;
    middle: string;
    last: string;
}

export interface Course {
    host: FedExCup;
    isTpc: FedExCup;
    number: string;
    rank: string;
    location: Location;
    courseName: string;
}

export interface Location {
    state: string;
    city: string;
    country: string;
}

export interface DateClass {
    weekNumber: string;
    start: Date;
    end: Date;
}

export enum Format {
    Match = 'Match',
    Stableford = 'Stableford',
    Stroke = 'Stroke',
    Team = 'Team',
}

export interface Links {
    trnLink: Link;
    lbLink: Link;
    ticketsLink: Link;
    hotelsLink: Link;
    flightsLink: Link;
    carsLink: Link;
    tpcLink: Link;
    teetimesLink: Link;
}

export interface Link {
    isLinked: IsLinked;
    overrideUrl: string;
}

export enum IsLinked {
    N = 'n',
    Y = 'y',
}

export enum PresBy {
    Empty = '',
    O = 'O',
}

export interface TrnName {
    official: string;
    long: string;
    medium: string;
    short: string;
}

export enum TrnType {
    Alt = 'ALT',
    Empty = '',
    Fnl = 'FNL',
    Lrs = 'LRS',
    Mjr = 'MJR',
    Oth = 'OTH',
    Plf = 'PLF',
    Pls = 'PLS',
    Std = 'STD',
    Wgc = 'WGC',
}

// Converts JSON strings to/from your types
export class ConvertSchedule {
    public static toTournamentsArray(json: any): Trn[] {
        const schedule = json as ScheduleData;
        const year = schedule.years.filter(y => y.year === schedule.currentYears.r)[0];
        const tour = year.tours.filter(y => y.tourCodeLc === 'r')[0];
        return tour.trns.filter(t => t.primaryEvent === 'Y');
    }

    public static toScheduleData(json: any): number {
        const schedule = json as ScheduleData;
        return parseInt(schedule.thisWeek.weekNumber, 0);
    }
}