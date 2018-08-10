import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { OrderTabsPage } from '../order-tabs/order-tabs';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Network } from '@ionic-native/network';
// import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

declare var navigator: any;
declare var Connection: any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login_form: FormGroup;
  terms_conditions: any;
  network_offline: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private httpServerServiceProvider: HttpServerServiceProvider, private platform: Platform,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private network: Network, private ref: ChangeDetectorRef) {
    this.login_form = this.formBuilder.group({
      user_name: [''],
      password: [''],
    });

    storage.get('token').then((token) => {
      if (token != null) {
        // this.navCtrl.setRoot(TabsPage);
        this.readyPlatform()
      }
    });

    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.checkConnection();
    });


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.checkConnection();
    });

  }

  checkConnection() {
    let networkState = navigator.connection.type;

    let states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    // alert('Connection type: ' + states[networkState]);
 
    if (states[networkState] == 'No network connection') {
      this.network_offline = true;
      this.ref.detectChanges();    
    } else {
      this.network_offline = false;
      this.ref.detectChanges();    
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.checkConnection();
  }

  openTermsAndConditions() {
    // this.document.viewDocument('assets/login_terms_sample.pdf', "application/pdf", { print: { enabled: true } });
    this.navCtrl.push('LoginTermsPage');
  }

  routeSignUp() {
    this.navCtrl.push('SignUpPage')
  }

  readyPlatform() {
    this.platform.ready().then(() => {
      this.storage.get('user_properties').then((user_property) => {
        console.log('with in storage');
        console.log(user_property);
        if (user_property.hasOwnProperty('buyer_profile_complete_percentage')) {
          if (user_property['buyer_profile_complete_percentage'] == '100') {
            console.log('inside if')
            this.navCtrl.setRoot(OrderTabsPage);
          } else {
            console.log('inside else')
            this.navCtrl.setRoot(TabsPage);
          }
        } else {
          console.log('inside else')
          this.navCtrl.setRoot(TabsPage);
        }
      })
    }), () => {console.log('Platform not ready')};
  }

  logIn() {
    this.httpServerServiceProvider.login(this.login_form.value).subscribe((data) => {
      console.log('login success');
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.storage.set('user_type', data.user_type);
      this.storage.set('user_properties', data.user_properties);
      this.readyPlatform();
      this.httpServerServiceProvider.setTokenHeader(data.token);
    }, (error) => {
      console.log(error);
      let detailed_error = JSON.parse(error._body);
      console.log(detailed_error.detail);
      alert(JSON.stringify(detailed_error.detail));
    });
  }

  disableToggle() {
    this.terms_conditions = !this.terms_conditions;
  }

  forgetPassword() {
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
