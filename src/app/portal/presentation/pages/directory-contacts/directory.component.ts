import {
 ChangeDetectionStrategy,
 Component,
 computed,
 inject,
 signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SearchInputComponent } from '../../../../shared';
import { PortalContactService } from '../../../presentation/services/portal.contact.service';
import { UppercaseOrDashPipe } from '../../../../shared/pipes/uppercase-or-dash.pipe';
import { SelectModule } from 'primeng/select';

@Component({
 selector: 'app-directory',
 standalone: true,
 imports: [
  CommonModule,
  FormsModule,
  TableModule,
  InputTextModule,
  SearchInputComponent,
  UppercaseOrDashPipe,
  SelectModule,
 ],
 templateUrl: './directory.component.html',
 changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DirectoryComponent {
 private contactService = inject(PortalContactService);

 limit = signal(10);
 index = signal(0);
 termInstancia = signal('');
 selectedInstitucion = signal<string>(''); 

 instituciones = signal<{ id: string; name: string }[]>([]);

 constructor() {
  this.loadInstituciones();
 }

 private loadInstituciones() {
  this.contactService
   .findAll({ offset: 0, limit: 9999, term: '' })
   .subscribe({
    next: (res) => {
     const unique = new Map<string, string>();
     res.data.forEach((c) => {
      if (c.instanceType?.id && c.instanceType.name) {
       unique.set(c.instanceType.id, c.instanceType.name);
      }
     });
     this.instituciones.set(
      Array.from(unique, ([id, name]) => ({ id, name }))
     );
    },
    error: (err) => console.error('Error cargando instituciones', err),
   });
 }

 offset = computed(() => this.index() * this.limit());
 callParams = computed(() => ({
  offset: this.offset(),
  limit: this.limit(),
  term: this.termInstancia(),
  institucionId: this.selectedInstitucion(),
 }));

 contactResource = rxResource({
  params: () => this.callParams(),
  stream: ({ params }) =>
   this.contactService.findAll({
    offset: params.offset,
    limit: params.limit,
    term: params.term,
    institucionId: params.institucionId,
   }),
 });

 dataSource = computed(() => {
  const list = this.contactResource.value()?.data ?? [];
  return list;
 });

 dataSize = computed(() => this.contactResource.value()?.total ?? 0);
 isLoading = computed(() => this.contactResource.isLoading());
 error = computed(() => this.contactResource.error());

 onSearchInstancia(term: string) {
  this.termInstancia.set(term);
  this.index.set(0);
 }

 onFilterInstitucion(id: string) {
  this.selectedInstitucion.set(id);
  this.index.set(0);
 }

 onPageChange(event: any) {
  const newIndex = Math.floor(event.first / event.rows);
  if (!isNaN(newIndex) && newIndex >= 0) this.index.set(newIndex);
  if (!isNaN(event.rows) && event.rows > 0) this.limit.set(event.rows);
 }
}