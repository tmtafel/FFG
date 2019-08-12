import { Trn } from '../ScheduleData';

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
            startDraft: this.draftHasStarted
        };
    }
}
