import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  sign_up_form: FormGroup;
  show_otp_field: boolean = false;
  terms_conditions: boolean = false;
  // passwordType: string = 'password';
  // passwordIcon: string = 'eye-off';

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private httpServerServiceProvider: HttpServerServiceProvider, private alertController: AlertController, private toastCtrl: ToastController) {
    this.sign_up_form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required])],
      first_name: [null],
      last_name: [null],
      email: [null, Validators.compose([Validators.email])],
      city: [null],
      mobile: [null],
      company_name: [null],
      password: [null],
      confirm_password: [null],
      otp: [null],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  onSignup(signup_value) {
    console.log(signup_value);
    if (signup_value.password === signup_value.confirm_password) {
      this.httpServerServiceProvider.signUp(signup_value).subscribe((data) => {
        console.log(data);
        // this.show_otp_field = true;
        this.presentConfirm();
      }, (error) => {
        console.log(error);
        let detailed_error = JSON.parse(error._body);
        console.log(detailed_error.detail);
        alert(JSON.stringify(detailed_error.detail));
      });
    } else {
      this.mismatchAlert();
    }
  }


  presentConfirm() {
    let alert = this.alertController.create({
      title: 'Enter OTP',
      inputs: [
        {
          name: 'otp',
          placeholder: 'Enter OTP',
          type: 'number'
        },
        
      ],
      // message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: (data) => {
            data['mobile'] = this.sign_up_form.value['mobile'];
            this.confirmOtp(data);
          }
        }
      ]
    });
    alert.present();
  }

  mismatchAlert() {
    let alert = this.alertController.create({
      title: 'Password Mismatch',
      subTitle: 'Enter the Password Correctly!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  confirmOtp(data) {
    console.log(data);
    this.httpServerServiceProvider.confirmOtp(data).subscribe((data) => {
      console.log('otp confirmed successfully!');
      this.displayToastMessage('OTP confirmed successfully!', 'top');
      this.navCtrl.pop();
    }, (error) => {
      console.log(error);
      console.log('OTP does not match');
      this.displayToastMessage(error, 'top');
      // alert()
      let detailed_error = JSON.parse(error._body);
      console.log(detailed_error.detail);
      alert(JSON.stringify(detailed_error.detail));
    });
  }

  openSignupTermsAndConditions() {
    this.navCtrl.push('SignupTermsPage');
  }
  
  disableToggle() {
    this.terms_conditions = !this.terms_conditions;
  }

//   hideShowPassword() {
//     console.log('show pass Function');
//     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
//     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
//  }

  displayToastMessage(message, position) {
   let toast = this.toastCtrl.create({
     message: message,
     position: position,
     duration: 3000
   });
   toast.present();
  }

}
