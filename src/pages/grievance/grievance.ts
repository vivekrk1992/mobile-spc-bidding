import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../providers/http-server-service/http-server-service';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-grievance',
  templateUrl: 'grievance.html',
})
export class GrievancePage {
  sale_list: any;
  sale_id: any;
  complain: any;
  image: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private camera: Camera, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    console.log(this.navParams.data);
    this.doRefresh();
  }

  doRefresh(event = null) {
    this.httpServerServiceProvider.getSaleListFor3Days().subscribe((data) => {
      console.log(data);
      this.sale_list = data;
      if (event != null) { event.complete() }
    }, () => {
      if (event != null) { event.complete() }
    });
  }
  
  submitComplain(sale_id, complain) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    let grievance_dict = {}
    grievance_dict['sale_id'] = sale_id;
    grievance_dict['complain'] = complain;
    if (this.image != null) {
      grievance_dict['image'] = this.image;
    }
    console.log(grievance_dict);
    this.httpServerServiceProvider.registerGrievance(grievance_dict).subscribe((data) => {
      console.log(data);
      loading.dismiss();
      this.displayToast('Complain registered!');
      this.image = null;
    }, (error) => {
      loading.dismiss();    
      console.log(error);
      this.displayToast('Error!');
    });
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.image = 'data:image/jpeg;base64,' + imageData;
      alert('Picture taken successfully');
    }, (err) => {
      // Handle error
      console.log(err);
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
