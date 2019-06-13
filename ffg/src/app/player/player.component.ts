import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../statData';

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
  constructor() { }

  ngOnInit() {
    this.id = this.player.player_id;
    this.firstName = this.player.player_bio.first_name;
    this.lastName = this.player.player_bio.last_name;
    this.currentRound = this.player.current_round;
    this.score = this.player.total;
    this.currentPosition = this.player.current_position;
    this.cut = this.player.status === 'cut' || this.player.status === 'wd';
  }

}
