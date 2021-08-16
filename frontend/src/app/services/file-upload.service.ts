
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService  {
    
  constructor(private httpClient: HttpClient) { }

  postFile(fileToUpload: File): Observable<Object> {
    const endpoint = 'http://localhost:3000/evaluate';
    const formData: FormData = new FormData();
    formData.append('img', fileToUpload, fileToUpload.name);
    return this.httpClient.post(endpoint, formData).pipe(take(1), tap((response: any) => {
        console.log(response);
    }))

      };
}
