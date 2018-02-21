import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { HttpServerServiceProvider } from "../../providers/http-server-service/http-server-service";


@IonicPage()
@Component({
  selector: 'page-sale-order-details',
  templateUrl: 'sale-order-details.html',
})
export class SaleOrderDetailsPage {
  bid_details: any;
  bid_sale_details: any = {};
  constructor(public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider) {
    console.log(this.navParams.data)
    this.bid_details = this.navParams.data;
    this.getSaleDetailsForBid();
  }

  getSaleDetailsForBid(event = null) {
    let data = {'bid_id':this.bid_details.id};
    console.log(data);
    this.httpServerServiceProvider.getSaleDetailsForBid(data).subscribe((res_data) => {
      console.log(res_data);
      this.bid_sale_details = res_data;
      if (event != null) {
        event.complete();
      }
    }, () => {
      if (event != null) {
        event.complete();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaleOrderDetailsPage');
  }

}
