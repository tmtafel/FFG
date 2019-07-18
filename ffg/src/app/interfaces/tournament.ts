import { Trn } from './ScheduleData';

export class Tournament {
    name: string;
    year: string;
    tId: string;
    details: Trn;

    constructor(tournament: Trn) {
        this.name = tournament.trnName.official;
        this.year = tournament.year;
        this.tId = tournament.permNum;
        this.details = tournament;
    }

    getObject(): any {
        return {
            name: this.name,
            year: this.year,
            tId: this.tId,
            details: this.details
        };
    }
}
