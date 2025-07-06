import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BACKEND_URL } from '../../constants/constants';
import { HelpResource } from '../../models/help-resource';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-resource-view-modal',
  standalone: false,
  templateUrl: './resource-view-modal.component.html',
  styleUrl: './resource-view-modal.component.scss'
})
export class ResourceViewModalComponent {

  // @Input() resource!: HelpResource
  isImagePreviewVisible = false;
  previewImage = '';
  isVideoPreviewVisible = false;
  previewVideo = '';
  backendUrl = BACKEND_URL;
  resource!: HelpResource

  constructor(@Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef){
      if(this.data) {
        this.resource = this.data.resource
        if (this.resource.type === 'image') {
          this.previewImage = BACKEND_URL + this.resource.filePath;
          this.isImagePreviewVisible = true;
        } else if (this.resource.type === 'video') {
          this.previewVideo = BACKEND_URL + this.resource.filePath;
          this.isVideoPreviewVisible = true;
        } else if(this.resource.type === 'pdf') {
          window.open(BACKEND_URL + this.resource.filePath, '_blank');
          this.modalRef.close();
        }
      }
   }

  ngOnInit(): void {
    
  }
}
