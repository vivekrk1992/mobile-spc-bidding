import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private loadingCtrl: LoadingController) {
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
    
    this.httpServerServiceProvider.registerDomesticPayment(payment_details).subscribe((data) => {
      console.log(data);
      loading.dismiss();      
      this.utr_number = null;
      this.amount = null;
      this.mode_of_payment = null;
    }, (error) => {
      loading.dismiss();      
      console.log(error);
    });
  }

}
