import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders()
};
@Injectable()
export class UploadService {

  private uploadUrl = `${this.apiEndpoint}/upload`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  uploadBlobImage(blobImage: any): Observable<any> {
    var formData: FormData = new FormData();
    formData.append('picture', blobImage, "picture.png");

    return this.http.post(this.uploadUrl, formData, httpOptions)
        .map(response => response);
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);

    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const bb = new Blob([ab]);
    return bb;
  }

}
