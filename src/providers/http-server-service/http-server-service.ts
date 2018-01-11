// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage} from '@ionic/storage';

// import { Storage } from '@ionic/storage';

@Injectable()
export class HttpServerServiceProvider {
  user_id: number;
  user_type: string;

  headers: Headers;
  // base_url: string = "http://127.0.0.1:8000/";
  base_url: string = "http://192.168.0.105:8000/";
  // base_url: string = "http://api.exportcopra.com/";

  constructor(public http: Http, private storage: Storage) {
    console.log('Hello HttpServerServiceProvider Provider');
    this.headers = new Headers();
    this.storage.get('token').then((token) => {
      if(token != null) {
        console.log('token not null');
        this.headers.append('Authorization', 'Token ' + token);
        this.getAllDomesticList().subscribe((data) => {
          console.log(data);
        });
      }
    });
  }

// login
  login(data) {
    return this.http.post(this.base_url + "main/mobile/login/", data)
      .map(res => res.json());
  }

// logout
  logout() {
    let data = {'puspose': 'logout'};
    return this.http.post(this.base_url+'main/mobile/logout/',data , {headers: this.headers})
      .map(res => console.log(res));
  }

  setTokenHeader(token) {
    console.log(token);
    this.headers = new Headers();
    this.headers.append('Authorization', 'Token ' + token);
    console.log('token setted into header');
  }

// Domestic
  getAllDomesticList() {
    console.log('get domestic quote');
    console.log(this.headers);
    return this.http.get(this.base_url + 'main/serve/domestic/quote/', {headers: this.headers})
      .map((res) => res.json());
  }

  getAllDomesticQuotesWithLatestBid() {
    console.log('get domestic quote along with latest bid info!');
    console.log(this.headers);
    return this.http.get(this.base_url + 'main/serve/domestic/qutoe/history/for/buyer/', {headers: this.headers})
      .map((res) => res.json());
  }

  registerDomesticBid(data) {
    return this.http.post(this.base_url + 'main/register/domestic/bid/', data, {headers: this.headers})
      .map((res) => res.json());
  }

  registerDomesticBidMsg(data) {
    return this.http.post(this.base_url + 'main/register/domestic/bid/msg/', data, {headers: this.headers})
      .map((res) => res.json());
  }


  getDomesticBiddingListByBuyer() {
    return this.http.get(this.base_url + 'main/serve/domestic/bidding/list/by/buyer/', {headers: this.headers})
      .map((response) => response.json());
  }

  getDomesticBiddingHistoryByQuote(quote_id) {
    return this.http.post(this.base_url + 'main/serve/domestic/bidding/history/by/quote/', {'quote_id': quote_id}, {headers: this.headers})
      .map((response) => response.json());
  }

  confirmDomesticBid(data) {
    return this.http.post(this.base_url + 'main/confirm/domestic/bid/by/buyer/', data, {headers: this.headers});
  }

  getDomesticDeliveryExpense() {
    return this.http.get(this.base_url + 'main/serve/domestic/delivery/expense/', {headers: this.headers})
      .map((response) => response.json());
  }

// stock
  getStockDetails() {
    return this.http.get(this.base_url + 'main/serve/stock/details/', {headers: this.headers})
      .map((response) => response.json());
  }

  checkStockAvailability(data) {
    return this.http.post(this.base_url + 'main/check/availability/', data, {headers: this.headers})
      .map((response) => response.json());
  }
  payment(data)
  {
    return this.http.post(this.base_url + 'main/add/domestic/sale/payment/', data, {headers: this.headers})
      .map((response) => response.json());
  }
  getmodesofpayment()
  {
    return this.http.get(this.base_url + 'main/serve/domestic/sale/payment/modes/', {headers: this.headers})
      .map((response) => response.json());
  }

}
