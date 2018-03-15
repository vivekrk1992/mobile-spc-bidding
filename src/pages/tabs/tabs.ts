import { Component } from '@angular/core';
import { BuyerProfilePage } from './../buyer-profile/buyer-profile'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = BuyerProfilePage;

  constructor() {
  }
}
