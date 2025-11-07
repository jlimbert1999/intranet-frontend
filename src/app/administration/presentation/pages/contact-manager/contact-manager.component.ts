import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ContactService } from '../../../infrastructure/services/contact.service';
import { ContactDialogComponent } from '../../dialogs/contact-dialog/contact-dialog.component';
import { Contacto } from '../../../domain/models/contact.model';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    HttpClientModule,
    DynamicDialogModule,
  ],
  providers: [ContactService, DialogService],
  templateUrl: './contact-manager.component.html',
})
export class ContactManagerComponent implements OnInit {
  private contactService = inject(ContactService);
  private dialogService = inject(DialogService);

  dataSource = signal<Contacto[]>([]);
  isLoading = signal(true);

  first = 0;
  rows = 10;

  ngOnInit(): void {
    this.loadContacts();
  }

  get contacts(): Contacto[] {
    return this.dataSource() ?? [];
  }

  loadContacts(): void {
    this.isLoading.set(true);
    this.contactService.getContacts().subscribe({
      next: (response: any) => {
        let contactsArray: Contacto[] = [];
        if (response && response.data && Array.isArray(response.data)) {
          contactsArray = response.data;
        } else if (Array.isArray(response)) {
          contactsArray = response;
        }
        this.dataSource.set(contactsArray);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los contactos:', err);
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  openCreateContactDialog(): void {
    const ref = this.dialogService.open(ContactDialogComponent, {
      header: 'Crear Nuevo Contacto',
      width: '50%',
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.loadContacts();
    });
  }

  openEditContactDialog(item: Contacto): void {
    const ref = this.dialogService.open(ContactDialogComponent, {
      header: 'Editar Contacto',
      width: '50%',
      data: item,
    });

    ref?.onClose.subscribe((result) => {
      if (result) this.loadContacts();
    });
  }

  deleteContact(contact: Contacto): void {
    if (confirm(`¿Seguro que quieres eliminar la instancia ${contact.instancia}?`)) {
      this.contactService.remove(contact.id).subscribe({
        next: () => {
          console.log(`Contacto ${contact.instancia} eliminado`);
          this.loadContacts();
        },
        error: (err) => console.error('Error al eliminar contacto:', err),
      });
    }
  }
}
