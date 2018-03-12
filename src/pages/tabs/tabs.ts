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
  buyer_profile_complete_percentage: any;
  user: any;

  constructor(private storage: Storage) {
    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    }, (error) => {
      console.log(error);
    });

    storage.get('user_properties').then((property) =>{
      if (property.hasOwnProperty('buyer_profile_complete_percentage')) {
        this.buyer_profile_complete_percentage = parseInt(property['buyer_profile_complete_percentage']);
        console.log('profile complete percentage = ', this.buyer_profile_complete_percentage);
        console.log(typeof(this.buyer_profile_complete_percentage));
      } else {
        this.buyer_profile_complete_percentage = 0;
      }
    }, (error) =>{
      console.log(error);
    });

    if (this.buyer_profile_complete_percentage == 100) {
      this.tab1Root = OrderPage;
    } else {
      // this.tab1Root = OrderPage;
      this.tab1Root = BuyerProfilePage;
    }

  }
}
