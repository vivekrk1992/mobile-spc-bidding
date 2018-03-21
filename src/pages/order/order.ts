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
  domestic_quote_id: number = 0;
  copra_brands: any;
  today = new Date().toISOString().split('T')[0];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private toastCtrl: ToastController, private app: App, private storage: Storage) {
  }

  doRefresh(event = null) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      if (data.length !== 0) {
        this.domestic_quote_of_the_day = data[0].rate;
        this.domestic_quote_id = data[0]['id'];
      }
      if (event != null) { event.complete() }
    }, (error) => {
      console.log(error);
      if (event != null) { event.complete() }
    });
  }
  
  ionViewCanEnter() {
    this.doRefresh();

    this.httpServerServiceProvider.getBagTypes().subscribe((data) => {
      console.log(data);
      this.bag_types = data;
    }, (error) => {
      console.log(error);
    });

    this.httpServerServiceProvider.getCopraBrand().subscribe(data => {
      console.log(data);
      this.copra_brands = data;
    }, (error) => {
      console.log(error);
    });

    this.storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
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
      if (count_50kg <= 10) {
        place_order['copra_brand_id'] = brand;
        place_order['buyer_id'] = this.user['id'];
        place_order['quote_id'] = quote_id;
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_50kg;
        place_order['date'] = this.today;
      } else {
        this.displayToast('Not more than 10 Bags!');
        console.log('error');
      }
    } else {
      if (count_25kg <= 10) {
        place_order['copra_brand_id'] = brand;
        place_order['buyer_id'] = this.user['id'];
        place_order['quote_id'] = quote_id;
        place_order['bag_type'] = selected_bag;
        place_order['bag_count'] = count_25kg;
        place_order['date'] = this.today;
      } else {
        this.displayToast('Not more than 10 Bags!');
        console.log('error');
      }
    }

    console.log(place_order);
    
    this.httpServerServiceProvider.registerDirectOrderToSale(place_order).subscribe(data => {
      console.log(data);
      this.displayToast('Order is placed for ₹' + this.domestic_quote_of_the_day)
    }, (error) => {
      console.log(error);
    });
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
