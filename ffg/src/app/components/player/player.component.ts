import { Component, OnInit, Input } from '@angular/core';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { Player } from '../../interfaces/Player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;
  id: string;
  firstName: string;
  lastName: string;
  currentRound: number;
  score: number;
  currentPosition: string;
  cut: boolean;
  captain: string;

  constructor() { }

  ngOnInit() {
    this.id = this.player.player_id;
    this.firstName = this.player.player_bio.first_name;
    this.lastName = this.player.player_bio.last_name;
    this.currentRound = this.player.current_round;
    this.score = this.player.total;
    this.currentPosition = this.player.current_position;
    this.cut = this.player.status === 'cut' || this.player.status === 'wd';
    this.captain = null;
  }
  
  name(): string {
    return this.firstName + ' ' + this.lastName;
  }

  addCaptain(name): void {
    this.captain = name;
  }

  //   teeTime(): moment {
  //     if (this.cut) { return null; }
  //     return moment(player.rounds[this.currentRound - 1].tee_time);
  //   }
  // this.scoreFormatted(): = function () {
  //   if (this.cut) return "MC";
  //   return this.score === 0 ? "E" : this.score > 0 ? "+" + this.score : this.score;
  // };
  // this.thru = function () {
  //   if (this.cut) return null;
  //   if (player.thru === null) {
  //     return this.teeTime().format('h:mm a');
  //   }
  //   if (player.thru === 18) {
  //     return this.rounds[this.currentRound - 1].strokes + ' (F)';
  //   }
  //   var score = this.rounds[this.currentRound - 1];
  //   return player.thru + " (" + this.today() + ")";
  // };
  // this.today = function () {
  //   if (this.cut) return "";
  //   if (player.thru === null || player.thru === 18) {
  //     return "";
  //   }
  //   return player.today === 0 ? "E" : player.today > 0 ? "+" + player.today : player.today;
  // };
  // this.currentPositionFormatted = function () {
  //   if (this.cut) return "MC";
  //   return this.currentPosition == "" ? "" : this.currentPosition.replace('T', '');
  // };
  // this.hasStarted = function () {
  //   return player.current_position != "";
  // };
}
