import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [DialogService],
})
export class App {
  protected readonly title = signal('intranet-frontend');
}
