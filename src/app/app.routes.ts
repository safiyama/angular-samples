import { Routes } from '@angular/router';
import { SignalInputComponent } from './v18/signal-input/signal-input.component';
import { ModelInputComponent } from './v18/model-input/model-input.component';

export const routes: Routes = [
  {
    path: 'v18/signal-input',
    component: SignalInputComponent,
  },
  {
    path: 'v18/model-input',
    component: ModelInputComponent,
  },
];
