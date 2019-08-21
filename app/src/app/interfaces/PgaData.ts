// To parse this data:
//
//   import { Convert, PGAData } from "./file";
//
//   const pGAData = Convert.toPGAData(json);

export interface PGAData {
    debug: PGADataDebug;
    last_updated: Date;
    time_stamp: string;
    leaderboard: Leaderboard;
}

export interface PGADataDebug {
    msg_id: string;
    setup_file_found: boolean;
    setup_generated: Date;
    setup_year: string;
    current_round_in_setup: number;
    last_round_in_setup: number;
    schedule_file_found: boolean;
    schedule_generated: Date;
    tournament_in_schedule_file_found: boolean;
    tournament_in_schedule_file_name: string;
    format_in_schedule_file_name: string;
}

export interface Leaderboard {
    tour_code: string;
    tour_name: string;
    tournament_id: string;
    tournament_name: string;
    start_date: Date;
    end_date: Date;
    tournament_format: string;
    scoring_type: string;
    in_cup: boolean;
    total_rounds: number;
    is_started: boolean;
    is_finished: boolean;
    current_round: number;
    round_state: string;
    in_playoff: boolean;
    courses: Course[];
    cut_line: CutLine;
    players: Player[];
}

export interface Course {
    course_id: string;
    course_code: string;
    course_name: string;
    is_host: boolean;
    par_in: string;
    par_out: string;
    par_total: string;
    distance_in: number;
    distance_out: number;
    distance_total: number;
}

export interface CutLine {
    show_cut_line: boolean;
    cut_count: number;
    cut_line_score: number;
    show_projected: boolean;
    projected_count: null;
    paid_players_making_cut: number;
}

export interface Player {
    debug: PlayerDebug;
    player_id: string;
    player_bio: PlayerBio;
    current_position: string;
    start_position: string;
    status: Status;
    thru: null;
    start_hole: number;
    course_id: string;
    current_round: number;
    course_hole: null;
    today: null;
    total: number;
    total_strokes: null;
    rounds: Round[];
    rankings: Rankings;
    group_id: string;
}

export interface PlayerDebug {
    found_in_setup_file: boolean;
}

export interface PlayerBio {
    is_amateur: boolean;
    first_name: string;
    short_name: string;
    last_name: string;
    country: string;
    is_member: boolean;
}

export interface Rankings {
    cup_points: number | null;
    cup_rank: string;
    cup_trailing: number | null;
    projected_cup_points_total: number | null;
    projected_cup_points_event: number | null;
    projected_cup_rank: string;
    projected_money_total: number | null;
    projected_money_event: number;
    projected_money_rank: string;
    priority_proj_rank: string;
    priority_proj_sort: null;
    priority_start_rank: string;
    priority_start_sort: null;
    priority_seed: null;
    schwab_start_rank: string;
    schwab_proj_rank: string;
    money_start_rank: string;
    money_proj_rank: string;
    points_start_rank: null | string;
    points_proj_rank: null | string;
    top25_seed: null;
    start_rank: string;
    proj_rank: string;
    proj_sort: null;
}

export interface Round {
    round_number: number;
    strokes: null;
    tee_time: Date | null;
}

export enum Status {
    Active = 'active',
}
