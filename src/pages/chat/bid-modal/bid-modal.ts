import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-bid-modal',
  templateUrl: 'bid-modal.html',
})
export class BidModalPage {
  domestic_bag_types: any[] = [];
  domestic_copra_brands: any[] = [];
  selected_brand: any = null;
  selected_bag_type: any = null;
  bid_quantity: any = null;
  bid_rate: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.domestic_copra_brands = [];
    this.domestic_bag_types = [];
    let temp_data = navParams.get('details');
    this.domestic_copra_brands = temp_data['copra'];
    this.domestic_bag_types = temp_data['bags'];
    console.log(this.domestic_copra_brands);
    console.log(this.domestic_bag_types);
  }

  @ViewChild('slides') slides: Slides

  ionViewDidLoad() {
    console.log('ionViewDidLoad BidModalPage');
  }

  slideNext() {
    this.slides.slideNext();
  }

  slidePrevious() {
    this.slides.slidePrev();
  }

  dismiss() {
    if (this.bid_quantity != null && this.bid_rate != null) {
      let data = {
        brand: this.selected_brand,
        bag: this.selected_bag_type,
        quantity: parseFloat(this.bid_quantity),
        rate: parseFloat(this.bid_rate)
      }
      this.viewCtrl.dismiss(data);
      this.bid_quantity = null;
      this.bid_rate = null;
    } else {
      this.viewCtrl.dismiss();
    }
  }

  disableInput() {
    if (this.bid_quantity == null || this.bid_quantity == 0 || this.bid_quantity == '' || this.bid_rate == null || this.bid_rate == 0 || this.bid_rate == '') {
      return true;
    } else {
      return false;
    }
  }

}
