import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  add(message: string, secondsShown: number = 2) {
    this.messages.push(message);
    setTimeout(() => this.messages.splice(0, 1), secondsShown * 1000);
  }
}
