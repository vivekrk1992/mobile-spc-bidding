import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { NavController, ToastController, Platform } from 'ionic-angular';
// import { InterfaceProvider } from './../../providers/interface/interface';
import { value, Test } from '../../providers/interface/interface'
import { FileOpener} from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  account_form:FormGroup;
  payment:any;
  date: any;
  format_date:any;
  buyer_invoice: any[] = [];
  payment_per_items:any;

  constructor(private httpServerServiceProvider: HttpServerServiceProvider, public formBuilder: FormBuilder, private toastCtrl: ToastController, private fileOpener: FileOpener, private file: File, private platform: Platform) {

    // console.log('contact');
    // console.log(value);
    // this.date = new Date().toISOString().split('T')[0];
    // this.account_form = formBuilder.group({
    //   amount: [null,Validators.required],
    //   date_sent:[null,Validators.required],
    //   mode_of_transaction_id:[null,Validators.required],
    //   transaction_id:[null,Validators.required],
    // });



    // this.httpServerServiceProvider.getModesOfPayment().subscribe((data) => {
    //   this.payment = data;
    //   console.log(this.payment);
    // });

    // this.httpServerServiceProvider.getPaymentDetailsForBuyer().subscribe((data) => {
    //   console.log(data);
    //   this.buyer_payments = data;
    // });

    // this.httpServerServiceProvider.getPaymentDetailsForPerItems().subscribe((data) => {
    //   this.payment_per_items = data;

    //   console.log(this.payment_per_items);
    //   for (var i in this.payment_per_items) {
    //     this.format_date=this.payment_per_items[i].sale_date.split('T')[0];
    //         }
    // });

    // this.interTest({'name': 'vivek', 'age': 25})

    this.doRefresh()

  }

  interTest(data: Test) {
    console.log(data);
  }

  doRefresh(event = null) {
    this.httpServerServiceProvider.getInvoiceDetails().subscribe((data) => {
      console.log(data);
      this.buyer_invoice = data;
      if (event != null) { event.complete() }
    }, () => {
      if (event != null) { event.complete() }
    });
  }

  // submitAccountForm(account_form_value): void{
  //   account_form_value.date_sent = new Date(account_form_value.date_sent).toISOString().split('T')[0];

  //   // check accout form is valid
  //   if (!account_form_value.invalid) {
  //     this.httpServerServiceProvider.registerPayment(account_form_value).subscribe((data) => {
  //       console.log(data);
  //       this.buyer_payments.push(data);
  //       this.displayToastMessage('top', 'Payment uploaded successfully!');
  //      }, (error) => {
  //        this.displayToastMessage('top', 'Error!');
  //      });
  //   } else {
  //     console.log('not valid form')
  //   }
  // }

  displayToastMessage(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();
  }

  downloadPdf(pdf_path) {
    console.log(pdf_path)
    let file_path: any;
    // let pdf = window.open();
    // pdf.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + pdf_string + "'></iframe>");

    // this.fileOpener.open(pdf_path, 'application/pdf')
    //   .then(() => console.log('File is opened'))
    //   .catch(e => console.log('Error openening file', e));
    
    // this.filePath.resolveNativePath(pdf_path)
    // .then(filePath => {
    //   this.fileOpener.open(pdf_path, 'application/pdf')
    //     .then(() => console.log('File is opened'))
    //     .catch(e => console.log('Error openening file', e));        
    //     console.log(filePath)})
    //   .catch(err => console.log(err));

  }

  saveAndOpenPdf(pdf_string: string,) {
    let filename: any;
    filename = new Date().getTime();
    const writeDirectory = this.platform ? this.file.dataDirectory : this.file.externalDataDirectory;
    // let binary_string = window.atob(pdf_string);
    // let binary_length = binary_string.length;
    // let bytes = new Uint8Array(binary_length);
    // for (let i = 0; i < binary_length; i++) {
    //   bytes[i] = binary_string.charCodeAt(i);
    // }
    // let blob = new Blob([bytes]);
    this.file.writeFile(writeDirectory, filename, this.convertBaseb64ToBlob(pdf_string, 'data:application/pdf;base64'), { replace: true })
      .then(() => {
        this.fileOpener.open(writeDirectory + filename, 'application/pdf')
      .catch(() => {
        console.log('Error opening pdf file');
      });
    })
    .catch(() => {
      console.error('Error writing pdf file');
    });
  }

  convertBaseb64ToBlob(b64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

}


