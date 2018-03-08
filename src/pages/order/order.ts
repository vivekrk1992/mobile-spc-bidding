import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';


@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  bag_count = 0;
  brands: any;
  selected_bag_type: any;
  bag_types: any;
  bag_count_25kg: number = 0;
  bag_count_50kg: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private toastCtrl: ToastController) {
    this.httpServerServiceProvider.getBagTypes().subscribe((data) => {
      console.log(data);
      this.bag_types = data;
    }, (error) => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  confirmOrder(count_25kg, count_50kg, selected_bag) {
    let place_order = {};
    if (selected_bag == 1) {
      if (count_50kg <= 5) {
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_50kg;
      } else {
        this.displayToast('Not more than 5 Bags!');
        console.log('error');
      }
    } else {
      if (count_25kg <= 5) {
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_25kg;
      } else {
        this.displayToast('Not more than 5 Bags!');
        console.log('error');
      }
    }
    
    console.log(place_order);
  }

}
