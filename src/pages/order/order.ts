import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';


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
  domestic_quotes: any;
  user: any;
  domestic_quote_of_the_day: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private toastCtrl: ToastController, private app: App, private storage: Storage) {
    this.httpServerServiceProvider.getBagTypes().subscribe((data) => {
      console.log(data);
      this.bag_types = data;
    }, (error) => {
      console.log(error);
    });

    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    });

  }
  
  ionViewCanEnter() {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      this.domestic_quote_of_the_day = data[0].rate;
      console.log(this.domestic_quote_of_the_day);
    }, (error) => {
      console.log(error);
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

  confirmOrder(brand, quote_id, count_25kg, count_50kg, selected_bag) {
    let place_order = {};
    if (selected_bag == 1) {
      if (count_50kg <= 5) {
        place_order['brand_id'] = brand;
        place_order['buyer_id'] = this.user['id'];
        place_order['quote_id'] = quote_id;
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_50kg;
      } else {
        this.displayToast('Not more than 5 Bags!');
        console.log('error');
      }
    } else {
      if (count_25kg <= 5) {
        place_order['brand_id'] = brand;
        place_order['buyer_id'] = this.user['id'];
        place_order['quote_id'] = quote_id;
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_25kg;
      } else {
        this.displayToast('Not more than 5 Bags!');
        console.log('error');
      }
    }

    console.log(place_order);
  }

  totalCost(quote_rate, quantity, quantity_in_kgs) {
    return (quote_rate * quantity * quantity_in_kgs);
  }

  logout() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    }, () => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    });
  }

}
