import {Component, Inject, OnInit} from '@angular/core';
import {AvatarEditorComponent} from '../avatar-editor/avatar-editor.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UploadService} from '../../../services/upload.service';

@Component({
  selector: 'app-new-zone',
  templateUrl: './new-zone.component.html',
  styleUrls: ['./new-zone.component.css']
})
export class NewZoneComponent implements OnInit {

  dataZone: any;
  baseUrl = 'http://217.182.89.217:8000/';

  constructor(
    public dialogRef: MatDialogRef<NewZoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.dataZone = {};
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }
  saveImage(): void {
  }
}
