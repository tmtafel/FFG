import { PlayerBio } from './PlayerBio';
import { Round } from './Round';
import { Rankings } from './Rankings';

export interface Player {
    player_id?: string;
    player_bio?: PlayerBio;
    current_position?: string;
    start_position?: string;
    status?: string;
    thru?: number | null;
    start_hole?: number;
    course_id?: string;
    current_round?: number;
    course_hole?: number | null;
    today?: number | null;
    total?: number;
    total_strokes?: null;
    rounds?: Round[];
    rankings?: Rankings;
    group_id?: string;
}
