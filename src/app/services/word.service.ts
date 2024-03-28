import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private documentBlobSubject = new BehaviorSubject<Blob | null>(null);

  constructor() { }
  
  generateWord(doc: Document): void {
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-document.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  lookWord(doc: Document): BehaviorSubject<Blob | null>  {
    Packer.toBlob(doc).then(blob => {
      this.documentBlobSubject.next(blob);
    });
    return this.documentBlobSubject;
  }


  getDocumentBlob(doc: Document): Promise<string> {
    return new Promise((resolve, reject) => {
      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
