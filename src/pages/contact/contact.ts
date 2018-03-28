import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { NavController, ToastController, Platform } from 'ionic-angular';
// import { InterfaceProvider } from './../../providers/interface/interface';
import { value, Test } from '../../providers/interface/interface'
import { FileOpener } from '@ionic-native/file-opener';
import { File, FileEntry } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  account_form: FormGroup;
  payment: any;
  date: any;
  format_date: any;
  buyer_invoice: any[] = [];
  payment_per_items: any;

  constructor(private httpServerServiceProvider: HttpServerServiceProvider, public formBuilder: FormBuilder, private toastCtrl: ToastController, private fileOpener: FileOpener, private file: File, private platform: Platform, private transfer: FileTransfer) {

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

  downloadPdf(file_string) {
    let filename: string = 'spc_' + String(new Date().getTime()) + '.pdf';
    // const img: string = file_string
    // const bytes: string = atob(file_string);
    // const byteNumbers = new Array(bytes.length);
    // for (let i = 0; i < bytes.length; i++) {
    //   byteNumbers[i] = bytes.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // console.log(byteArray);

    const binary_string = window.atob(file_string);
    const binary_length = binary_string.length;
    const bytes = new Uint8Array(binary_length);
    for (let i = 0; i < binary_length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    this.platform.ready().then(() => {
      const blob: Blob = new Blob([bytes], { type: 'application/pdf' });
      console.log(blob);

      this.file.writeFile(this.file.externalApplicationStorageDirectory, filename, blob, { replace: false })
        .then(() => {
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + filename, 'application/pdf')
          alert('File Downloaded to' + this.file.externalApplicationStorageDirectory);
        })
    })
      .catch((error) => {
        alert(JSON.stringify(error))
      })
  }
}


