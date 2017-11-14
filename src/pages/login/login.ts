import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login_form: FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private httpServerServiceProvider: HttpServerServiceProvider) {
    this.login_form = this.formBuilder.group({
      user_name: [''],
      password: [''],
    });

    storage.get('token').then((token) => {
      if(token != null){
        console.log('token not null');
        // this.httpServerServiceProvider.setTokenHeader(token);        
        this.navCtrl.setRoot(TabsPage);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logIn() {
    this.httpServerServiceProvider.login(this.login_form.value).subscribe(
      (data) => {
        console.log(data)
        this.storage.set('token', data.token);
        this.storage.set('user_type', data.user_type);
        this.httpServerServiceProvider.setTokenHeader(data.token);
        this.navCtrl.setRoot(TabsPage);
      }
    );
  }
}
