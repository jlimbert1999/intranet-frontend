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
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'search-input',
  imports: [
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  template: `
    <p-floatlabel iconPosition="left" class="ml-auto" variant="on">
      <p-iconfield>
        <p-inputicon class="pi pi-search" />
        <input
          pInputText
          type="text"
          [formControl]="searchControl"
          class="w-full"
        />
      </p-iconfield>
      <label>{{label()}}</label>
    </p-floatlabel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  placeholder = input<string>('');
  label = input<string>('Buscar');
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
