import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides, ToastController } from 'ionic-angular';
import { HttpServerServiceProvider } from '../../../providers/http-server-service/http-server-service';


@IonicPage()
@Component({
  selector: 'page-questionnaire-modal',
  templateUrl: 'questionnaire-modal.html',
})
export class QuestionnaireModalPage {
  questions: any[] = [];
  bag_types_for_questionnarie: any[] = [];
  copra_brands_for_questionnarie: any[] = [];
  selected_brand: any = null;
  selected_question: any = null;
  selected_bag_type: any=  null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private httpServerServiceProvider: HttpServerServiceProvider, private toastCtrl: ToastController) {
    this.copra_brands_for_questionnarie = [];
    this.bag_types_for_questionnarie = [];
  }

  @ViewChild('innerSlider') innerSlider: Slides

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionnaireModalPage');
    this.httpServerServiceProvider.getPreDefinedQuestions().subscribe((data) => {
      console.log(data);
      this.questions = data;
    }, (error) => {
      console.log(error);
    });

    this.httpServerServiceProvider.getBagTypes().subscribe((data) => {
      console.log(data);
      this.bag_types_for_questionnarie = data;
      let all_bag = { id: 0, name: "All Bag", notes: "" }
      this.bag_types_for_questionnarie.push(all_bag)
      this.bag_types_for_questionnarie.sort((a, b) => { return a.id - b.id });
    }, (error) => {
      console.log(error);
    });

    this.httpServerServiceProvider.getCopraBrand().subscribe(data => {
      this.copra_brands_for_questionnarie = data;
      let all_brand = { id: 0, name: "All Brand", notes: "" }
      this.copra_brands_for_questionnarie.push(all_brand)
      this.copra_brands_for_questionnarie.sort((a, b) => { return a.id - b.id });
      console.log(this.copra_brands_for_questionnarie);
    }, (error) => {
      console.log(error);
    });
  }

  slideNext() {
    this.innerSlider.slideNext();
  }

  slidePrevious() {
    this.innerSlider.slidePrev();
  }

  dismiss() {
    if (this.selected_bag_type != null) {
      let data = {
        question:this.selected_question,
        brand: this.selected_brand,
        bag: this.selected_bag_type
      }
      this.viewCtrl.dismiss(data);
    } else {
      this.viewCtrl.dismiss();
      this.displayToast('No Questions selected!')
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

}
