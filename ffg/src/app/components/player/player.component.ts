import { Component, OnInit, Input } from '@angular/core';
import { Player } from 'src/app/interfaces/PgaData';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit() {
  }
}
