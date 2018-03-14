import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { OrderTabsPage } from '../order-tabs/order-tabs';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
// import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login_form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private httpServerServiceProvider: HttpServerServiceProvider, private localNotification: PhonegapLocalNotification, private platform: Platform) {
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

  openTermsAndConditions() {
    // this.document.viewDocument('assets/login_terms_sample.pdf', "application/pdf", { print: { enabled: true } });
    this.navCtrl.push('LoginTermsPage');
  }

  routeSignUp() {
    this.navCtrl.push('SignUpPage')
  }

  logIn() {
    this.httpServerServiceProvider.login(this.login_form.value).subscribe((data) => {
      console.log('login success');
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.storage.set('user_type', data.user_type);
      this.storage.set('user_properties', data.user_properties);
      this.httpServerServiceProvider.setTokenHeader(data.token);
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
          }
        })
      });
    }, () => console.log('platform not ready'));
  }

}
