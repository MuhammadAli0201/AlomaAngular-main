import { Component, OnInit, Input, inject, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
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
export class ProfileModalComponent implements OnInit {
  @Input() user: any;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  
  fileList: NzUploadFile[] = []
  backendUrl = BACKEND_URL
  private authService: AuthService
  editMode = false;
  showWebcam = false;
  webcamStream: MediaStream | null = null;
  uploadMethod: 'file' | 'webcam' = 'file';

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

  ngOnDestroy(): void {
    this.stopWebcam();
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.stopWebcam();
      this.showWebcam = false;
      this.uploadMethod = 'file';
    }
  }

  setUploadMethod(method: 'file' | 'webcam') {
    this.uploadMethod = method;
    if (method === 'webcam') {
      this.showWebcam = true;
      this.startWebcam();
    } else {
      this.showWebcam = false;
      this.stopWebcam();
    }
  }

  async startWebcam() {
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      setTimeout(() => {
        if (this.videoElement && this.webcamStream) {
          this.videoElement.nativeElement.srcObject = this.webcamStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please check permissions and try again.');
    }
  }

  stopWebcam() {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach(track => track.stop());
      this.webcamStream = null;
    }
  }

  capturePhoto() {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        await this.uploadWebcamPhoto(blob);
        this.stopWebcam();
        this.showWebcam = false;
        this.uploadMethod = 'file';
      }
    }, 'image/jpeg', 0.8);
  }

  private async uploadWebcamPhoto(blob: Blob) {
    const formData = new FormData();
    const fileName = `webcam-photo-${Date.now()}.jpg`;
    formData.append('file', blob, fileName);
    formData.append('fileName', fileName);

    try {
      const res = await this.authService.UploadProfilePic(formData).toPromise();
      const bustCacheUrl = `${(res as any).imagePath}?t=${Date.now()}`;
      this.user.profileImagePath = bustCacheUrl;
      
      // Update file list to show the captured photo
      this.fileList = [this.createNzUploadFile(bustCacheUrl)];
    } catch (error) {
      console.error('Error uploading webcam photo:', error);
      alert('Failed to upload photo. Please try again.');
    }
  }

  retakePhoto() {
    this.startWebcam();
  }

  async saveUser() {
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

  private createNzUploadFile(imagePath: string) {
    return {
      uid: '-1',
      name: this.user.profileImagePath,
      status: 'done',
      url: this.backendUrl + imagePath
    } as NzUploadFile
  }

  close(): void {
    this.stopWebcam();
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
