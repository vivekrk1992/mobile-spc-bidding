import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';


@IonicPage()
@Component({
  selector: 'page-invoice-dashboard',
  templateUrl: 'invoice-dashboard.html',
})
export class InvoiceDashboardPage {
  sale_group_data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private file: File, private fileOpener: FileOpener) {
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter InvoiceDashboardPage');
    this.sale_group_data = this.navParams.data;
    console.log(this.sale_group_data);
  }

  downloadPdf(file_string, invoice_number) {
    let filename: string = 'spc_invoice_number_' + String(invoice_number) + '.pdf';

    const binary_string = window.atob(file_string);
    const binary_length = binary_string.length;
    const bytes = new Uint8Array(binary_length);
    for (let i = 0; i < binary_length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    this.platform.ready().then(() => {
      const blob: Blob = new Blob([bytes], { type: 'application/pdf' });
      console.log(blob);

      this.file.writeFile(this.file.externalApplicationStorageDirectory, filename, blob, { replace: true })
        .then(() => {
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + filename, 'application/pdf')
          alert('File Downloaded to' + this.file.externalApplicationStorageDirectory);
        })
    })
      .catch((error) => {
        alert(JSON.stringify(error))
      })
  }

  downloadDocs(mime_type, file_string, extension, property, invoice_number) {
    let data_type = mime_type.split(';base64');
    let mime = data_type[0].split('data:');
    console.log(data_type);
    console.log(mime);

    let filename: string = 'invoice_number_' + String(invoice_number) + '_' + String(property) + extension;

    const binary_string = window.atob(file_string);
    const binary_length = binary_string.length;
    const bytes = new Uint8Array(binary_length);
    for (let i = 0; i < binary_length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    this.platform.ready().then(() => {
      const blob: Blob = new Blob([bytes], { type: mime });
      console.log(blob);

      this.file.writeFile(this.file.externalApplicationStorageDirectory, filename, blob, { replace: true })
        .then(() => {
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + filename, mime)
          alert('File Downloaded to' + this.file.externalApplicationStorageDirectory);
        })
    })
      .catch((error) => {
        alert(JSON.stringify(error))
      })
  }
}
