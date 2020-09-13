import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-service-terms',
  templateUrl: 'service-terms.html',
})

export class ServiceTermsPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceTermsPage');
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
