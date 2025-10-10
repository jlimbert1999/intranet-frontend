import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { PrimengFileIconPipe } from '../../../../shared';
import { DocumentFile } from '../../../domain';

@Component({
  selector: 'document-list',
  imports: [CommonModule, TableModule, ButtonModule, PrimengFileIconPipe],
  template: `
    <p-table [value]="documents()"  responsiveLayout="stack" showGridlines scrollHeight="flex">
      <ng-template #header>
        <tr>
          <th>Nombre</th>
          <th>Gestión</th>
          <th>Seccion</th>
          <th style="width: 4rem"></th>
        </tr>
      </ng-template>
      <ng-template #body let-doc>
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <i
                [ngClass]="doc.originalName | primengFileIcon"
                style="font-size: 1.5rem"
              ></i>
              <span>{{ doc.originalName }}</span>
            </div>
          </td>
          <td>{{ doc.fiscalYear }}</td>
          <td>{{ doc.createdAt | date : 'shortDate' }}</td>
          <td>
            <p-button
              icon="pi pi-download"
              [rounded]="true"
              [text]="true"
              size="small"
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  documents = input.required<DocumentFile[]>();
}
