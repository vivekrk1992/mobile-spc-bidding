import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global'
import { FCM } from '@ionic-native/fcm';
import { ConfirmOrderPage } from '../confirm-order/confirm-order';
import { TimerComponent } from '../../components/timer/timer';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-multi-order',
  templateUrl: 'multi-order.html',
})
export class MultiOrderPage {
  @ViewChild(TimerComponent) timer: TimerComponent;
  // @ViewChild(TimerComponent) timer: TimerComponent[];
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
  // current_stock: any;
  today_orders: any = [];
  show_today_orders: boolean = false;
  app_version: any = {};
  gst_percentage: any = 0;
  default_lang: any = 'english';
  new_date_today: any;
  restricted_time: any;

  rate_now: any = {};

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
      disabled: true
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
      disabled: true
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
      disabled: true
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
      disabled: true
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
      disabled: true
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
      disabled: true
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider,
    private app: App, private storage: Storage, private toastCtrl: ToastController, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private global: GlobalProvider, private fcm: FCM, private events: Events,
    private ref: ChangeDetectorRef, public translate: TranslateService) {

      this.events.subscribe('today_quote', (data) => {
      this.doRefresh();
      this.displayToast('Your quote rate is updated!');
    });

    this.storage.get('language').then((lang) => {
      console.log(lang);
      if (lang != null) {
        this.default_lang = lang;
      }
      this.translate.addLangs(['english', 'hindi']);
      this.translate.setDefaultLang('english');
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match(/english|hindi/) ? browserLang : this.default_lang);
    });

  }

  ionViewCanEnter() {
    this.doRefresh();
    this.saveFcmDeviceTokenToServer()
    this.user_balance = null;
    console.log('ionViewCanEnter MultiOrderPage');
    this.httpServerServiceProvider.getDomesticTransportByCity().subscribe((data) => {
      console.log(data);
      this.transport_details = data;
    }, (error) => {
      console.log(error);
    });

    
    // this.translate.addLangs(['hi', 'en']);
    // this.translate.setDefaultLang('hi');
    // const browserLang = this.translate.getBrowserLang();
    // this.translate.use(browserLang.match(/hi|en/) ? browserLang : 'hi');
  }


  doRefresh(event = null) {
    this.getAppVersion();
    this.httpServerServiceProvider.getTodayDomesticQuote().subscribe((data) => {
      console.log(data);
      this.domestic_data = data;
      this.user_balance = data['user_payment_balance'];
      this.company_name = data['company_name'];
      console.log(data['buyer_time_limit']);
      this.restricted_time = new Date(data['buyer_time_limit']).toLocaleTimeString();
      this.new_date_today = new Date().toLocaleTimeString();
      
      if (data.hasOwnProperty('rate')) {
        this.domestic_quote_of_the_day = data.rate;
      }

      if (data['user_payment_balance'] >= 0) {
        this.maximum_weight_allowance = (Math.floor(data['user_payment_balance'] / data['rate']) + data['domestic_buyer_maximum_weight_limit'])
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
      this.httpServerServiceProvider.getQuoteAdjustmentFactor().subscribe((data) => {
        console.log(data);
        let quote_adjustment_rate = data;
        // get current status to enable/disable the form
        this.order_form.forEach((obj) => {
          obj.buyer_id = this.user['id'];
          if (quote_adjustment_rate.hasOwnProperty(obj.copra_brand['id'])) {
            obj.rate = quote_adjustment_rate[obj.copra_brand['id']][obj.bag_type['id']]['rate'];
            if (quote_adjustment_rate[obj.copra_brand['id']][obj.bag_type['id']]['is_active']) {
              obj.disabled = false;
            }
          }
        // this.httpServerServiceProvider.getCurrentStock({ 'ddp_id': 1 }).subscribe((data) => {
        //   let current_stock = data;

        //     // disable the field when less than 5 bags 

        //     // if (current_stock[obj.copra_brand['id']][obj.bag_type['id']] > 5) {
        //     //   obj.disabled = false;
        //     // } else {
        //     //   console.log('in disable')
        //     //   obj.disabled = true;
        //     // }
        //   });
          // for (let index in this.order_form) {
          //   if (this.current_stock[this.order_form[index]['copra_brand']['id']][this.order_form[index]['bag_type']['id']] >= 10) {
          //     this.order_form[index]['disabled'] = false;
          //     this.order_form[index]['rate'] = quote_adjustment_rate[this.order_form[index]['copra_brand']['id']][this.order_form[index]['bag_type']['id']]['rate'];
          //     this.order_form[index]['buyer_id'] = this.user['id'];
          //   }
          //   else {
          //     this.order_form[index]['disabled'] = true;
          //   }
          // }
          
          this.ref.detectChanges();
        }, (error) => {
          console.log(error);
          console.log(JSON.stringify(error))
        });
        let buyer_dict = { 'buyer_id': this.user['id'] }
        this.httpServerServiceProvider.getTodayOrderHistory(buyer_dict).subscribe((data) => {
          this.today_orders = data;
          // alert(JSON.stringify(this.today_orders));
          this.today_orders.forEach((element, index) => {
            element['time_in_second'] = 10000;         
            // alert(element['time_created'])
          });
          // setTimeout(() => {
          //   this.timer.startTimer();
          // }, 100)
          // alert(JSON.stringify(this.today_orders));
          if (this.today_orders.length != 0) {
            this.show_today_orders = true;
          }
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
      })
    });

  }

  routePaymentDetails() {
    this.navCtrl.push('PaymentDetailsPage');
  }

  getBackgroundColor(amount) {
    if (amount < 0) {
      return 'red';
    } else if (amount > 0) {
      return 'green';
    } else {
      return 'black';
    }
  }

  filterOrderBags() {
    let collected_value: any[] = [];
    let total_cost = 0
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
        total_cost += element.cost
      } else {
        element.total_quantity = 0
        element.cost = null;
      }
      this.currnt_order_total_weight = total_weight;
      this.product_cost = total_cost;
    });

    console.log(this.currnt_order_total_weight);
    this.weight_difference = this.maximum_weight_allowance - this.currnt_order_total_weight;
    console.log(this.weight_difference);
    return collected_value;
  }

  registerOrderForBuyer(order_confirmation, transport_by_spc, transport_id) {
    console.log(transport_by_spc);
    console.log(transport_id);
    this.new_date_today = new Date().toLocaleTimeString();
    let sale_dict = {};
    console.log('datime Now------->' + this.new_date_today);
    console.log('Restricted Time----->' + this.restricted_time);
    if (this.new_date_today >= this.restricted_time) {
      alert('३ बजे के बाद आर्डर नहीं कर सकते है or contact 0141-4161787');
      return false;
    } else {
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

      if (this.gst_percentage == null) {
        alert('Select the Purpose for dried coconuts!')
      } else {
        if (this.maximum_weight_allowance < this.currnt_order_total_weight) {
          alert('Requested weight is ' + (this.currnt_order_total_weight - this.maximum_weight_allowance) + ' kgs, more than orderable limit');
        } else {
          if (sale_dict['sales'].length != 0) {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
    
            loading.present();
            // this.navCtrl.push(ConfirmOrderPage, sale_dict);
            this.httpServerServiceProvider.registerDirectOrderToSale(sale_dict).subscribe(data => {
              console.log(data);
              alert('Your order have been placed, Thank You for the order!');
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
    // this.product_cost = (this.domestic_quote_of_the_day * this.currnt_order_total_weight)
    console.log(this.product_cost);
  }

  showBankDetails() {
    let alert = this.alertCtrl.create({
      title: 'Bank Details',
      subTitle: `<p><strong>RTGS Details:</strong></p>
      <p>Shree Parshwanath Corporation</p>
      <p> A/C NO : 065405001702 </p>
      <p> ICICI BANK CURRENT ACCOUNT </p>
      <p> IFSC: ICIC0000654 </p>
      <p> BRANCH: PALI</p>
      <br><p><strong>UPI Details:</strong></p>
      <p>UPI ID: spcshubh@icici</p>`,
      buttons: ['OK']
    });
    alert.present();
  }

  disabledFormStyle(status) {
    if (status) {
      return '100'
    }
    else {
      return '500'
    }
  }

  onClickDetailOrder(order_detail) {
    this.navCtrl.push('OrderHistoryPage', order_detail);
  }

  onClickPayNow() {
    console.log('Button Pay now pressed!');
  }

  routeUserProfile() {
    let buyer_profile_dict = {};
    buyer_profile_dict['user_details'] = this.domestic_data
    buyer_profile_dict['user_details']['weight_allowance'] = this.maximum_weight_allowance
    buyer_profile_dict['user_details']['payment_background_color'] = this.getBackgroundColor(this.user_balance)
    this.navCtrl.push('UserProfilePage', buyer_profile_dict);
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

  getAppVersion() {
    this.httpServerServiceProvider.getAppVersion().subscribe((data) => {
      console.log(data);
      // this.global.validateApp(data);
      this.validateApp(data);
    }, (error) => {
      console.log(error);
    })
  }

  validateApp(data) {
    if (data['version'] != this.global.app_version) {
      alert('Please update latest version of your app from play store');
      if (data['relogin']) {
        this.logout();
      }
      window.open("https://play.google.com/store/apps/details?id=spc.exportcopra.buyer", "_system");
    } else {
      console.log('app validate');
    }
  }


  saveFcmDeviceTokenToServer() {
    this.fcm.getToken().then(token => {
      let data = { 'token': token };
      this.httpServerServiceProvider.sendFcmDeviceToken(data).subscribe(data => {
      }, (error) => {
      }
      );
    }, (error) => {
    });
  }

  setDefaultLanguage(language) {
    console.log(language);
    this.storage.set('language', language);
  }
}
