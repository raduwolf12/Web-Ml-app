import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent implements OnInit {
  title = 'imgpreview';
  fileToUpload: File|any = null;
  url = "";
  constructor(private fileUpload: FileUploadService){
    
  }
  onSelectFile(event:any) {
    this.fileToUpload = event.target.files.item(0) as File;
      console.log(this.fileToUpload)

      this.fileUpload.postFile(this.fileToUpload).subscribe(data => {
          console.log('Success');
        }, error => {
          console.log(error);
        });
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); 

      reader.onload = (event: any) => { 
        console.log(event);
        this.url = event.target.result;
        
      }
    }
  }
  

  ngOnInit(): void {
    
  }

}
