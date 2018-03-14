import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { GrievancePage } from './../grievance/grievance';
import { OrderPage } from './../order/order';

@Component({
  templateUrl: 'order-tabs.html'
})
export class OrderTabsPage {

  tab1Root = OrderPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = GrievancePage;
  constructor() {
  }
}
