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
  sale_id: any = null;
  complain: any[] = [];
  image: any = null;
  complain_images: any[][] = [[], []];
  grievance_types: any;
  selected_grievance_type: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpServerServiceProvider: HttpServerServiceProvider, private camera: Camera, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    console.log(this.navParams.data);
  }
  
  ionViewWillEnter() {
    this.doRefresh();
    this.httpServerServiceProvider.getGrievanceTypes().subscribe((data) => {
      console.log(data);
      this.grievance_types = data;
    }, (error) => {
      console.log(error);
    });
  }

  doRefresh(event = null) {
    this.httpServerServiceProvider.getSaleListFor3Days().subscribe((data) => {
      console.log(data);
      this.sale_list = data;
      this.complain_images = [[], []];      
      for (let index in this.sale_list) {
        this.complain_images[index].push(null);
      }
      if (event != null) { event.complete() }
    }, () => {
      if (event != null) { event.complete() }
    });
  }
  
  submitComplain(sale_id, complain, sale_index, grievance_type) {
    if (sale_id != null && grievance_type != undefined) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
  
      loading.present();
      let grievance_dict = {}
      grievance_dict['sale_id'] = sale_id;
      grievance_dict['complain'] = complain;
      grievance_dict['grievance_type'] = grievance_type;
      if (this.complain_images[sale_index][0] != null && this.complain_images[sale_index][0] != '') {
        grievance_dict['images'] = this.complain_images[sale_index];
      }
      console.log(grievance_dict);
      this.httpServerServiceProvider.registerGrievance(grievance_dict).subscribe((data) => {
        console.log(data);
        loading.dismiss();
        this.displayToast('Complain registered!');
        this.complain_images[sale_index] = null;
        this.complain[sale_index] = null;
        this.sale_id = null;
        this.selected_grievance_type[sale_index] = null;
      }, (error) => {
        loading.dismiss();    
        console.log(error);
        this.displayToast(error);
      });
    }
    else {
      alert('Select the sale and Grievance type')
    }
  }

  takePicture(sale_index, image_index) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.complain_images[sale_index][image_index] = 'data:image/jpeg;base64,' + imageData;
      // alert('Picture taken successfully');
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

  addImageCount(sale_index) {
    this.complain_images[sale_index].push(null);
  }

  popImageCount(sale_index) {
    this.complain_images[sale_index].splice(sale_index, 1);
  }

}
