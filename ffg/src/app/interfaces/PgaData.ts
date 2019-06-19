import { Leaderboard } from './Leaderboard';
import { Course } from './Course';

export interface StatJson {
    last_updated?: Date;
    time_stamp?: string;
    leaderboard?: Leaderboard;
}

export interface CourseJson {
    pageType?: string;
    tourCode?: string;
    permNum?: string;
    pageTitle?: string;
    courses?: Course[];
}

export class Convert {
    public static toStatData(json: string): StatJson {
        return JSON.parse(json);
    }
    public static toCourseData(json: string): CourseJson {
        return JSON.parse(json);
    }
}
