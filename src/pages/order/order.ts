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
  domestic_buyer_credit_limit_kgs: number = 500;
  domestic_quote_of_the_day: any;
  domestic_quote_id: number = 0;
  copra_brands: any;
  today = new Date().toISOString().split('T')[0];
  payment_details: any;
  pending_amount: number = 0;
  amount_balance: number = 0;
  buyer_limit: {} = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private toastCtrl: ToastController, private app: App, private storage: Storage) {
  }

  doRefresh(event = null) {
    this.httpServerServiceProvider.getTodayDomesticQuote().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      if (data.hasOwnProperty('rate')) {
        this.domestic_quote_of_the_day = data.rate;
        this.domestic_quote_id = data['id'];

        // actual balance for the buyer
        this.httpServerServiceProvider.getUserAmountBalance().subscribe((data) => {
          console.log(data);
          this.amount_balance = data.amount_balance;
          this.maxOrderLimit();
        }, (error) => {
          this.maxOrderLimit();
          console.log(error);
        });
      }
      if (event != null) { event.complete() }
    }, (error) => {
      console.log(error);
      if (event != null) { event.complete() }
    });
  }

  routePaymentDetails() {
    this.navCtrl.push('PaymentDetailsPage');
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
    let total_limit = this.maxOrderLimit()
    if (selected_bag == 1) {
      if (Number.isInteger(count_50kg)) {
        if (count_50kg <= total_limit['50kg']) {
          place_order['copra_brand_id'] = brand;
          place_order['buyer_id'] = this.user['id'];
          place_order['quote_id'] = quote_id;
          place_order['bag_type'] = selected_bag;
          place_order['bag_count'] = count_50kg;
          place_order['date'] = this.today;
        } else {
          this.displayToast('Not more than ' + total_limit['50kg'] +' Bags!');
          console.log('error');
        }
      } else {
        this.displayToast('Bag count must be a round number, not a fraction.');
      }
    } else {
      if (Number.isInteger(count_25kg)) {
        if (count_25kg <= total_limit['25kg']) {
          place_order['copra_brand_id'] = brand;
          place_order['buyer_id'] = this.user['id'];
          place_order['quote_id'] = quote_id;
          place_order['bag_type'] = selected_bag;
          place_order['bag_count'] = count_25kg;
          place_order['date'] = this.today;
        } else {
          this.displayToast('Not more than '+ total_limit['25kg'] +' Bags!');
          console.log('error');
        }
      } else {
        this.displayToast('Bag count must be a round number, not a fraction.');
      }
    }

    console.log(place_order);
    if (Object.getOwnPropertyNames(place_order).length != 0) {
      console.log('Not empty');
      this.httpServerServiceProvider.registerDirectOrderToSale(place_order).subscribe(data => {
        console.log(data);
        this.displayToast('Order is placed for ₹' + this.domestic_quote_of_the_day)
        this.maxOrderLimit();
      }, (error) => {
        console.log(error);
        // console.log(error.statusText);
        // if (error.statusText == 'Bad Request') {
        // this.displayToast('Maximum per day order quantity 10 bags is reached!');
        // }
        // this.displayToast('Bag count must be a round number, not a fraction.')
        this.displayToast('Error while placing an Order!')
      });
    }
  }

  totalCost(quote_rate, quantity, quantity_in_kgs) {
    return (quote_rate * quantity * quantity_in_kgs);
  }

  onInputChecked() {
    this.bag_count_25kg = null; 
    this.bag_count_50kg = null; 
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

  maxOrderLimit() {
    let balance: any;
    let total_limit: number;
    let kg50: any;
    let kg25: any;
    balance = (this.amount_balance / this.domestic_quote_of_the_day);
    total_limit = (this.domestic_buyer_credit_limit_kgs + parseInt(balance)) - this.domestic_quotes.quantity_in_kg; 
    kg50 = (total_limit / 50);
    kg25 = (total_limit / 25);
    this.buyer_limit['50kg'] = parseInt(kg50)
    this.buyer_limit['25kg'] = parseInt(kg25)
    
    // if (this.amount_balance == 0) {
    //   this.buyer_limit['50kg'] = 10 - this.domestic_quotes.bag_count
    //   this.buyer_limit['25kg'] = 20 - this.domestic_quotes.bag_count
    // } else {
    // }

    if (this.buyer_limit['50kg'] <= 0 || this.buyer_limit['25kg'] <= 0) {
      this.httpServerServiceProvider.getTotalAndPendingCost().subscribe((data) => {
        console.log(data);
        this.payment_details = data;
        this.pending_amount = data['pending_amount'];
      }, (error) => {
        console.log(error);
      });
    } else {
      this.pending_amount = 0;
    }

    console.log(this.buyer_limit);
    return this.buyer_limit;
  }

}
