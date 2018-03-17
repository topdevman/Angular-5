import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CropperSettings} from 'ng2-img-cropper';
import {UploadService} from '../../../services/upload.service';

@Component({
  selector: 'app-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  styleUrls: ['./avatar-editor.component.css']
})
export class AvatarEditorComponent implements OnInit {
  cropperSettings = new CropperSettings();
  dataImage: any;
  
  constructor(
    public dialogRef: MatDialogRef<AvatarEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('API_ENDPOINT') private apiEndpoint: string,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 150;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.dataImage = {};
  }

  cancelDialog(): void {
    console.log(this.dataImage);
    this.dialogRef.close();
  }
  saveImage(): void {
    if (this.dataImage.image) {
      const imageBlob = this.uploadService.dataURItoBlob(this.dataImage.image);
      this.uploadService.uploadBlobImage(imageBlob).subscribe(result => {
        this.dialogRef.close(result || result.url);
      });
    }
  }

}
