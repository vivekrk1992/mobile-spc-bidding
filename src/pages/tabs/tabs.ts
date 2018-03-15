import { Component, ViewChild } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { GrievancePage } from './../grievance/grievance';
import { BuyerProfilePage } from './../buyer-profile/buyer-profile';
import { OrderPage } from './../order/order';
import { Storage } from '@ionic/storage';
import { NavController, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabRoot') tabRef: Tabs;
  tab1Root = BuyerProfilePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = GrievancePage;
  buyer_profile_complete_percentage: number = 0;
  user: any;

  constructor(private storage: Storage, public navCtrl: NavController) {
    console.log('tabs page constructor');
    // this.tab1Root = OrderPage;
    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    }, (error) => {
      console.log(error);
    });

    this.storage.get('user_properties').then((property) => {
      console.log('storage get function');
      console.log(property);
      if (property.hasOwnProperty('buyer_profile_complete_percentage')) {
        this.buyer_profile_complete_percentage = parseInt(property['buyer_profile_complete_percentage']);
        console.log('profile complete percentage = ', this.buyer_profile_complete_percentage);
        console.log(typeof (this.buyer_profile_complete_percentage));
        console.log('after assign percentage');
      } else {
        this.buyer_profile_complete_percentage = 0;
      }
    }, (error) => {
      console.log(error);
    });
    
  }
}
