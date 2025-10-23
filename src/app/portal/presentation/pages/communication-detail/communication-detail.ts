import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';

import { PortalCommunicationService } from '../../services';
import { PdfDisplayComponent } from '../../../../shared';

@Component({
  selector: 'app-communication-detail',
  imports: [
    CommonModule,
    ButtonModule,
    SkeletonModule,
    PdfDisplayComponent,
  ],
  templateUrl: './communication-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunicationDetail {
  private portalService = inject(PortalCommunicationService);
  id = input.required<string>();

  communication = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.portalService.getOne(params.id),
  });


  ngOnInit() {}

  goBack() {
    // this.router.navigate(['/']); // o '/comunicados'
  }

  downloadFile() {
    // const com = this.communication();
    // if (!com?.fileUrl) return;
    // const link = document.createElement('a');
    // link.href = com.fileUrl;
    // link.download = com.reference || 'comunicado.pdf';
    // link.click();
  }
}
