import { StatusBar } from '@ionic-native/status-bar';
import { Component } from '@angular/core';
import {NavController, Toast, ToastController} from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { stagger } from '@angular/core/src/animation/dsl';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  selected_pickup_point_option: string;
  door_delivery_cost: number = 0;
  show_delevery_option: boolean = false;
  total_delivery_amount: number;
  domestic_quotes: any[];
  showLevel1 = null;
  show_order = null;
  todate: any = new Date().toISOString().split('T')[0];
  bidding_history: any[];
  latest_bid_info = {};
  quantity: number = null;
  order_quantity: any;
  myDate = new Date();
  today_date = this.myDate.toISOString().split('T')[0];
  delivery_date: any;
  rate: any;

  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private toastCtrl: ToastController) {
    try {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;

      // work on dates
      this.myDate.setDate(this.myDate.getDate() + 1);
      console.log(this.myDate);
      this.delivery_date = this.myDate.toISOString().split('T')[0];
      console.log(this.delivery_date)
      console.log(this.today_date);
      console.log(typeof(this.today_date));


    });

  }
  catch(e) {
    console.log('ther is an error to assing a latest values');
    console.log(e);
  }
  }

  doRefresh(event) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      event.complete();
    }, (error) => {
      event.complete();
    });
  }

  logout() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
    }, (error) => {
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
    });
  }


  // accordian card
  toggleLevel1(idx, quote_id, index) {
    console.log(idx);
    console.log(quote_id);
    console.log(index);
    console.log('toggle');
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
      console.log(quote_id);
      this.httpServerServiceProvider.getDomesticBiddingHistoryByQuote(quote_id).subscribe((data) => {
        this.bidding_history = data;
        console.log(this.bidding_history)
        if (data.length > 0) {
          let higher_index = data.length - 1;
          this.domestic_quotes[index]['latest_bid_info'] = {};
          this.domestic_quotes[index]['latest_bid_info']['spc_rate'] = data[higher_index].spc_rate;
          this.domestic_quotes[index]['latest_bid_info']['buyer_rate'] = data[higher_index].buyer_rate;
          this.domestic_quotes[index]['latest_bid_info']['status'] = data[higher_index].bid_status;
          this.domestic_quotes[index]['latest_bid_info']['buyer_quantity'] = data[higher_index].buyer_quantity;
          this.rate = null;
          this.quantity = data[higher_index].buyer_quantity;
        } else {  // Quote bid doesn't have history assign rate and quantity empty for fill input field purpose
          this.rate = null;
          this.quantity = null;
        }
      });
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  orderItem(quantity, quote_id, latest_spc_rate, latest_buyer_rate, status) {
    console.log('within order');
    if (this.show_delevery_option) {
      this.show_delevery_option = false;
      console.log('with in if');
    } else {
      this.show_delevery_option = true;
      console.log('with in else');
    }

    // console.log(quantity);
    // console.log(quote_id);
    // if (latest_buyer_rate < latest_spc_rate){
    //   let diff = latest_spc_rate - latest_buyer_rate;
    //   alert("Warning: SPC price is " + diff + " Rs higher than your last bid price!. Are you sure to order the item at " + latest_spc_rate + "Rs/Kg rate?")
    // }
    // if (latest_buyer_rate > latest_spc_rate){
    //   let diff = latest_buyer_rate - latest_spc_rate;
    //   alert("Warning: SPC price is " + diff + " Rs lower than your last bid price!. So, order will be placed at SPC's cheaper rates. @" + latest_spc_rate + "Rs/Kg!!!")
    // }
    // this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': latest_spc_rate}).subscribe((data) => {
    //   console.log(data);
    // });
  }


  bidding(quantity, quote_id, status, rate, index) {
    this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': rate, 'date': this.todate}).subscribe((data) => {
      console.log(this.domestic_quotes);
      console.log(index);
      console.log(this.domestic_quotes[index]);
      if (!this.domestic_quotes[index].hasOwnProperty('latest_bid_info')) {
        this.domestic_quotes[index]['latest_bid_info'] = {};
      }
      this.domestic_quotes[index]['latest_bid_info']['spc_rate'] = data.spc_rate;
      this.domestic_quotes[index]['latest_bid_info']['buyer_rate'] = data.buyer_rate;
      this.domestic_quotes[index]['latest_bid_info']['bid_status'] = data.bid_status;
      this.domestic_quotes[index]['latest_bid_info']['buyer_quantity'] = data.buyer_quantity;
      this.bidding_history.push(data);
    }, (error) => {
      this.displayToast('Error!');
      });
    }

  onSendMessage(message, quote_id){
    console.log(quote_id);
    console.log(message);
    this.httpServerServiceProvider.registerDomesticBidMsg({'message': message, 'quote_id': quote_id}).subscribe((data) => {
      console.log(data);
      // this.bidding_history.push(data);
      this.displayToast('Message sent!');
    }, (error) => {
      this.displayToast('Error!');
    });
  }


  displayToast(display_message){
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // door delivery
  doorDelivery(event, spc_rate) {
    console.log(spc_rate);
    let door_delivery_rate: number = 300;
    if (event.value) {
      this.total_delivery_amount = spc_rate * this.order_quantity + door_delivery_rate;
      console.log(this.total_delivery_amount);
    } else {
      this.total_delivery_amount = spc_rate * this.order_quantity;
      console.log(this.total_delivery_amount);
    }
  }

  toggleOrder(idx) {
    if (this.isOrderShown(idx)) {
      this.show_order = null;
      this.door_delivery_cost = 0;
    } else {
      this.show_order = idx;
    }
  };
  isOrderShown(idx) {
    return this.show_order === idx;
  };

  selfPickupSelected(pickup_point) {
    console.log('selfpickup selected');
    this.selected_pickup_point_option = pickup_point;
    this.door_delivery_cost = 0;
  }
  doorDeliveryPickupSelected(pickup_point) {
    console.log('door delivery selected');
    this.selected_pickup_point_option = pickup_point;
    this.door_delivery_cost = 300;
  }
  
  isPossitiveInterger() {
    if (this.quantity >= 0) {
      console.log(true);
    } else {
      alert('Quantity field accept only possitive value');
      this.quantity = null;
    }
  }
}


