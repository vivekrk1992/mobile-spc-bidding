import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {

  account_form:FormGroup;
  payment:any;
  date: any;

  constructor(private httpServerServiceProvider: HttpServerServiceProvider, public formBuilder: FormBuilder) {
    this.date = new Date().toISOString().split('T')[0];    
    this.account_form = formBuilder.group({
      amount: [null,Validators.required],
      date_sent:[null,Validators.required],
      mode_of_transaction_id:[null,Validators.required],
      transaction_id:[null,Validators.required],
    });


    this.httpServerServiceProvider.getmodesofpayment().subscribe(data=>{
      this.payment = data;
      console.log(this.payment);
    });
  }

  ngOnInit() {

  }

  submitAccountForm(account_form_value):void{
    account_form_value.date_sent = new Date(account_form_value.date_sent).toISOString().split('T')[0];

    // check accout form is valid
    if(!account_form_value.invalid){
      this.httpServerServiceProvider.registerPayment(account_form_value).subscribe(data => {
      	console.log(data);
       });
    } else {
      console.log('not valid form')        
    }
  } 

}
  


