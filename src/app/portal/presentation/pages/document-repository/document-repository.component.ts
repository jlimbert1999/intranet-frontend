import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';

import { PortalService } from '../../services/portal.service';
import { DocumentListComponent } from '../../components';
import { DocumentFile } from '../../../domain';

@Component({
  selector: 'app-document-repository',
  imports: [
    CommonModule,
    AccordionModule,
    BadgeModule,
    DocumentListComponent,
    MenuModule,
  ],
  templateUrl: './document-repository.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentRepositoryComponent {
  private router = inject(Router);
  private portalService = inject(PortalService);

  categories = this.portalService.categories;

  items = [
    { label: 'New', icon: 'pi pi-plus' },
    { label: 'Search', icon: 'pi pi-search' },
  ];

  openCategory(index: number) {
    const item = this.categories()[index - 1];
    this.router.navigate(['/portal/repository/category', item.id]);
  }
}
