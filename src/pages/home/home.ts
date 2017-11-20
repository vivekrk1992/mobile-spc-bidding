import { StatusBar } from '@ionic-native/status-bar';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { stagger } from '@angular/core/src/animation/dsl';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  domestic_quotes: any[];
  showLevel1 = null;
  todate: any = new Date().toISOString().split('T')[0];
  bidding_history: any[];
  latest_spc_rate: any;
  latest_buyer_rate: any;
  latest_bid_status: any;

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
    console.log('toggle')
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
      })
    }
    console.log(this.showLevel1);
  };
  
  isLevel1Shown(idx) {
    // console.log('level shown')
    // console.log(this.showLevel1);
    return this.showLevel1 === idx;
  };

  acceptBid(quantity, quote_id, status) {
    console.log(quantity);    
    console.log(quote_id);   
    this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status}).subscribe((data) => {
      console.log(data);
    }); 
  }

  bidding(quantity, quote_id, status, rate) {
    console.log(quantity);
    console.log(quote_id);
    console.log(status);
    console.log(rate);
    this.httpServerServiceProvider.registerDomesticBid({'id': quote_id, 'quantity': quantity, 'status': status, 'rate': rate, 'date': this.todate}).subscribe((data) => {
      console.log(data);
      this.bidding_history.push(data);
      this.displayToast('Bidding registered successfully!');
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
