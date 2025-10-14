import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalService } from '../../services/portal.service';
import {
  DocumentListComponent,
  FilterFormDocumentsComponent,
} from '../../components';

import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document-repository',
  imports: [CommonModule, DocumentListComponent, FilterFormDocumentsComponent],
  templateUrl: './document-repository.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentRepositoryComponent {
  private portalService = inject(PortalService);

  dataSize = this.portalService.totalDocuments;
  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  dataSource = signal<any[]>([]);

  constructor() {}

  ngOnInit() {
    this.getData();
  }

  getData(filterParams?: object) {
    this.portalService
      .filterDocuments({
        limit: this.limit(),
        offset: this.offset(),
        ...filterParams,
      })
      .subscribe((documents) => {
        this.dataSource.set(documents);
      });
  }

  changePage(event: { index: number; limit: number }) {
    this.limit.set(event.limit);
    this.index.set(event.index);
    console.log(this.offset());
  }
}
