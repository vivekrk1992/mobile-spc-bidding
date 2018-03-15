import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { GrievancePage } from './../grievance/grievance';
import { OrderPage } from './../order/order';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = OrderPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = GrievancePage;
  user: any;

  constructor(private storage: Storage) {
    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    }, (error) => {
      console.log(error);
    });
  }
}
