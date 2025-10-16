import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { PrimengFileIconPipe } from '../../../../shared';
import { DocumentFile } from '../../../domain';

@Component({
  selector: 'document-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ButtonModule,
    SelectButton,
    DataViewModule,
    PaginatorModule,
    PrimengFileIconPipe,
  ],
  template: `
    <p-dataview #dv [value]="dataSource()" [layout]="layout">
      <ng-template #header>
        <div class="flex justify-between items-center">
          <p class="text-xl font-medium">Listado de Documentos</p>
          <p-selectbutton
            [(ngModel)]="layout"
            [options]="options"
            [allowEmpty]="false"
          >
            <ng-template #item let-item>
              <i
                class="pi "
                [ngClass]="{
                  'pi-bars': item === 'list',
                  'pi-table': item === 'grid'
                }"
              ></i>
            </ng-template>
          </p-selectbutton>
        </div>
      </ng-template>
      <ng-template #list let-items>
        @for (item of items; track $index; let first=$first) {
        <!-- <div
          class="flex flex-col sm:flex-row sm:items-center p-4 gap-4"
          [ngClass]="{ 'border-t border-surface-200': !first }"
        >
          <div
            class="flex justify-center items-center h-20 w-full md:w-20 bg-slate-100 rounded-2xl"
          >
            <i
              [ngClass]="item.originalName | primengFileIcon"
              style="font-size: 2.5rem;"
            ></i>
          </div>
          <div
            class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4"
          >
            <div
              class="flex flex-row md:flex-col justify-between items-start gap-4"
            >
              <div>
                <span class="font-medium text-surface-500 text-xs">
                  Gestión {{ item.fiscalYear }}
                </span>
                <div class="md:text-xl font-medium mt-2">
                  {{ item.originalName }}
                </div>
              </div>
            </div>
            <div
              class="flex items-center flex-row sm:flex-col justify-between md:items-end gap-4"
            >
              <span class="text-sm font-semibold">
                {{ item.createdAt | date : 'short' }}
              </span>
              <div class="flex justify-end md:justify-center">
                <button
                  pButton
                  icon="pi pi-download"
                  [outlined]="true"
                ></button>
              </div>
            </div>
          </div>
        </div> -->
        <div
          class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
          [ngClass]="{
            'border-t border-surface-200 dark:border-surface-700': !first
          }"
        >
          <div class="md:w-40 bg-slate-100 flex justify-center">
             <i
              [ngClass]="item.originalName | primengFileIcon"
              style="font-size: 2.5rem;"
            ></i>
          </div>
          <div
            class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
          >
            <div
              class="flex flex-row md:flex-col justify-between items-start gap-2"
            >
              <div>
                <span
                  class="font-medium text-surface-500 dark:text-surface-400 text-sm"
                  >test</span
                >
                <div class="text-lg font-medium mt-2">{{ item.originalName }}</div>
              </div>
              <div class="bg-surface-100 p-1" style="border-radius: 30px">
                <div
                  class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                  style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)"
                >
                  <span class="text-surface-900 font-medium text-sm">{{
                    item.rating
                  }}</span>
                  <i class="pi pi-star-fill text-yellow-500"></i>
                </div>
              </div>
            </div>
            <div class="flex flex-col md:items-end gap-8">
              <span class="text-xl font-semibold">{{
                item.price | currency : 'USD'
              }}</span>
              <div class="flex flex-row-reverse md:flex-row gap-2">
                <button pButton icon="pi pi-heart" [outlined]="true">
                  
                </button>
                <!-- <button
                  pButton
                  icon="pi pi-shopping-cart"
                  label="Buy Now"
                  [disabled]="item.inventoryStatus === 'OUTOFSTOCK'"
                  class="flex-auto md:flex-initial whitespace-nowrap"
                ></button> -->
              </div>
            </div>
          </div>
        </div>

        }
      </ng-template>
      <ng-template #grid let-items>
        <div class="grid grid-cols-12 gap-4">
          @for (item of items; track $index) {
          <div
            class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2"
          >
            <div
              class="p-6 border border-surface-200 bg-surface-0 rounded flex flex-col"
            >
              <div class="bg-surface-50 flex justify-center rounded p-4">
                <i
                  [ngClass]="item.originalName | primengFileIcon"
                  style="font-size: 4rem;"
                ></i>
              </div>
              <div class="pt-6">
                <div class="flex flex-row justify-between products-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 text-sm">
                      Gestión {{ item.fiscalYear }}
                    </span>
                    <div class="text-lg font-medium mt-1">
                      {{ item.originalName }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-6">
                  <span class="text-lg font-semibold">
                    {{ item.createdAt | date : 'short' }}
                  </span>
                  <button pButton icon="pi pi-download" outlined></button>
                </div>
              </div>
            </div>
          </div>

          }
        </div>
      </ng-template>
      @if(dataSize() > 0){
      <ng-template #footer>
        <p-paginator
          [rows]="limit()"
          [first]="offset()"
          [totalRecords]="dataSize()"
          [rowsPerPageOptions]="[10, 20, 30, 50]"
          (onPageChange)="changePage($event)"
        />
      </ng-template>
      }
      <ng-template #emptymessage>
        <div class="p-4 text-lg">No se encontraron resultados.</div>
      </ng-template>
    </p-dataview>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  dataSource = input.required<DocumentFile[]>();

  dataSize = input.required<number>();
  limit = input<number>();
  offset = input<number>(0);

  onPageChange = output<{ index: number; limit: number }>();

  layout: 'list' | 'grid' = 'list';

  options = ['list', 'grid'];

  changePage(event: PaginatorState) {
    this.onPageChange.emit({
      index: event.page ?? 0,
      limit: event.rows ?? 10,
    });
  }
}
