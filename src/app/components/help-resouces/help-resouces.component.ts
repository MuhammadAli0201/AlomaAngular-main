import { Component, OnInit } from '@angular/core';
import { HelpResource } from '../../models/help-resource';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { ResourceService } from '../../services/resource.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-help-resouces',
  standalone: false,
  templateUrl: './help-resouces.component.html',
  styleUrl: './help-resouces.component.scss'
})
export class HelpResoucesComponent implements OnInit{
  loading = false;

  currentType = 'image';
  accept = 'image/*';
  helpResources: HelpResource[] = []
  fileTypes = [
    { label: 'Image', value: 'image', accept: 'image/*' },
    { label: 'PDF', value: 'pdf', accept: '.pdf' },
    // { label: 'Video', value: 'video', accept: 'video/*' }
  ];

  constructor(private helpResourceService: ResourceService){}

  ngOnInit(): void {
    this.helpResourceService.getHelpResourceByType(this.currentType).subscribe(helpResource=>{
      this.helpResources = helpResource;
    })
  }

  fetchResources(){
    this.helpResourceService.getHelpResourceByType(this.currentType).subscribe(helpResource=>{
      this.helpResources = helpResource;
    })
  }

  handleTypeChange(value: string) {
    this.currentType = value;
    this.fetchResources()
    const selected = this.fileTypes.find(type => type.value === value);
    this.accept = selected?.accept || '*/*';
  }

  handleUpload = (item: NzUploadXHRArgs) => {
      const formData = new FormData();
      
      formData.append('file', item.file as any);
      formData.append('fileName', item.file.name);
      return this.helpResourceService.uploadHelpResourceFile(formData)
      .pipe(
        concatMap((uploadResult:any) =>{
          const helpResource = {resourceName: uploadResult.fileName,
            filePath: uploadResult.filePath,
            type: this.currentType,
            size: item.file.size
          } as HelpResource
          return this.helpResourceService.createHelpResource(helpResource)
        })
      )
      .subscribe({
        next: (res) => {
          this.helpResources = [...this.helpResources, res];
          item.onSuccess!(res, item.file, event);
        },
        error: (err) => {
          item.onError!(err, item.file);
        }
      });
    };
}
