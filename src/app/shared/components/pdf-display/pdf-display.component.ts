import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'pdf-display',
  imports: [PdfViewerModule],
  template: `
    <pdf-viewer
      [src]="src()"
      [fit-to-page]="fitToPage()"
      style="width: 100%; height: 100%;"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfDisplayComponent {
  src = input.required<string>();
  fitToPage = input<boolean>(true);
}
