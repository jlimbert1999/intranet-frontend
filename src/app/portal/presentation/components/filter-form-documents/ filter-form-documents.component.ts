import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'filter-form-documents',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    DatePicker,
    PanelModule,
    ToggleButtonModule,
  ],
  template: `
    <p-panel [toggleable]="true" style="border: none;">
      <ng-template #header>
        <div class="flex items-center gap-2">
         <p-togglebutton [(ngModel)]="isAdvancedMode" onLabel="Filtro: Avanzado" offLabel="Filtro: Simple" class="w-40" />
        </div>
      </ng-template>
      <ng-template #footer>
        <div class="flex justify-end gap-x-2">
          <button
            pButton
            type="button"
            icon="pi pi-times"
            label="Limpiar"
            class="p-button-outlined p-button-secondary"
            (click)="reset()"
          ></button>
          <button
            pButton
            icon="pi pi-search"
            label="Buscar"
            class="p-button-primary"
            type="submit"
          ></button>
        </div>
      </ng-template>
      <ng-template #icons>
        <!-- <p-togglebutton onLabel="Avanzado" offLabel="Simple" class="w-24" size="small" [(ngModel)]="isAdvancedMode" /> -->
      </ng-template>
      <div>
        <form [formGroup]="filterForm" (ngSubmit)="applyFilter()">
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div class="md:col-span-2">
              <p-iconfield>
                <p-inputicon class="pi pi-search" />
                <input
                  pInputText
                  id="term"
                  class="w-full"
                  autocomplete="off"
                  placeholder="Nombre del documento"
                  formControlName="term"
                />
              </p-iconfield>
            </div>

            <div class="md:col-span-2">
              <p-select
                [filter]="true"
                [options]="categories()"
                (onChange)="selectCategory($event.value)"
                optionValue="id"
                optionLabel="name"
                placeholder="Categoria documento"
                [showClear]="true"
                class="w-full"
                formControlName="categoryId"
              ></p-select>
            </div>

            <div class="md:col-span-2">
              <p-select
                [filter]="true"
                [options]="sections()"
                placeholder="Sección documento"
                optionValue="id"
                optionLabel="name"
                [showClear]="true"
                class="w-full"
                formControlName="sectionId"
              ></p-select>
            </div>
          </div>

          <div class="pt-2">
            <button
              class="mb-2"
              pButton
              [text]="true"
              (click)="toggle()"
              size="small"
            >
              <i
                class="pi"
                [ngClass]="showAdvanced() ? 'pi-chevron-up' : 'pi-chevron-down'"
                pButtonIcon
              ></i>
              <span pButtonLabel>
                {{ showAdvanced() ? 'Menos' : 'Mas' }} filtros</span
              >
            </button>
            <div
              [class.max-h-0]="!showAdvanced()"
              [class.max-h-[1000px]]="showAdvanced()"
              class="transition-all duration-300 overflow-hidden"
            >
              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p-datepicker
                    formControlName="fiscalYear"
                    view="year"
                    dateFormat="yy"
                    appendTo="body"
                    class="w-full"
                    placeholder="Gestión"
                  />
                </div>

                <div>
                  <p-select
                    [options]="ORDER_BY_OPTIONS"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Campo"
                    class="w-full"
                    appendTo="body"
                    formControlName="orderBy"
                  ></p-select>
                </div>

                <div>
                  <p-select
                    [options]="ORDER_DIRECTION_OPTIONS"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Tipo orden"
                    appendTo="body"
                    [showClear]="true"
                    class="w-full"
                    formControlName="orderDirection"
                  ></p-select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </p-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFormDocumentsComponent {
  private portalService = inject(PortalService);

  private formBuilder = inject(FormBuilder);

  private readonly CURRENT_DATE = new Date();

  onFilter = output<object>();

  categories = this.portalService.categoriesWithSections;
  sections = this.portalService.sections;

  filterForm = this.formBuilder.group({
    term: [],
    categoryId: [],
    sectionId: [],
    orderDirection: [],
    orderBy: [],
    fiscalYear: [this.CURRENT_DATE],
  });

  showAdvanced = signal(false);

  isAdvancedMode = signal(false);

  filterMode = signal<'simple'>;

  readonly ORDER_BY_OPTIONS = [
    { label: 'Gestión', value: 'fiscalYear' },
    { label: 'Nombre', value: 'name' },
  ];

  readonly ORDER_DIRECTION_OPTIONS = [
    { label: 'Ascendente', value: 'ASC' },
    { label: 'Descendente', value: 'DESC' },
  ];

  toggle() {
    this.showAdvanced.update((value) => !value);
  }

  selectCategory(value: number) {
    this.filterForm.get('sectionId')?.setValue(null);
    this.portalService.selectedCategoryId.set(value);
  }

  reset() {
    this.filterForm.reset();
  }

  applyFilter() {
    this.onFilter.emit(this.filterForm.value);
  }
}
