import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Nota: Generalmente aquí se importan FormsModule, ReactiveFormsModule y otros componentes UI
// Para este ejemplo, solo usamos CommonModule

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-manager.component.html',
})
export class ContactManagerComponent {
  // Aquí se inyectarían servicios y se manejaría la lógica de la página (CRUD, paginación, etc.)
  constructor() {}
}
