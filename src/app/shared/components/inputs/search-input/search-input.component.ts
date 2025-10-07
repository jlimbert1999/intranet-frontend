import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'search-input',
  imports: [
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <p-iconfield iconPosition="left" class="ml-auto">
      <p-inputicon>
        <i class="pi pi-search"></i>
      </p-inputicon>
      <input
        pInputText
        type="text"
        [placeholder]="placeholder()"
        [formControl]="searchControl"
        class="w-full"
      />
    </p-iconfield>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  placeholder = input<string>('Buscar...');
  searchControl = new FormControl('');
  search = output<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        filter((term) => term !== null)
      )
      .subscribe((term) => {
        this.search.emit(term);
      });
  }
}
