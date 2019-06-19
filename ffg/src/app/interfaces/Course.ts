import { Hole } from './Hole';

export interface Course {
    number?: string;
    sortOrder?: string;
    name?: string;
    parValue?: string;
    yards?: string;
    body?: string;
    image?: string;
    holes?: Hole[];
}
