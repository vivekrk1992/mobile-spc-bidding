import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {

  amount: number = null;
  utr_number: any = null;
  payment_date: any = new Date().toISOString().split('T')[0];
  payment_modes: any;
  mode_of_payment: any;
  transacion_details: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.doRefresh();
  }
  
  doRefresh(event = null) {
    this.httpServerServiceProvider.getModesOfPayment().subscribe((data) => {
      this.payment_modes = data;
      console.log(this.payment_modes);
      if (event != null) { event.complete() }
    }, () => {
      if (event != null) { event.complete() }
    });

    this.httpServerServiceProvider.getPaymentTransactionByBuyer(this.navParams.data).subscribe((data) => {
      console.log(data);
      this.transacion_details = data;
    }, (error) => {
      console.log(error);
    });
  }

  submitPaymentDetails(date, payment_amount, utr_number, mode_of_payment) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    let payment_details = {}
    payment_details['date_sent'] = date;
    payment_details['amount'] = payment_amount;
    payment_details['transaction_id'] = utr_number;
    payment_details['mode_of_transaction_id'] = mode_of_payment;

    console.log(payment_details);

    let is_transaction_made: boolean = true;
    for (let object of this.transacion_details) {
      let previous_transaction_id = object['transaction_id'].toLowerCase();
      let input_transaction_id = utr_number.toLowerCase();
      let input_string_length = input_transaction_id.length
      let previous_transaction_string_length = previous_transaction_id.length
      if (previous_transaction_string_length > input_string_length) {
        if (previous_transaction_id.slice(0, input_string_length) == input_transaction_id || Math.round(object['amount']) == Math.round(payment_amount)) {
          is_transaction_made = confirm('Remittance is already made. Do you want to proceed!');
          break;
        }
      } 
      else {
        if (previous_transaction_id == input_transaction_id.slice(0, previous_transaction_string_length) || Math.round(object['amount']) == Math.round(payment_amount)) {
          is_transaction_made = confirm('Remittance is already made. Do you want to proceed!');
          break;
        }
      }
    };
    console.log(is_transaction_made);
    if (is_transaction_made) {
      this.httpServerServiceProvider.registerDomesticPayment(payment_details).subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.displayToast('Remittance Recorded! Please wait for Approval!');
        this.navCtrl.pop();
      }, (error) => {
        loading.dismiss();      
        console.log(error);
      });
    } else {
      console.log('Payment not made!');
      loading.dismiss();
    }
    
  }

  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
