import { GrievancePage } from './../grievance/grievance';
import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { SaleOrderDetailsPage } from "../sale-order-details/sale-order-details";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  domestic_quotes: any[] = [];
  todate: any = new Date().toISOString().split('T')[0];
  latest_bid_info: any = {};
  total_cost_unpaid: number = 0;
  total_cost_partial: number = 0;
  bag_25: any;
  bag_50: any;
  bidding_list: any[] = [];
  show_paid_order: boolean = false;
  all_domestic_sales: any[] = [];
  user: any;
  all_date_wise_transactions: any;

  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider, private storage: Storage, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    // this.httpServerServiceProvider.getAllDomesticQuotesWithLatestBid().subscribe((data) => {
    //   this.domestic_quotes = data;
    // });

    // this.httpServerServiceProvider.getOrderHistory().subscribe((data) => {
    //   this.domestic_quotes = data;
    //   console.log(data);
    //   console.log(data.length);
    //   if (data[0]['unpaid'].length !== 0) {
    //     this.total_cost_unpaid = data[0]['unpaid'][0]['total_amount'];
    //   }
    //   if (data[0]['partially_paid'].length !== 0) {
    //     this.total_cost_partial = data[0]['partially_paid'][0]['total_pending'];
    //   }
    // });

    
  }
  
  ionViewWillEnter() {
    this.doRefresh();
  }
  
  doRefresh(event = null) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    this.storage.get('user').then((user) => {
      this.user = user;
      this.httpServerServiceProvider.getTransactionsForDomesticBuyer({'buyer_id': this.user['id']}).subscribe((data) => {
        console.log(data);
        this.all_date_wise_transactions = data;
        loading.dismiss();
        if (event != null) { event.complete() }
      }, (error) => {
        if (event != null) { event.complete() }
        loading.dismiss();
        console.log(error);
      });
    });

    // this.httpServerServiceProvider.getAllDomesticQuotesWithLatestBid().subscribe((data) => {
    //   this.domestic_quotes = data;
    //   console.log(data);
    //   event.complete();
    // }, () => {
    //   event.complete();
    // });

    // this.httpServerServiceProvider.getOrderHistory().subscribe((data) => {
    //   this.domestic_quotes = data;
    //   if (data[0]['unpaid'].length !== 0) {
    //     this.total_cost_unpaid = data[0]['unpaid'][0]['total_amount'];
    //   }
    //   if (data[0]['partially_paid'].length !== 0) {
    //     this.total_cost_partial = data[0]['partially_paid'][0]['total_pending'];
    //   }
    //   console.log(data);
    //   event.complete();
    // }, () => {
    //   event.complete();
    // });

  }



  // getBiddingList(event) {
  //   this.httpServerServiceProvider.getDomesticBiddingListByBuyer().subscribe((data) => {
  //     this.bidding_list = data;
  //     console.log(data);
  //     event.complete();
  //   }, () => {
  //     event.complete();
  //   });
  // }

  isBidStatusAccepted(bid_status: number) {
    return bid_status === 3
  }

  routeToGrievancePage(bid_id) {
    this.navCtrl.push(GrievancePage, { 'from': 'history', 'bid_id': bid_id })
  }

  // showPaidOrder() {
  //   this.show_paid_order = !this.show_paid_order
  // }
}
