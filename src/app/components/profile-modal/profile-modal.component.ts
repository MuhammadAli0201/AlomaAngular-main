
import { Component, OnInit, Input, inject, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { BACKEND_URL } from '../../constants/constants';

@Component({
  selector: 'app-profile-modal',
  standalone: false,
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss'
})
export class ProfileModalComponent implements OnInit{
  @Input() user: any;
  fileList: NzUploadFile[] = []
  backendUrl = BACKEND_URL
  private authService: AuthService
  editMode = false;

  constructor(private modalRef: NzModalRef) { 
    this.authService = inject(AuthService)
  }

  ngOnInit(): void {
    if (this.user?.profileImagePath) {
      this.fileList = [
        this.createNzUploadFile(this.user?.profileImagePath)
      ];
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  async saveUser(){
    console.log('Saving user', this.user);
    await this.authService.updateUserProfile(this.user)
    this.toggleEdit()
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
  };

  handleUpload = (item: NzUploadXHRArgs) => {
    const formData = new FormData();
    formData.append('file', item.file as any);
    formData.append('fileName', item.file.name);
    return this.authService.UploadProfilePic(formData).subscribe({
      next: (res) => {
        const bustCacheUrl = `${(res as any).imagePath}?t=${Date.now()}`;
        this.user.profileImagePath = bustCacheUrl;
        item.onSuccess!(res, item.file, event);
      },
      error: (err) => {
        item.onError!(err, item.file);
      }
    });
  };

  private createNzUploadFile(imagePath: string){
    return {
          uid: '-1',
          name: this.user.profileImagePath,
          status: 'done',
          url: this.backendUrl + imagePath
        } as NzUploadFile
  }

  close(): void {
    this.modalRef.close();
  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
