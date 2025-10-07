import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DocumentFile } from '../../../domain';

@Component({
  selector: 'document-list',
  imports: [TableModule],
  template: `
    <p-table
      [value]="documents()"
      showGridlines
      [tableStyle]="{ 'min-width': '50rem' }"
    >
      <ng-template #header>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
        </tr>
      </ng-template>
      <ng-template #body let-product>
        <tr>
          <td>{{ product.fileName }}</td>
          <td>{{ product }}</td>
          <td>{{ product }}</td>
          <td>{{ product }}</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  documents = input.required<DocumentFile[]>();
}
