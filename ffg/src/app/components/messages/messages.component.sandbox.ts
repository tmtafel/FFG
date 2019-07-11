import { sandboxOf } from 'angular-playground';
import { MessagesComponent } from './messages.component';

export default sandboxOf(MessagesComponent)
  .add('default', {
    template: `<app-messages></app-messages>`
  });
