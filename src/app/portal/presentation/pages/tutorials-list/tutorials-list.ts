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
import { PaginatorModule } from 'primeng/paginator';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tutorials-list',
  imports: [CommonModule, InputTextModule, PaginatorModule, RouterLink],
  templateUrl: './tutorials-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TutorialsList {
  private potalTutorialData = inject(PortalTutorialData);

  private resource = rxResource({
    stream: () => this.potalTutorialData.getTutorials(),
    defaultValue: { tutorials: [], total: 0 },
  });

  dataSource = computed(() => this.resource.value().tutorials);
}
