import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';



@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  buyer_data: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter UserProfilePage');
    this.buyer_data = this.navParams.data['user_details'];
    console.log(this.buyer_data);
  }

  changePassword() {
    let alert = this.alertCtrl.create({
      title: 'Enter User-Name',
      subTitle: `Enter the Mobile Number at the time of registration`,
      inputs: [
        {
          name: 'username',
          placeholder: 'Enter Mobile Number',
          type: 'number'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.pop();
          }
        },
        {
          text: 'Confirm',
          handler: (data) => {
            console.log(data);
            this.getOTPForPasswordReset(data);
          }
        }
      ]
    });
    alert.present();
  }

  getOTPForPasswordReset(user_dict) {
    this.httpServerServiceProvider.getOTPForForgetPassword(user_dict).subscribe((data) => {
      console.log(data);
      console.log(data['user_id']);
      this.confirmOTPMessage(data['user_id']);
    }, (error) => {
      console.log(error);
      let detailed_error = JSON.parse(error._body);
      console.log(detailed_error.detail);
      alert(JSON.stringify(detailed_error.detail));
    });
  }

  confirmOTPMessage(user_id) {
    let alert_otp = this.alertCtrl.create({
      title: 'Enter OTP',
      inputs: [
        {
          name: 'otp',
          placeholder: 'Enter OTP',
          type: 'number'
        },

      ],
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
            console.log(data);
            data['user_id'] = user_id;
            this.confirmOtp(data);
          }
        }
      ]
    });
    alert_otp.present();
  }

  confirmOtp(otp_dict) {
    console.log(otp_dict);
    this.httpServerServiceProvider.confirmForgetPasswordOTP(otp_dict).subscribe((data) => {
      this.displayToast('OTP confirmed successfully!');
      console.log(data);
      this.createPassword(otp_dict['user_id'])
    }, (error) => {
      console.log(error);
      let detailed_error = JSON.parse(error._body);
      console.log(detailed_error.detail);
      alert(JSON.stringify(detailed_error.detail));
      if (detailed_error.detail != 'OTP Expired!') {
        this.confirmOTPMessage(otp_dict['user_id']);
      }
    });
  }

  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  createPassword(user_id) {
    let alert_password = this.alertCtrl.create({
      title: 'Create Password',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        },
        {
          name: 'password1',
          placeholder: 'Re-Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Create Password',
          handler: data => {
            if (data.password === data.password1) {
              data['user_id'] = user_id;
              this.confirmPassword(data);
            } else {
              this.mismatchAlert();
              return false;
            }
          }
        }
      ]
    });
    alert_password.present();
  }

  confirmPassword(password_dict) {
    console.log(password_dict);
    this.httpServerServiceProvider.resetPassword(password_dict).subscribe((data) => {
      console.log(data);
      alert('Password Created')
    }, (error) => {
      console.log(error);
    });
  }

  mismatchAlert() {
    let alert = this.alertCtrl.create({
      title: 'Password Mismatch',
      subTitle: 'Enter the Password Correctly!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
