import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { PortalService } from '../../services/portal.service';
import { PrimengFileIconPipe } from '../../../../shared';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-documents-by-category',
  imports: [CommonModule, TableModule, PrimengFileIconPipe, ButtonModule],
  templateUrl: './documents-by-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentsByCategoryComponent {
  private portalService = inject(PortalService);
  id = input.required<number>();

  documents = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      console.log(params.id);
      return this.portalService.getDocumentsByCategory({
        categoryId: params.id,
        offset: 0,
      });
    },
  });
}
