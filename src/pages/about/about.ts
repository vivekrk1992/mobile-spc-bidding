import { GrievancePage } from './../grievance/grievance';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  domestic_quotes: any[] = [];
  todate: any = new Date().toISOString().split('T')[0];
  bidding_history: any[];
  latest_bid_info: any = {};
  order_quantity: any;
    
  bidding_list: any[] = [];
  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private toastCtrl: ToastController) {
    this.httpServerServiceProvider.getAllDomesticQuotesWithLatestBid().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
    });
  }

  
  doRefresh(event) {
    this.httpServerServiceProvider.getAllDomesticQuotesWithLatestBid().subscribe((data) => {
      console.log(data);
      this.domestic_quotes = data;
      event.complete();
    }, (error) => {
      event.complete();
    });
  }

  

  getBiddingList(event) {
    this.httpServerServiceProvider.getDomesticBiddingListByBuyer().subscribe((data) => {
      console.log(data);
      this.bidding_list = data;
      event.complete();
    }, (error) => {
      event.complete();
    });
  }

  isBidStatusAccepted(bid_status: number) {
    console.log(bid_status);
    return bid_status === 3
  }

  routeToGrievancePage(bid_id) {
    this.navCtrl.push(GrievancePage, {'from': 'history', 'bid_id': bid_id})
  }
}
