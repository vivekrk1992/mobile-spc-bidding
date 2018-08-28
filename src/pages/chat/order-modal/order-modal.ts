import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-order-modal',
  templateUrl: 'order-modal.html',
})
export class OrderModalPage {
  bag_types: any[] = [];
  copra_brands: any[] = [];
  selected_brand: any = null;
  selected_question: any = null;
  selected_bag_type: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.copra_brands = [];
    this.bag_types = [];
    let temp_data = navParams.get('details');
    this.copra_brands = temp_data['copra'];
    this.bag_types = temp_data['bags'];
    console.log(this.copra_brands);
    console.log(this.bag_types);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
