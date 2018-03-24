import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';

@IonicPage()
@Component({
  selector: 'page-buyer-profile',
  templateUrl: 'buyer-profile.html',
})
export class BuyerProfilePage {

  business_form: FormGroup;
  address_form: FormGroup;
  gst_form: FormGroup;
  business_proof: any;
  resident_proof: any;
  isDropdownSelected: any;
  user: any
  address_proof: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private httpServerServiceProvider: HttpServerServiceProvider, private app: App, private toastCtrl: ToastController) {
    this.business_form = this.formBuilder.group({
      property_id: [5],
    });

    this.address_form = this.formBuilder.group({
      property_id: [null],
    });

    this.gst_form = this.formBuilder.group({
      value: [null],
      property_id: [10],
    });

    storage.get('user').then((user) => {
      console.log(user);
      this.user = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuyerProfilePage');
  }


  changeBusinessDocs(event): void {
    console.log('Function called')
    this.readBusinessProof(event.target);
  }
  
  changeResidentialDocs(event): void {
    console.log('Function called')
    this.readResidentialProof(event.target);
  }

  readBusinessProof(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.business_proof = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  readResidentialProof(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.resident_proof = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

  updateUserCVPropertity(business, address, gst) {
    let cv_profile = [];
    if (this.business_proof != undefined) {
      business['image_value'] = this.business_proof;
      business['buyer_id'] = this.user.id;
      cv_profile.push(business);
    }
    if (this.resident_proof != undefined) {
      address['property_id'] = parseInt(address['property_id']);
      address['image_value'] = this.resident_proof;
      address['buyer_id'] = this.user.id;
      cv_profile.push(address);
    }
    if (gst['value'] != null) {
      gst['value'] = gst['value'];
      gst['buyer_id'] = this.user.id;
      cv_profile.push(gst);
    }
    console.log(cv_profile);
    this.httpServerServiceProvider.saveUserPropertyFile(cv_profile).subscribe(data => {
      console.log(data);
      this.displayToast('Document(s) Uploaded Successfully!');
    }, (error) => {
      console.log(error);
      this.displayToast('Error!');
    });
  }

  routeLoginPage() {
    this.httpServerServiceProvider.logout().subscribe((data) => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    }, () => {
      this.storage.clear();
      this.app.getRootNav().setRoot('LoginPage');
    });
  }

  displayToast(display_message) {
    let toast = this.toastCtrl.create({
      message: display_message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
