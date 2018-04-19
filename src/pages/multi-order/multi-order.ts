import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-multi-order',
  templateUrl: 'multi-order.html',
})
export class MultiOrderPage {
  user: any;
  domestic_data: any;
  domestic_quote_of_the_day: any = null;
  // order_form: any[] = [];
  maximum_weight_allowance: number = 0;
  currnt_order_total_weight: number = 0;
  weight_difference: number = null;
  transport: boolean = false;
  transport_details: any;
  user_balance: any;
  transport_id: any = null;
  product_cost: any = null;
  company_name: any = null;
  current_stock: any;
  gold_weight_allowance: number = 1250;
  silver_weight_allowance: number = 500;
  bronze_weight_allowance: number = 250;
  weight_allowance: number = 0;

  order_form = [
  {
    copra_brand: { 'id': 1, 'name': 'SHUBH', 'notes': '22-25 Pc/Kg' },
    bag_type: { 'id': 1, 'name': '50 kg Bori' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 50,
    total_quantity: 0,
    cost: null,
    disabled: false
  },
  {
    copra_brand: { 'id': 1, 'name': 'SHUBH', 'notes': '22-25 Pc/Kg' },
    bag_type: { 'id': 2, 'name': '25 kg Katta' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 25,
    total_quantity: 0,
    cost: null,
    disabled: false
  },
  {
    copra_brand: { 'id': 2, 'name': 'SPC', 'notes': '18-20 Pc/Kg' },
    bag_type: { 'id': 1, 'name': '50 kg Bori' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 50,
    total_quantity: 0,
    cost: null,
    disabled: false
  },
  {
    copra_brand: { 'id': 2, 'name': 'SPC', 'notes': '18-20 Pc/Kg' },
    bag_type: { 'id': 2, 'name': '25 kg Katta' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 25,
    total_quantity: 0,
    cost: null,
    disabled: false
  },
  {
    copra_brand: { 'id': 3, 'name': 'LABH', 'notes': '14-16 Pc/Kg' },
    bag_type: { 'id': 1, 'name': '50 kg Bori' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 50,
    total_quantity: 0,
    cost: null,
    disabled: false
  },
  {
    copra_brand: { 'id': 3, 'name': 'LABH', 'notes': '14-16 Pc/Kg' },
    bag_type: { 'id': 2, 'name': '25 kg Katta' },
    bag_count: null,
    rate: null,
    buyer_id: null,
    quantity_in_kgs: 25,
    total_quantity: 0,
    cost: null,
    disabled: false
  }
];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private app: App, private storage: Storage, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    // this.domestic_data['user_payment_balance'] = 0;

  }
  
  ionViewWillEnter() {
    this.user_balance = null;
    console.log('ionViewWillEnter MultiOrderPage');
    this.doRefresh();
    this.httpServerServiceProvider.getDomesticTransportByCity().subscribe((data) => {
      console.log(data);
      this.transport_details = data;
    }, (error) => {
      console.log(error);
    });
  }
  
  doRefresh(event = null) {
    this.httpServerServiceProvider.getTodayDomesticQuote().subscribe((data) => {
      console.log(data);
      this.domestic_data = data;
      this.user_balance = data['user_payment_balance'];
      this.company_name = data['company_name'];

      if (data['eligibility'] == 'gold') {
        this.weight_allowance = this.gold_weight_allowance;
      } else if (data['eligibility'] == 'silver') {
        this.weight_allowance = this.silver_weight_allowance;
      } else if (data['eligibility'] == 'bronze') {
        this.weight_allowance = this.bronze_weight_allowance
      }

      if (data.hasOwnProperty('rate')) {
        this.domestic_quote_of_the_day = data.rate;
      }

      if (data['user_payment_balance'] >= 0) {
        this.maximum_weight_allowance = (Math.floor(data['user_payment_balance'] / data['rate']) + this.weight_allowance)
        this.weight_difference = this.maximum_weight_allowance;
      } else {
        this.maximum_weight_allowance = 0;
      }
      if (event != null) { event.complete() }

    }, (error) => {
      if (event != null) { event.complete() }
    });

    // get user from local storage
    this.storage.get('user').then((user) => {
      this.user = user;

      // get current status to enable/disable the form
      this.httpServerServiceProvider.getCurrentStock({'ddp_id': 1}).subscribe((data) => {
        this.current_stock = data;
        for (let index in this.order_form) {
          if (this.current_stock[this.order_form[index]['copra_brand']['id']][this.order_form[index]['bag_type']['id']] >= 10) {
            this.order_form[index]['disabled'] = false
            this.order_form[index]['rate'] = this.domestic_quote_of_the_day
            this.order_form[index]['buyer_id'] = this.user['id']
          }
          else {
            this.order_form[index]['disabled'] = true
          }
        }
      }, (error) => {
        console.log(error);
      });
    });
  }

  routePaymentDetails() {
    this.navCtrl.push('PaymentDetailsPage');
  }

  getBackgroundColor(amount) {
    if (amount <= 0) {
      return 'red';
    } else {
      return 'green';
    }
  }

  filterOrderBags() {
    let collected_value: any[] = [];
    let total_weight = 0
    this.order_form.forEach(element => {
      console.log(element.bag_count);
      console.log(element.rate);
      if (element.bag_count != '' && element.bag_count != 0 && element.bag_count != null) {
        collected_value.push(element)
        element.total_quantity = element.quantity_in_kgs * element.bag_count
        console.log(element.total_quantity)
        element.cost = element.total_quantity * element.rate
        total_weight += element.total_quantity
      } else {
        element.total_quantity = 0
        element.cost = null;
      }
      this.currnt_order_total_weight = total_weight;
    });

    console.log(this.currnt_order_total_weight);
    this.weight_difference = this.maximum_weight_allowance - this.currnt_order_total_weight;
    console.log(this.weight_difference);
    return collected_value;
  }

  registerOrderForBuyer(order_confirmation, transport_by_spc, transport_id) {
    console.log(transport_by_spc);
    console.log(transport_id);
    let sale_dict = {};
    if (this.transport) {
      if (this.transport_id == null) {
        alert('Please select a transport!');
        return false;
      } else {
      }
    }
    sale_dict['sale_group'] = { 'buyer_id': this.user['id'], 'transport_paid_by_spc': transport_by_spc, 'transport_id': transport_id }

    sale_dict['sales'] = this.filterOrderBags();
    console.log(sale_dict);
    console.log('collected order bag');

    if (this.maximum_weight_allowance < this.currnt_order_total_weight) {
      alert('Requested weight is ' + (this.currnt_order_total_weight - this.maximum_weight_allowance) + ' kgs, more than orderable limit');
    } else {
      if (sale_dict['sales'].length != 0) {
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });

        loading.present();

        this.httpServerServiceProvider.registerDirectOrderToSale(sale_dict).subscribe(data => {
          console.log(data);
          this.displayToast('Order Placed!');
          loading.dismiss();
          this.doRefresh();
          this.product_cost = null;
          this.order_form.forEach(element => {
            element.bag_count = null;
            element.cost = null;
            element.total_quantity = 0;
          });
        }, (error) => {
          console.log(error);
          this.displayToast(error);
          loading.dismiss();
        });
      } else {
        alert('Form shoud not be empty!');
      }
    }
  }

  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  calculateBagsToQuantity() {
    this.product_cost = 0;
    this.filterOrderBags();
    this.product_cost = (this.domestic_data.rate * this.currnt_order_total_weight)
    console.log(this.product_cost);
  }

  showBankDetails() {
    let alert = this.alertCtrl.create({
      title: 'Bank Details',
      subTitle: `<p>Shree Parshwanath Corporation</p><p> A/C NO : 065405001702 </p><p> ICICI BANK CURRENT ACCOUNT </p><p> IFSC: ICIC0000654 </p><p> BRANCH: PALI</p>`,
      buttons: ['OK']
    });
    alert.present();
  }

  disabledFormStyle(status) {
    if(status) {
      return '100'
    }
    else {
      return '500'
    }
  }

  logout() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    }, () => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    });
  }

}
