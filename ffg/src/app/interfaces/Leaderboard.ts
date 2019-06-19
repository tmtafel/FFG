import { Course } from './Course';
import { CutLine } from './CutLine';
import { Player } from './Player';

export interface Leaderboard {
    tour_code?: string;
    tour_name?: string;
    tournament_id?: string;
    tournament_name?: string;
    start_date?: Date;
    end_date?: Date;
    tournament_format?: string;
    scoring_type?: string;
    in_cup?: boolean;
    total_rounds?: number;
    is_started?: boolean;
    is_finished?: boolean;
    current_round?: number;
    round_state?: string;
    in_playoff?: boolean;
    cut_line?: CutLine;
    players?: Player[];
}
