import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {

  one:FormGroup;
  payment:any;
 
    constructor(private httpServerServiceProvider: HttpServerServiceProvider, public formBuilder: FormBuilder) {
 		this.one = formBuilder.group({
            amount: [null,Validators.required],
            date_sent:[null,Validators.required],
            mode_of_transaction_id:[null,Validators.required],
        });
    }
       ngOnInit() {
  	this.httpServerServiceProvider.getmodesofpayment().subscribe(data=>{
  		this.payment = data;
	    console.log(this.payment);
  	})
}
    submitForm(details):void{
    let data:any = {};
    data= details;
    console.log(data);
    details.date_sent = new Date(details.date_sent).toISOString().split('T')[0];
  	if(!data.invalid){
     // this.httpServerServiceProvider.payment(data).subscribe(data => {
     // 	console.log(data);
     //  });
    } else {
    console.log('not valid form')        
    }

  } 

    }   
  


