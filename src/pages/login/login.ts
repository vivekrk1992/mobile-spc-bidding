import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login_form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private httpServerServiceProvider: HttpServerServiceProvider, private localNotification: PhonegapLocalNotification) {
    this.login_form = this.formBuilder.group({
      user_name: [''],
      password: [''],
    });

    storage.get('token').then((token) => {
      if (token != null) {
        this.navCtrl.setRoot(TabsPage);
      }
    });

    this.localNotification.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {

          // Create the notification
          this.localNotification.create('My Title', {
            tag: 'message1',
            body: 'My body',
            icon: 'assets/icon/favicon.ico'
          });

        }
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // openTermsAndConditions() {
  //   console.log('assets/t&c/login_terms_sample.pdf');
  //   this.fileOpener.open('assets/t&c/login_terms_sample.pdf', 'application/pdf')
  //     .then(() => console.log('File is opened'))
  //     .catch(e => console.log('Error openening file', e));
  // }

  routeSignUp() {
    this.navCtrl.push('SignUpPage')
  }

  logIn() {
    this.httpServerServiceProvider.login(this.login_form.value).subscribe((data) => {
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.storage.set('user_type', data.user_type);
      this.storage.set('user_properties', data.user_properties);
      this.httpServerServiceProvider.setTokenHeader(data.token);
      this.navCtrl.setRoot(TabsPage);
    });
  }

}
