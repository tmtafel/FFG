import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/interfaces/PgaData';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;
  currentPosition: string;
  firstName: string;
  lastName: string;
  thru: string;
  score: number;
  constructor() { }

  ngOnInit() {
    this.currentPosition = this.player.current_position;
    this.firstName = this.player.player_bio.first_name;
    this.lastName = this.player.player_bio.last_name;
    this.thru = this.player.thru;
    this.score = this.player.total;
  }
}
