import { OrderPage } from './../order/order';
import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { GrievancePage } from './../grievance/grievance';
import { BuyerProfilePage } from './../buyer-profile/buyer-profile';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // tab1Root = HomePage;
  // tab1Root = OrderPage;
  tab1Root;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = GrievancePage;
  buyer_profile: any = 25;
  user: any;

  constructor(private storage: Storage) {
    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    });
    if (this.buyer_profile == 100) {
      this.tab1Root = HomePage;
      // this.tab1Root = OrderPage;
    } else {
      // this.tab1Root = HomePage;
      // this.tab1Root = OrderPage;
      this.tab1Root = BuyerProfilePage;
    }

  }
}
