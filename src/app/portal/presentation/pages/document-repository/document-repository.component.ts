import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';

import { PortalService } from '../../services/portal.service';
import {
  DocumentListComponent,
  FilterFormDocumentsComponent,
} from '../../components';
import { DocumentFile } from '../../../domain';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PrimengFileIconPipe, SearchInputComponent } from '../../../../shared';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document-repository',
  imports: [
    CommonModule,
    AccordionModule,
    BadgeModule,
    DocumentListComponent,
    MenuModule,
    DrawerModule,
    IconField,
    InputIcon,
    InputTextModule,
    FormsModule,
    TableModule,
    PrimengFileIconPipe,
    ButtonModule,
    PopoverModule,
    ReactiveFormsModule,
    DocumentListComponent,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    SearchInputComponent,
    DatePicker,
    SelectModule,
    AccordionModule,
    FilterFormDocumentsComponent,
  ],
  templateUrl: './document-repository.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentRepositoryComponent {
  private router = inject(Router);
  private portalService = inject(PortalService);
  private breakpoint = inject(BreakpointObserver);
  private formBuilde = inject(FormBuilder);

  sidebarVisible = false;
  isMobile = signal(false);

  categoriesList = computed(() => {
    return this.portalService.categories();
  });

  showAdvancedFilters = signal(false);

  documents = signal<any[]>([]);

 

  filterForm: FormGroup = this.formBuilde.group({
    categoryId: [null],
  });

  constructor() {
    this.listenLayoutChanges();
  }

  ngOnInit() {
    // this.getData();
  }

  getData() {
    this.portalService
      .filterDocuments(this.filterForm.value)
      .subscribe((resp) => {
        this.documents.set(resp);
        console.log(resp);
      });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  selectCategory(value: number) {
    this.filterForm.get('categoryId')?.setValue(value);
    this.getData();
  }

  private listenLayoutChanges() {
    this.breakpoint
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  toggle() {
    this.showAdvancedFilters.update((value) => !value);
  }

  openSidebar() {
    this.sidebarVisible = true;
  }
}
