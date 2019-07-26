import { Trn } from './ScheduleData';

export class Tournament {
    name: string;
    year: string;
    tId: string;
    docId: string;

    constructor(name: string, year: string, id: string) {
        this.name = name;
        this.year = year;
        this.tId = id;
    }

    getDocumentObject(): any {
        return {
            name: this.name,
            year: this.year,
            tId: this.tId
        };
    }
}
