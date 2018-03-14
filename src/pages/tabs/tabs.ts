import { Component } from '@angular/core';
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

  // tab1Root = HomePage;
  // tab1Root = OrderPage;
  tab1Root: any;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = GrievancePage;
  buyer_profile_complete_percentage: number = 0;
  user: any;

  constructor(private storage: Storage, public navCtrl: NavController) {

    this.tab1Root = OrderPage;
    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    }, (error) => {
      console.log(error);
    });

    this.storage.get('user_properties').then((property) => {
      if (property.hasOwnProperty('buyer_profile_complete_percentage')) {
        this.buyer_profile_complete_percentage = parseInt(property['buyer_profile_complete_percentage']);
        console.log('profile complete percentage = ', this.buyer_profile_complete_percentage);
        console.log(typeof (this.buyer_profile_complete_percentage));
        this.routePage();
      } else {
        this.buyer_profile_complete_percentage = 0;
      }
    }, (error) => {
      console.log(error);
    });
    
  }
  
  // getActiveChildNav() {
  //   this.routePage();
  // }
  // ionViewCanEnter() {
  //   this.routePage();
  // }

  routePage() {
    if (this.buyer_profile_complete_percentage == 100) {
      console.log('in if condition when profile is at 100');
      // this.navCtr l.setRoot(OrderPage);
    } else {
      console.log('in else for second if');
      // this.navCtrl.setRoot(BuyerProfilePage);
    }
  }
}
