import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  bidding_list: any[] = [];
  constructor(public navCtrl: NavController, private httpServerServiceProvider: HttpServerServiceProvider) {
    console.log('about constructor');
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

}
