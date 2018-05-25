import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  buyer_data: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter UserProfilePage');
    this.buyer_data = this.navParams.data['user_details'];
    console.log(this.buyer_data);
  }

}
