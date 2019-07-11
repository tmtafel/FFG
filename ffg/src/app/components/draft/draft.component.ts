import { Component, OnInit } from '@angular/core';
import { DraftService } from 'src/app/services/draft.service';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})

export class DraftComponent implements OnInit {
  items: any[];
  constructor(private draftService: DraftService) { }

  ngOnInit() {
    this.getTeams();
  }

  getTeams(): void {
    this.draftService.getTeams().subscribe(draft => {
      console.log(draft);
      this.items = draft;
    });
  }

}
