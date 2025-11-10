import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';

import { PortalTutorialData } from '../../services';

@Component({
  selector: 'app-tutorials-page',
  imports: [CommonModule, InputTextModule],
  templateUrl: './tutorials-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TutorialsPage {
  private potalTutorialData = inject(PortalTutorialData);

  private resource = rxResource({
    stream: () => this.potalTutorialData.getTutorials(),
    defaultValue: { tutorials: [], total: 0 },
  });

  dataSource = computed(() => this.resource.value().tutorials);
}
