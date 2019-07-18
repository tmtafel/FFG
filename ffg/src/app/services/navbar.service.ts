import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  title = '';

  setTitle(title: string) {
    this.title = title;
  }
}
