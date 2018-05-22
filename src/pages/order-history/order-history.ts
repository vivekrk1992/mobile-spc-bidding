import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-order-history',
  templateUrl: 'order-history.html',
})
export class OrderHistoryPage {
  ordered_history: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewCanEnter() {
    console.log('ionViewCanEnter OrderHistoryPage');
    this.ordered_history = this.navParams.data;
    console.log(this.ordered_history);
  }

}
