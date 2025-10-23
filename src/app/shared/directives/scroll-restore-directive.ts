import {
  AfterViewInit,
  HostListener,
  ElementRef,
  Directive,
  OnDestroy,
  input,
} from '@angular/core';
import { ScrollStateService } from '../services/scroll-state.service';

@Directive({
  selector: '[scrollRestore]',
})
export class ScrollRestoreDirective implements AfterViewInit, OnDestroy {
  scrollKey = input.required<string>();
  private scrollTop = 0;

  constructor(
    private el: ElementRef,
    private scrollState: ScrollStateService
  ) {}

  ngAfterViewInit(): void {
    const saved = this.scrollState.get(this.scrollKey());
    if (saved) this.el.nativeElement.scrollTop = saved;
  }

  ngOnDestroy(): void {
    this.scrollState.set(this.scrollKey(), this.scrollTop);
  }

  @HostListener('scroll')
  onScroll() {
    this.scrollTop = this.el.nativeElement.scrollTop;
  }
}
