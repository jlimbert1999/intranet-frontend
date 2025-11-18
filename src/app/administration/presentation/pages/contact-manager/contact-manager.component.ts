import { Component, OnInit, inject, signal, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Table, TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon'; 
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog'; 
import { ToastModule } from 'primeng/toast'; 
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

import { ContactService } from '../../../infrastructure/services/contact.service';
import { ContactDialogComponent } from '../../dialogs/contact-dialog/contact-dialog.component';
import { Contacto } from '../../../domain/models/contact.model';
import { SearchInputComponent } from '../../../../shared/components/inputs/search-input/search-input.component'; 

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
    ToastModule, 
    ConfirmDialogModule, 
    SearchInputComponent 
  ],
  providers: [ContactService, DialogService, MessageService, ConfirmationService],
  templateUrl: './contact-manager.component.html',
})
export class ContactManagerComponent implements OnInit {
  private contactService = inject(ContactService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService); 
  private confirmationService = inject(ConfirmationService); 

  @ViewChild('dt') dt!: Table;

  dataSource = signal<Contacto[]>([]);
  isLoading = signal(true);

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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los contactos.' });
        this.isLoading.set(false);
      },
    });
  }

 
  onSearch(searchTerm: string): void {
    if (this.dt) {
      this.dt.filterGlobal(searchTerm, 'contains');
    }
  }

  openCreateContactDialog(): void {
    const ref = this.dialogService.open(ContactDialogComponent, {
      header: 'Crear Nuevo Contacto',
      width: '50%',
      data: { isEdit: false } 
    });

    ref?.onClose.subscribe((result: { success: boolean, instancia: string } | null) => {
      if (result && result.success) {
        this.loadContacts();
        this.messageService.add({ 
            severity: 'success', 
            summary: 'Creación Exitosa', 
            detail: `El contacto "${result.instancia}" fue creado correctamente.` 
        });
      }
    });
  }

  openEditContactDialog(item: Contacto): void {
    const ref = this.dialogService.open(ContactDialogComponent, {
      header: 'Editar Contacto',
      width: '50%',
      data: { ...item, isEdit: true }, 
    });

    ref?.onClose.subscribe((result: { success: boolean, instancia: string } | null) => {
      if (result && result.success) {
        this.loadContacts();
        this.messageService.add({ 
            severity: 'success', 
            summary: 'Edición Exitosa', 
            detail: `El contacto "${result.instancia}" fue actualizado correctamente.` 
        });
      }
    });
  }

  deleteContact(contact: Contacto): void {
    this.confirmationService.confirm({
        message: `¿Está seguro que desea eliminar la instancia "${contact.instancia}"? Esta acción no se puede deshacer.`,
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.contactService.remove(contact.id).subscribe({
                next: () => {
                    this.messageService.add({ 
                        severity: 'success', 
                        summary: 'Eliminado', 
                        detail: `Contacto "${contact.instancia}" eliminado correctamente.` 
                    });
                    this.loadContacts();
                },
                error: (err) => {
                    console.error('Error al eliminar contacto:', err);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: `Error al eliminar "${contact.instancia}".` 
                    });
                },
            });
        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'La eliminación fue cancelada.' });
        }
    });
  }
}