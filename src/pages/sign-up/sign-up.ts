import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  sign_up_form: FormGroup;
  show_otp_field: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private httpServerServiceProvider: HttpServerServiceProvider) {
    this.sign_up_form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      first_name: [null],
      last_name: [null],
      email: [null, Validators.compose([Validators.email])],
      city: [null],
      mobile: [null],
      password: [null],
      otp: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  onSignup(signup_value) {
    console.log(signup_value);
    this.httpServerServiceProvider.signUp(signup_value).subscribe((data) => {
      console.log(data);
      this.show_otp_field = true;
    }, (error) => {
      console.log(error);
    });
  }

}
