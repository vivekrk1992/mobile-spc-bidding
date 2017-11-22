import { StatusBar } from '@ionic-native/status-bar';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { stagger } from '@angular/core/src/animation/dsl';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  domestic_quotes: any[];
  showLevel1 = null;
  todate: any = new Date().toISOString().split('T')[0];
  bidding_history: any[];
  latest_bid_info = {};
  latest_spc_rate: any;
  latest_buyer_rate: any;
  latest_bid_status: any;
  quantity: any;
  order_quantity: any;

  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private toastCtrl: ToastController) {
    this.httpServerServiceProvider.getAllDomesticList().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
    });
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
  toggleLevel1(idx, quote_id) {
    console.log('toggle');
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
      console.log(quote_id);
      this.httpServerServiceProvider.getDomesticBiddingHistoryByQuote(quote_id).subscribe((data) => {
        console.log(data);
        this.bidding_history = data;

        // set latest buyer/spc rates
        this.latest_buyer_rate = data[data.length-1].buyer_rate;
        this.latest_spc_rate = data[data.length-1].spc_rate;
        this.latest_bid_status = data[data.length-1].bid_status;
        this.quantity = data[data.length-1].buyer_quantity;
      })
    }
    console.log(this.showLevel1);
  };

  isLevel1Shown(idx) {
    // console.log('level shown')
    // console.log(this.showLevel1);
    return this.showLevel1 === idx;
  };

  onOrderItem(quantity, quote_id, latest_spc_rate, latest_buyer_rate, status) {
    console.log(quantity);
    console.log(quote_id);
    if (latest_buyer_rate < latest_spc_rate){
      let diff = latest_spc_rate - latest_buyer_rate;
      alert("Warning: SPC price is " + diff + " Rs higher than your last bid price!. Are you sure to order the item at " + latest_spc_rate + "Rs/Kg rate?")
    }
    if (latest_buyer_rate > latest_spc_rate){
      let diff = latest_buyer_rate - latest_spc_rate;
      alert("Warning: SPC price is " + diff + " Rs lower than your last bid price!. So, order will be placed at SPC's cheaper rates. @" + latest_spc_rate + "Rs/Kg!!!")
    }
    this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status}).subscribe((data) => {
      console.log(data);
    });
  }

  bidding(quantity, quote_id, status, rate) {
    if (rate > this.latest_spc_rate) {
      alert('Your bidding rate higher than spc rate');
    } else if (rate <= this.latest_buyer_rate) {
      alert('Your bidding can not equal or less than your previous bidding!');
    } else {
      this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': rate, 'date': this.todate}).subscribe((data) => {
        console.log(data);
        this.bidding_history.push(data);
        this.latest_buyer_rate = data.buyer_rate;
        this.latest_spc_rate = data.spc_rate;
        this.latest_bid_status = data.bid_status;
        this.displayToast('Bidding registered successfully!');
      }, (error) => {
        this.displayToast('Error!');
      });
    }
  }

  onSendMessage(message, quote_id) {
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


  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}


