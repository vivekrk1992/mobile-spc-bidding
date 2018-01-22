import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {

  account_form:FormGroup;
  payment:any;
  date: any;
  format_date:any;
  buyer_payments: any[] = [];
  payment_per_items:any[]=[];

  constructor(private httpServerServiceProvider: HttpServerServiceProvider, public formBuilder: FormBuilder, private toastCtrl: ToastController) {

    this.date = new Date().toISOString().split('T')[0];
    this.account_form = formBuilder.group({
      amount: [null,Validators.required],
      date_sent:[null,Validators.required],
      mode_of_transaction_id:[null,Validators.required],
      transaction_id:[null,Validators.required],
    });


    this.httpServerServiceProvider.getmodesofpayment().subscribe((data) => {
      this.payment = data;
      console.log(this.payment);
    });

    this.httpServerServiceProvider.getPaymentDetailsForBuyer().subscribe((data) => {
      console.log(data);
      this.buyer_payments = data;
    });

    this.httpServerServiceProvider.getPaymentDetailsForPerItems().subscribe((data) => {
      this.payment_per_items = data;

      console.log(this.payment_per_items);
      for (var i in this.payment_per_items) {
        this.format_date=this.payment_per_items[i].sale_date.split('T')[0];
            }
    });

  }

  doRefresh(event) {
    this.httpServerServiceProvider.getPaymentDetailsForBuyer().subscribe((data) => {
      console.log(data);
      this.buyer_payments = data;
      event.complete();
    }, (error) => {
      event.complete();
    });
  }

  ngOnInit() {
  }

  submitAccountForm(account_form_value): void{
    account_form_value.date_sent = new Date(account_form_value.date_sent).toISOString().split('T')[0];

    // check accout form is valid
    if (!account_form_value.invalid) {
      this.httpServerServiceProvider.registerPayment(account_form_value).subscribe((data) => {
        console.log(data);
        this.buyer_payments.push(data);
        this.displayToastMessage('top', 'Payment uploaded successfully!');
       }, (error) => {
         this.displayToastMessage('top', 'Error!');
       });
    } else {
      console.log('not valid form')        
    }
  } 

  displayToastMessage(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      duration: 3000
    });
    toast.present();

  }

}


