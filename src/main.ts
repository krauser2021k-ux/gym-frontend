import { bootstrapApplication } from '@angular/platform-browser';
import { AppShellComponent } from './app/app-shell.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppShellComponent, appConfig)
  .catch(err => console.error(err));
