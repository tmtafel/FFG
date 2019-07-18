import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from 'src/app/interfaces/tournament';

@Component({
  selector: 'app-draft-details',
  templateUrl: './draft-details.component.html',
  styleUrls: ['./draft-details.component.scss']
})
export class DraftDetailsComponent implements OnInit {
  tournament: Tournament;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // this.tournament = products[+params.get('productId')];
    });
  }

}
