import { GrievancePage } from './../grievance/grievance';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { Component, OnInit } from '@angular/core';
import {NavController, Toast, ToastController, Platform, AlertController, App} from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from "../../providers/global/global";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
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
  delivery_date: any = new Date().toISOString().split('T')[0];
  rate: any = null;
  stock_details: any[] = [];
  is_stock_available: boolean = false;
  expense = {};
  message: string = '';
  user_properties: Object = {};
  credit: boolean[] = [];
  door_delivery: boolean[] = [];
  user = {};

  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage,
    private toastCtrl: ToastController, private platform: Platform, private localNotification: PhonegapLocalNotification,
    private alertCtrl: AlertController, private global: GlobalProvider, private app: App) {
    console.log(this.global.bag_quantity);
    this.delivery_date = this.dateIncrement(this.delivery_date, 2);
    this.doRefresh();
    // httpServerServiceProvider.getStockDetails().subscribe((data) => {
    //   this.stock_details = data;
    // });

    this.localNotification.requestPermission().then(
      (permission) => {
        console.log(permission);
        if (permission === 'denied') {
          // Create the notification
          this.localNotification.create('My Title', {
            tag: 'home',
            body: 'My body',
            icon: 'assets/icon/favicon.ico'
          });

        }
      }
    );

    this.storage.get('user').then((user_data) => {
      this.user = user_data;
    });
  }

  ngOnInit() {
    console.log('onint');
      this.storage.get('user_properties').then((data) => {
        this.user_properties = data;
        console.log(this.user_properties);
      }, (error) => {
        console.log(error);
      });
  }

// pull down the page get quote list from serve
  doRefresh(event = null) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      if (event != null) event.complete();
    }, () => {
      if (event != null) event.complete();
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
      this.app.getRootNav().setRoot('LoginPage');
    }, () => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
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
    if (this.show_delevery_option) {
      this.show_delevery_option = false;
    } else {
      this.show_delevery_option = true;
      this.quantity[index] = quantity;
    }
  }

// order copra directly click a order button and confirm that order
//   confirmOrder(quantity, quote_id, latest_spc_rate, delivery_date, index, buyer_rate?, status?) {
  confirmOrder(quantity, quote_id, delivery_date, index, latest_spc_rate = null, latest_buyer_rate = null, status = null) {
    if (latest_spc_rate == null && latest_buyer_rate == null && status == null) {
      latest_spc_rate = this.domestic_quotes[index].rate;
    }
    let data = {'id': quote_id, 'quantity': quantity, 'rate': latest_spc_rate, 'delivery_date': delivery_date};
    this.presentConfirm(data, index)
    console.log(delivery_date);
  }

// bid a rate; in server side if owner and buyer rate will be match accept this bid and add into sale table
  bidding(quantity, quote_id, status, rate, index, credit: boolean = false, door_delivery: boolean = false) {
    if (rate === null || quantity === null) {

        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: `Rate and Quantity can't be empty!`,
          buttons: ['Ok']
        });
        alert.present();

    } else {
      this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': rate, 'date': this.delivery_date, 'is_credit': credit, 'is_door_delivery': door_delivery}).subscribe((data) => {
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

// when click a selfpickup
  selfPickupSelected(pickup_point) {
    console.log('self pickup selected');
    this.selected_pickup_point_option = pickup_point;
    this.door_delivery_cost = 0;
  }

  // check quantity is positive
  isPositiveInteger(index) {
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

  routeToGrievance(): void {
    this.navCtrl.push(GrievancePage, {'from': 'bidding', 'bidding_id': 1})
  }

  presentConfirm(data, index) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Order',
      message: 'Do you accept ' + data.rate +' Rs per Kg ?',
      buttons: [
        {
          text: 'Disagree',
          // role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Buy clicked');
            this.registerOrder(data, index);
          }
        }
      ]
    });
    alert.present();
  }

  registerOrder(order_data, index) {
    console.log('register_order')
    this.httpServerServiceProvider.confirmDomesticBid(order_data).subscribe((data) => {
      console.log(data);
      this.domestic_quotes[index]['latest_bid_info'] = data;
      this.displayToast('Order placed successfully!');
    }, (error) => {
      this.displayToast('Error!');
    });
  }



  // helping funtion
  isThere(key: string, value: any) {
    return value.hasOwnProperty(key)
  }

  isNull(value) {
    return value == null;
  }

  dateIncrement(date: string, increment_by: number) {
    let splited_date = date.split("-");
    return  splited_date[0] + '-' + splited_date[1] + '-' + String(parseInt(splited_date[2]) + increment_by)
  }

  toNum(value: string) {
    return parseInt(value);
  }

  calculateBiddingCostTotal(delivery_expense: number, quote_rate: string, quantity: number) {
    return ((delivery_expense + parseInt(quote_rate)) * (quantity * this.global.bag_quantity));
  }
}


