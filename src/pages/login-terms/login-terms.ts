import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login-terms',
  templateUrl: 'login-terms.html',
})
export class LoginTermsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginTermsPage');
  }

  routeLoginPage() {
    this.navCtrl.popToRoot();
  }

}
