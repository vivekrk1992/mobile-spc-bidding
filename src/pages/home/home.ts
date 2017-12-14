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
  quantity: number[] = [];
  myDate = new Date();
  today_date = this.myDate.toISOString().split('T')[0];
  delivery_date: any;
  rate: any;
  stock_details: any[] = [];
  is_stock_available: boolean = false;
  expense = {};
  message: string = '';

  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private toastCtrl: ToastController) {
    try {
      this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
        this.domestic_quotes = data;
        // work on dates
        this.myDate.setDate(this.myDate.getDate() + 1);
        console.log(this.myDate);
        this.delivery_date = this.myDate.toISOString().split('T')[0];
      });
    }
    catch(e) {
      console.log('ther is an error to assing a latest values');
      console.log(e);
    }
    httpServerServiceProvider.getStockDetails().subscribe((data) => {
      console.log(data);
      this.stock_details = data;
    });

    // get expense for delivery point
    this.httpServerServiceProvider.getDomesticDeliveryExpense().subscribe((data) => {
      console.log(data);
      this.expense = data;
    });
  }

// pull down the page get quote list from serve
  doRefresh(event) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      event.complete();
    }, (error) => {
      event.complete();
    });

  // get expense for delivery point
    this.httpServerServiceProvider.getDomesticDeliveryExpense().subscribe((data) => {
      console.log(data);
      this.expense = data;
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


// when click bid button; show bidding char card
  toggleLevel1(idx, quote_id, index) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
      this.httpServerServiceProvider.getDomesticBiddingHistoryByQuote(quote_id).subscribe((data) => {
        this.bidding_history = data;
        console.log(data);
        if (data.length > 0) {
          let higher_index = data.length - 1;
          this.domestic_quotes[index]['latest_bid_info'] = {};
          this.domestic_quotes[index]['latest_bid_info']['spc_rate'] = data[higher_index].spc_rate;
          this.domestic_quotes[index]['latest_bid_info']['buyer_rate'] = data[higher_index].buyer_rate;
          this.domestic_quotes[index]['latest_bid_info']['bid_status'] = data[higher_index].bid_status;
          this.domestic_quotes[index]['latest_bid_info']['buyer_quantity'] = data[higher_index].buyer_quantity;
          this.rate = null;
          this.quantity[index] = data[higher_index].buyer_quantity;
        } else {  // Quote bid doesn't have history assign rate and quantity empty for fill input field purpose
          this.rate = null;
          this.quantity[index] = null;
        }
      });
      console.log(this.domestic_quotes[index])
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

// when click a oreder button show oreder options
  orderItem(quantity, index) {
    console.log('with in order item')
    if (this.show_delevery_option) {
      this.show_delevery_option = false;
    } else {
      this.show_delevery_option = true;
      this.quantity[index] = quantity;
    }
  }

// order copra directly click a order button and confirm that order
  confirmOrder(quantity, quote_id, latest_spc_rate, delivery_date, index, latest_buyer_rate?, status?) {
    if (quantity > this.stock_details['in_possession']) {
      alert('you will get a goods after two days');
    }

    if (latest_buyer_rate < latest_spc_rate){
      let diff = latest_spc_rate - latest_buyer_rate;
      alert("Warning: SPC price is " + diff + " Rs higher than your last bid price!. Are you sure to order the item at " + latest_spc_rate + "Rs/Kg rate?")
    }
    if (latest_buyer_rate > latest_spc_rate){
      let diff = latest_buyer_rate - latest_spc_rate;
      alert("Warning: SPC price is " + diff + " Rs lower than your last bid price!. So, order will be placed at SPC's cheaper rates. @" + latest_spc_rate + "Rs/Kg!!!")
    }
    this.httpServerServiceProvider.confirmDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': latest_spc_rate, 'delivery_date': delivery_date}).subscribe((data) => {
      console.log(data);
      this.domestic_quotes[index]['latest_bid_info'] = data;
      this.displayToast('Order placed successfully!');
    }, (error) => {
      this.displayToast('Error!');
    });
    
  }

// bid a rate; in server side if owner and buyer rate will be match accept this bid and add into sale table
  bidding(quantity, quote_id, status, rate, index) {
    this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': rate, 'date': this.todate}).subscribe((data) => {
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

// send bidding message to server; is success also push into local
  onSendMessage(message, quote_id, index){
    // find maximum length of bidding history lenght
    let max_lenght_of_bidding_history = this.bidding_history.length - 1;

    this.httpServerServiceProvider.registerDomesticBidMsg({'message': message, 'quote_id': quote_id}).subscribe((data) => {
      if(this.bidding_history[max_lenght_of_bidding_history].hasOwnProperty('bid_board_messages')) {
        this.bidding_history[max_lenght_of_bidding_history]['bid_board_messages'].push(data.message);
      } else {
        this.bidding_history.push({'bid_board_messages': [data.message], 'last_bidder':{'id': data.message[1], 'name': 'buyer'}});        
      }
      this.message = '';
      this.displayToast('Message sent!');
    }, (error) => {
      this.displayToast('Error!');
    });
  }

// display toast received message
  displayToast(display_message){
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

// show order option when click order button
  toggleOrder(idx, quantity, index) {
    if (typeof(this.domestic_quotes[index].latest_bid_info) != 'undefined') {
      if (this.domestic_quotes[index].latest_bid_info.bid_status == 3) {
        alert('bid is already accepted and closed');
        let new_order = confirm('You already order for this quote, do you want another order?');
        console.log(new_order);
      }
    }
    if (this.isOrderShown(idx)) {
      this.is_stock_available = false;
      this.show_order = null;
    } else {
      this.show_order = idx;
      if (isNaN(this.quantity[index])) {
        this.quantity[index] = null;
      }
    }
  };

  isOrderShown(idx) {
    return this.show_order === idx;
  };
  
// when click a selfpickup
  selfPickupSelected(pickup_point) {
    console.log('selfpickup selected');
    this.selected_pickup_point_option = pickup_point;
    this.door_delivery_cost = 0;
  }

// cheked door deliver option
  doorDeliveryPickupSelected(event) {
    console.log(this.expense['door_cost'])
    if (event.checked) {
      this.door_delivery_cost = this.expense['door_cost'];
    } else {
      this.door_delivery_cost = 0;
    }
    console.log(this.door_delivery_cost);
  }
  
// check quantity is possitive
  isPossitiveInterger(index) {
    if (this.quantity[index] >= 0) {
      console.log(true);
    } else {
      alert('Quantity field accept only possitive value');
      this.quantity[index] = null;
    }
  }

// check stock availability for particular date and quantity
  checkAvailability(quantity, date) {
    console.log(quantity);
    console.log(date);
    let data = {'quantity': quantity, 'date': date};
    this.httpServerServiceProvider.checkStockAvailability(data).subscribe((data) => {
      console.log(data);
      this.is_stock_available = data['status'];
    });
  }

}
